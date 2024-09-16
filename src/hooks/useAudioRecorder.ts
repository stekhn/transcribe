import { useState, useEffect, useRef, useMemo } from "react";
import { webmFixDuration } from "../utils/blobFix";
import { getMimeType } from "../utils/mimeTypes";

export const useAudioRecorder = (onRecordingComplete: (blob: Blob) => void) => {
    const [recording, setRecording] = useState(false);
    const [duration, setDuration] = useState(0);
    const [recordedBlob, setRecordedBlob] = useState<Blob | undefined>(
        undefined,
    );
    const [mimeType, setMimeType] = useState<string | undefined>(undefined);

    const streamRef = useRef<MediaStream | undefined>(undefined);
    const mediaRecorderRef = useRef<MediaRecorder | undefined>(undefined);
    const chunksRef = useRef<Blob[]>([]);

    const startRecording = async () => {
        try {
            chunksRef.current = [];
            setRecordedBlob(undefined);
            setDuration(0);

            if (!streamRef.current) {
                streamRef.current = await navigator.mediaDevices.getUserMedia({
                    audio: true,
                });
            }

            const mimeType = getMimeType();
            setMimeType(mimeType);

            const mediaRecorder = new MediaRecorder(streamRef.current, {
                mimeType,
            });
            mediaRecorderRef.current = mediaRecorder;

            const startTime = Date.now();

            mediaRecorder.addEventListener("dataavailable", (event) => {
                if (event.data && event.data.size > 0) {
                    chunksRef.current.push(event.data);
                }
            });

            mediaRecorder.addEventListener("stop", async () => {
                const duration = Date.now() - startTime;
                let blob = new Blob(chunksRef.current, { type: mimeType });

                if (mimeType === "audio/webm") {
                    try {
                        blob = await webmFixDuration(blob, duration, mimeType);
                    } catch (error) {
                        console.error("Error fixing WebM duration:", error);
                    }
                }

                setRecordedBlob(blob);
                onRecordingComplete(blob);
                chunksRef.current = [];
            });

            mediaRecorder.start();
            setRecording(true);

            const timer = setInterval(() => {
                setDuration((prevDuration) => prevDuration + 1);
            }, 1000);

            return () => clearInterval(timer);
        } catch (error) {
            console.error("Error starting recording:", error);
        }
    };

    const stopRecording = () => {
        if (
            mediaRecorderRef.current &&
            mediaRecorderRef.current.state === "recording"
        ) {
            mediaRecorderRef.current.stop();
            setRecording(false);
        }

        if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
            streamRef.current = undefined;
        }
    };

    const blobUrl = useMemo(() => {
        if (recordedBlob) {
            return URL.createObjectURL(recordedBlob);
        }
        return undefined;
    }, [recordedBlob]);

    useEffect(() => {
        return () => {
            if (
                mediaRecorderRef.current &&
                mediaRecorderRef.current.state !== "inactive"
            ) {
                mediaRecorderRef.current.stop();
            }
            if (streamRef.current) {
                streamRef.current.getTracks().forEach((track) => track.stop());
                streamRef.current = undefined;
            }
        };
    }, []);

    useEffect(() => {
        return () => {
            if (blobUrl) {
                URL.revokeObjectURL(blobUrl);
            }
        };
    }, [blobUrl]);

    return {
        recording,
        duration,
        blobUrl,
        mimeType,
        startRecording,
        stopRecording,
    };
};
