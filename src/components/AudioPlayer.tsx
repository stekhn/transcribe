import React, { useEffect, useCallback, useState, useRef } from "react";
import { useAudioPlayer } from "../hooks/useAudioPlayer";
import { PauseIcon, PlayIcon, SpeakerLoudIcon, SpeakerMuteIcon } from "./Icons";

interface AudioPlayerProps {
    audioUrl: string;
    mimeType: string;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
    audioUrl,
    mimeType,
}) => {
    const {
        currentAudio,
        audioRef,
        setDuration,
        duration,
        timeProgress,
        setTimeProgress,
        progressBarRef,
        isPlaying,
        setIsPlaying,
    } = useAudioPlayer({ audioUrl, mimeType });

    const playAnimationRef = useRef<number | null>(null);

    const updateProgress = useCallback(() => {
        if (audioRef.current && progressBarRef.current && duration) {
            const currentTime = audioRef.current.currentTime;
            setTimeProgress(currentTime);

            progressBarRef.current.value = currentTime.toString();
            progressBarRef.current.style.setProperty(
                "--range-progress",
                `${(currentTime / duration) * 100}%`,
            );
        }
    }, [duration, setTimeProgress, audioRef, progressBarRef]);

    const startAnimation = useCallback(() => {
        if (audioRef.current && progressBarRef.current && duration) {
            const animate = () => {
                updateProgress();
                playAnimationRef.current = requestAnimationFrame(animate);
            };
            playAnimationRef.current = requestAnimationFrame(animate);
        }
    }, [updateProgress, duration, audioRef, progressBarRef]);

    useEffect(() => {
        if (isPlaying) {
            audioRef.current?.play();
            startAnimation();
        } else {
            audioRef.current?.pause();
            if (playAnimationRef.current !== null) {
                cancelAnimationFrame(playAnimationRef.current);
                playAnimationRef.current = null;
            }
            updateProgress();
        }

        return () => {
            if (playAnimationRef.current !== null) {
                cancelAnimationFrame(playAnimationRef.current);
            }
        };
    }, [isPlaying, startAnimation, updateProgress, audioRef]);

    const onLoadedMetadata = () => {
        const seconds = audioRef.current?.duration;
        if (seconds !== undefined) {
            setDuration(seconds);
            if (progressBarRef.current) {
                progressBarRef.current.max = seconds.toString();
            }
        }
    };

    useEffect(() => {
        const currentAudioRef = audioRef.current;

        return () => {
            if (currentAudioRef) {
                currentAudioRef.onended = null;
            }
        };
    }, [audioRef]);

    return (
        <div className='flex grow gap-3 justify-between items-center h-11 rounded-lg ring-1 ring-slate-200 dark:ring-slate-700 bg-white dark:bg-slate-900 p-2'>
            <audio
                src={currentAudio.audioUrl}
                ref={audioRef}
                onLoadedMetadata={onLoadedMetadata}
            />
            <button
                className='flex items-center justify-center grow-0 shrink-0 size-7 basis-7 rounded-full hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-700 dark:focus:ring-slate-400'
                onClick={() => setIsPlaying((prev) => !prev)}
            >
                {isPlaying ? (
                    <PauseIcon className='size-4 fill-slate-900 dark:fill-slate-100' />
                ) : (
                    <PlayIcon className='size-4 fill-slate-900 dark:fill-slate-100' />
                )}
            </button>

            <ProgressBar
                progressBarRef={progressBarRef}
                audioRef={audioRef}
                timeProgress={timeProgress} // Pass timeProgress as a prop
                duration={duration}
                setTimeProgress={setTimeProgress}
            />
            <VolumeControl audioRef={audioRef} />
        </div>
    );
};

interface ProgressBarProps {
    progressBarRef: React.RefObject<HTMLInputElement>;
    audioRef: React.RefObject<HTMLAudioElement>;
    timeProgress: number;
    duration: number;
    setTimeProgress: React.Dispatch<React.SetStateAction<number>>;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
    progressBarRef,
    audioRef,
    timeProgress,
    duration,
    setTimeProgress,
}) => {
    const handleProgressChange = () => {
        if (audioRef.current && progressBarRef.current) {
            const newTime = Number(progressBarRef.current.value);
            audioRef.current.currentTime = newTime;

            setTimeProgress(newTime);

            progressBarRef.current.style.setProperty(
                "--range-progress",
                `${(newTime / duration) * 100}%`,
            );
        }
    };

    const formatTime = (time: number | undefined): string => {
        if (typeof time === "number" && !isNaN(time)) {
            const minutes = Math.floor(time / 60);
            const seconds = Math.floor(time % 60);

            const formatMinutes = minutes.toString().padStart(2, "0");
            const formatSeconds = seconds.toString().padStart(2, "0");

            return `${formatMinutes}:${formatSeconds}`;
        }
        return "00:00";
    };

    return (
        <div className='flex items-center justify-center gap-4 w-full'>
            <div className='text-sm text-slate-900 dark:text-slate-100 whitespace-nowrap hidden min-[440px]:block tabular-nums'>
                {formatTime(timeProgress)} / {formatTime(duration)}
            </div>
            <input
                className='bg-slate-500'
                ref={progressBarRef}
                type='range'
                defaultValue='0'
                onChange={handleProgressChange}
            />
        </div>
    );
};

interface VolumeControlProps {
    audioRef: React.RefObject<HTMLAudioElement>;
}

const VolumeControl: React.FC<VolumeControlProps> = ({ audioRef }) => {
    const [muteVolume, setMuteVolume] = useState(false);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.muted = muteVolume;
        }
    }, [audioRef, muteVolume]);

    return (
        <div>
            <div className='flex items-center mr-1'>
                <button
                    className='flex items-center justify-center grow-0 shrink-0 size-7 basis-7 rounded-full hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-700 dark:focus:ring-slate-400'
                    onClick={() => setMuteVolume((prev) => !prev)}
                >
                    {muteVolume ? (
                        <SpeakerMuteIcon className='size-5 fill-slate-900 dark:fill-slate-100' />
                    ) : (
                        <SpeakerLoudIcon className='size-5 fill-slate-900 dark:fill-slate-100' />
                    )}
                </button>
            </div>
        </div>
    );
};
