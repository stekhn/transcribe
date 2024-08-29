import React from "react";
import { useAudioRecorder } from "../hooks/useAudioRecorder";
import { formatAudioTimestamp } from "../utils/AudioUtils";
import { AudioPlayer } from "./AudioPlayer";

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
            <button
                type='button'
                className={`text-white text-center focus:outline-none focus:ring-2 focus:ring-blue-700 dark:focus:ring-slate-400 font-medium rounded-lg text-sm text-center whitespace-nowrap px-5 py-2.5 my-4 ${
                    recording
                        ? "bg-red-500 hover:bg-red-600"
                        : "bg-blue-500 hover:bg-blue-600 transition-colors duration-300"
                }`}
                onClick={handleToggleRecording}
            >
                {recording
                    ? `Stop Recording (${formatAudioTimestamp(duration)})`
                    : "Start Recording"}
            </button>

            {blobUrl && (
                <div className='flex-auto w-full ring-1 ring-slate-200 dark:ring-slate-700 bg-white dark:bg-slate-900 rounded-lg'>
                    <AudioPlayer src={blobUrl} />
                </div>
            )}
        </div>
    );
};
