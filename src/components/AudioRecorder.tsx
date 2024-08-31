import React from "react";
import clsx from "clsx";

import { AudioPlayer } from "./AudioPlayer";
import { Button } from "./Button";
import { formatAudioTimestamp } from "../utils/AudioUtils";
import { useAudioRecorder } from "../hooks/useAudioRecorder";

interface AudioRecorderProps {
    onRecordingComplete: (blob: Blob) => void;
}

export const AudioRecorder: React.FC<AudioRecorderProps> = ({
    onRecordingComplete,
}) => {
    const { recording, duration, blobUrl, startRecording, stopRecording } =
        useAudioRecorder(onRecordingComplete);

    const handleToggleRecording = () => {
        if (recording) {
            stopRecording();
        } else {
            startRecording();
        }
    };

    return (
        <div className='flex flex-col justify-center'>
            <Button
                type='button'
                onClick={handleToggleRecording}
                className={clsx("h-11 px-4 py-2 mt-2 mb-4", {
                    "bg-red-500 hover:bg-red-600": recording,
                    "bg-blue-500 hover:bg-blue-600 transition-colors duration-300":
                        !recording,
                })}
            >
                {recording
                    ? `Stop Recording (${formatAudioTimestamp(duration)})`
                    : "Start Recording"}
            </Button>

            {blobUrl && (
                <div className='flex-auto w-full ring-1 ring-slate-200 dark:ring-slate-700 bg-white dark:bg-slate-900 rounded-lg'>
                    <AudioPlayer src={blobUrl} />
                </div>
            )}
        </div>
    );
};
