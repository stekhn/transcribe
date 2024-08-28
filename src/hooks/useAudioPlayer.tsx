import { useState, RefObject, useRef } from "react";

export interface Audio {
    audioUrl: string;
    mimeType: string;
}

interface UseAudioPlayer {
    currentAudio: Audio;
    setCurrentAudio: React.Dispatch<React.SetStateAction<Audio>>;
    timeProgress: number;
    setTimeProgress: React.Dispatch<React.SetStateAction<number>>;
    duration: number;
    setDuration: React.Dispatch<React.SetStateAction<number>>;
    audioRef: RefObject<HTMLAudioElement>;
    progressBarRef: RefObject<HTMLInputElement>;
    isPlaying: boolean;
    setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useAudioPlayer = (initialAudio: Audio): UseAudioPlayer => {
    const [currentAudio, setCurrentAudio] = useState<Audio>(initialAudio);
    const [timeProgress, setTimeProgress] = useState<number>(0);
    const [duration, setDuration] = useState<number>(0);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);

    const audioRef = useRef<HTMLAudioElement>(null);
    const progressBarRef = useRef<HTMLInputElement>(null);

    return {
        currentAudio,
        setCurrentAudio,
        timeProgress,
        setTimeProgress,
        duration,
        setDuration,
        audioRef,
        progressBarRef,
        isPlaying,
        setIsPlaying,
    };
};
