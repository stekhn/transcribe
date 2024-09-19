import React, { useEffect, useState } from "react";

import { AudioPlayer } from "./AudioPlayer";
import { ModelProgress } from "./ModelProgress";
import { TranscribeButton } from "./ButtonTranscribe";
import { useProtocolHandler } from "../hooks/useProtocolHandler";
import { useShareWorker } from "../hooks/useShareWorker";
import { Transcriber } from "../hooks/useTranscriber";

import { Settings } from "./Settings";
import { AudioProgress } from "./AudioProgress";
import { ErrorMessage } from "./ErrorMessage";

import { UrlTile } from "./AudioInput";
import { FileTile } from "./AudioInput";
import { RecordTile } from "./AudioInput";

import {
    setAudioFromDownload,
    setAudioFromRecording,
    downloadAudioFromUrl,
} from "../utils/audio";
import { AnchorIcon, FolderIcon, MicrophoneIcon } from "./Icons";

export enum AudioSource {
    URL = "URL",
    FILE = "FILE",
    RECORDING = "RECORDING",
}

interface AudioManagerProps {
    transcriber: Transcriber;
}

export const AudioManager: React.FC<AudioManagerProps> = ({ transcriber }) => {
    const [progress, setProgress] = useState(0);
    const [audioData, setAudioData] = useState<
        | {
              buffer: AudioBuffer;
              url: string;
              source: AudioSource;
              mimeType: string;
          }
        | undefined
    >(undefined);
    const [audioDownloadUrl, setAudioDownloadUrl] = useState<
        string | undefined
    >(undefined);
    const [error, setError] = useState<{
        name: string;
        message: string;
    } | null>(null);

    const handleSetAudioFromDownload = async (
        data: ArrayBuffer,
        mimeType: string,
    ) => {
        try {
            await setAudioFromDownload(data, mimeType, setAudioData);
        } catch (err) {
            setError({
                name: "Decoding Error",
                message: "Failed to decode audio data.",
            });
        }
    };

    const handleSetAudioFromRecording = async (data: Blob) => {
        try {
            await setAudioFromRecording(data, setProgress, setAudioData);
        } catch (err) {
            setError({
                name: "Recording Error",
                message: "Failed to process recorded audio.",
            });
        }
    };

    const handleDownloadAudio = async (
        requestAbortController: AbortController,
    ) => {
        try {
            await downloadAudioFromUrl(
                audioDownloadUrl,
                requestAbortController,
                setAudioData,
                setProgress,
                handleSetAudioFromDownload,
            );
        } catch (err) {
            setError({
                name: "Download Error",
                message: "Failed to download audio.",
            });
        }
    };

    // Handle protocol and share worker
    useProtocolHandler("web+transcribe", (url: URL) => {
        const incomingUrl = url.toString();
        setAudioDownloadUrl(incomingUrl);
    });

    // Handle requests to http://localhost:5173/transcribe/?share-target
    useShareWorker((file, mimeType) => {
        setAudioFromDownload(file, mimeType, setAudioData);
    });

    // When URL changes, download audio
    useEffect(() => {
        if (audioDownloadUrl) {
            const requestAbortController = new AbortController();
            handleDownloadAudio(requestAbortController);
            return () => {
                requestAbortController.abort();
            };
        }
    }, [audioDownloadUrl]);

    return (
        <>
            <Settings transcriber={transcriber} />
            <div className='text-sm text-slate-500'>
                <label>Add the audio source</label>
                <div className='flex flex-col min-[440px]:flex-row w-full gap-2 mt-2 mb-5'>
                    <UrlTile
                        icon={<AnchorIcon />}
                        text={"Link"}
                        ariaLabel='Enter audio URL'
                        onUrlUpdate={(url) => {
                            transcriber.onInputChange();
                            setAudioDownloadUrl(url);
                        }}
                    />
                    <FileTile
                        icon={<FolderIcon />}
                        text={"File"}
                        ariaLabel='Upload audio file'
                        onFileUpdate={(decoded, blobUrl, mimeType) => {
                            transcriber.onInputChange();
                            setAudioData({
                                buffer: decoded,
                                url: blobUrl,
                                source: AudioSource.FILE,
                                mimeType: mimeType,
                            });
                        }}
                    />
                    {navigator.mediaDevices && (
                        <RecordTile
                            icon={<MicrophoneIcon />}
                            text={"Record"}
                            ariaLabel='Record audio'
                            setAudioData={(blob) => {
                                transcriber.onInputChange();
                                handleSetAudioFromRecording(blob);
                            }}
                        />
                    )}
                </div>
            </div>
            <AudioProgress progress={progress} />
            {audioData && (
                <>
                    <div className='flex flex-col sm:flex-row relative z-10 w-full gap-2 mt-5'>
                        <AudioPlayer
                            src={audioData.url}
                            type={audioData.mimeType}
                        />
                        <TranscribeButton
                            onClick={() => {
                                transcriber.start(audioData.buffer);
                            }}
                            isModelLoading={transcriber.isModelLoading}
                            isTranscribing={transcriber.isBusy}
                        />
                    </div>
                    {transcriber.progressItems.length > 0 && (
                        <div className='relative z-10 w-full text-sm mt-5'>
                            <label className='text-slate-500 block mb-2'>
                                Loading Whisper model:
                            </label>
                            {transcriber.progressItems.map((data) => (
                                <div key={data.file}>
                                    <ModelProgress
                                        text={data.file}
                                        percentage={data.progress}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                    {error && <ErrorMessage error={error} />}
                    {transcriber.error && (
                        <ErrorMessage error={transcriber.error} />
                    )}
                </>
            )}
        </>
    );
};
