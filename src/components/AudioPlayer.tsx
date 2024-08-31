import React from "react";

import { PauseIcon, PlayIcon, SpeakerLoudIcon, SpeakerMuteIcon } from "./Icons";
import { secondsToTimecode } from "../utils/StringUtils";
import { useAudioPlayer } from "../hooks/useAudioPlayer";

interface AudioPlayerProps {
    src: string;
    type?: string;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ src, type }) => {
    const {
        currentTime,
        totalTime,
        isPlaying,
        togglePlaying,
        isMuted,
        toggleMuted,
        audioRef,
        progressBarRef,
        handleUpdate,
    } = useAudioPlayer({ src, type });

    return (
        <div className='flex grow gap-2 justify-between items-center h-10 rounded-lg ring-1 ring-slate-200 dark:ring-slate-700 bg-white dark:bg-slate-900 p-2'>
            <audio ref={audioRef}>
                <source src={src} type={type} />
            </audio>
            <PlayControl
                isPlaying={isPlaying}
                togglePlayPause={togglePlaying}
            />
            <ProgressBar
                progressBarRef={progressBarRef}
                currentTime={currentTime}
                totalTime={totalTime}
                handleUpdate={handleUpdate}
            />
            <VolumeControl isMuted={isMuted} toggleMute={toggleMuted} />
        </div>
    );
};

interface PlayControlProps {
    isPlaying: boolean;
    togglePlayPause: () => void;
}

const PlayControl: React.FC<PlayControlProps> = ({
    isPlaying,
    togglePlayPause,
}) => {
    return (
        <button
            className='flex items-center justify-center grow-0 shrink-0 size-7 basis-7 rounded-full hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-700 dark:focus:ring-slate-400'
            aria-label='Play/Pause audio'
            onClick={togglePlayPause}
        >
            {isPlaying ? (
                <PauseIcon className='size-4 fill-slate-900 dark:fill-slate-100' />
            ) : (
                <PlayIcon className='size-4 fill-slate-900 dark:fill-slate-100' />
            )}
        </button>
    );
};

interface ProgressBarProps {
    progressBarRef: React.RefObject<HTMLInputElement>;
    currentTime: number;
    totalTime: number;
    handleUpdate: (value: string) => void;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
    progressBarRef,
    currentTime,
    totalTime,
    handleUpdate,
}) => {
    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) =>
        handleUpdate(e.target.value);

    return (
        <div className='flex items-center justify-center gap-4 w-full'>
            <div className='text-sm text-slate-900 dark:text-slate-100 whitespace-nowrap tabular-nums hidden min-[320px]:inline'>
                <span className='hidden min-[380px]:inline'>
                    {secondsToTimecode(currentTime)}&nbsp;/
                </span>
                <span>&nbsp;{secondsToTimecode(totalTime)}</span>
            </div>
            <input
                ref={progressBarRef}
                type='range'
                step={0.1}
                defaultValue='0'
                onInput={handleInput}
            />
        </div>
    );
};

interface VolumeControlProps {
    isMuted: boolean;
    toggleMute: () => void;
}

const VolumeControl: React.FC<VolumeControlProps> = ({
    isMuted,
    toggleMute,
}) => {
    return (
        <div>
            <div className='flex items-center mx-1'>
                <button
                    className='flex items-center justify-center grow-0 shrink-0 size-7 basis-7 rounded-full hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-700 dark:focus:ring-slate-400'
                    aria-label='Mute/Unmute audio'
                    onClick={toggleMute}
                >
                    {isMuted ? (
                        <SpeakerMuteIcon className='size-5 fill-slate-900 dark:fill-slate-100' />
                    ) : (
                        <SpeakerLoudIcon className='size-5 fill-slate-900 dark:fill-slate-100' />
                    )}
                </button>
            </div>
        </div>
    );
};
