import { useState, useRef, useEffect, useCallback } from "react";

export interface Audio {
  src: string;
  type?: string;
}

interface UseAudioPlayer {
  currentTime: number;
  totalTime: number;
  isPlaying: boolean;
  isMuted: boolean;
  audioRef: React.RefObject<HTMLAudioElement>;
  progressBarRef: React.RefObject<HTMLInputElement>;
  togglePlaying: () => void;
  toggleMuted: () => void;
  handleUpdate: (value: string) => void;
}

export const useAudioPlayer = ({ src, type }: Audio): UseAudioPlayer => {
  const [currentTime, setCurrentTime] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const progressBarRef = useRef<HTMLInputElement>(null);
  const playAnimationRef = useRef<number | null>(null);

  const updateProgress = useCallback(() => {
    if (audioRef.current && progressBarRef.current && totalTime) {
      const currentTime = audioRef.current.currentTime;
      setCurrentTime(currentTime);
      const progressPercent = (currentTime / totalTime) * 100;
      progressBarRef.current.value = currentTime.toString();
      progressBarRef.current.style.setProperty(
        "--range-progress",
        `${progressPercent}%`,
      );
    }
  }, [totalTime]);

  const startAnimation = useCallback(() => {
    const animate = () => {
      updateProgress();
      playAnimationRef.current = requestAnimationFrame(animate);
    };
    playAnimationRef.current = requestAnimationFrame(animate);
  }, [updateProgress]);

  const togglePlaying = useCallback(() => {
    if (isPlaying) {
      if (playAnimationRef.current !== null) {
        cancelAnimationFrame(playAnimationRef.current);
        playAnimationRef.current = null;
      }
      updateProgress();
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
      startAnimation();
    }
    setIsPlaying((prev) => !prev);
  }, [isPlaying, startAnimation, updateProgress]);

  const toggleMuted = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  const handleUpdate = useCallback(
    (value: string) => {
      if (audioRef.current) {
        audioRef.current.currentTime = parseFloat(value);
        setCurrentTime(audioRef.current.currentTime);
        updateProgress();
      }
    },
    [updateProgress],
  );

  useEffect(() => {
    if (!src) return;

    const onLoadedMetadata = () => {
      const seconds = audioRef.current?.duration || 0;
      setTotalTime(seconds);
      if (progressBarRef.current) {
        progressBarRef.current.max = seconds.toString();
      }
    };

    const handleAudioEnd = () => {
      setIsPlaying(false);
      updateProgress();
    };

    audioRef.current?.addEventListener("loadedmetadata", onLoadedMetadata);
    audioRef.current?.addEventListener("ended", handleAudioEnd);

    return () => {
      audioRef.current?.removeEventListener("loadedmetadata", onLoadedMetadata);
      audioRef.current?.removeEventListener("ended", handleAudioEnd);
    };
  }, [src, updateProgress]);

  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setTotalTime(0);

    if (progressBarRef.current) {
      progressBarRef.current.value = "0";
      progressBarRef.current.style.setProperty("--range-progress", "0%");
    }

    if (src && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.load();
    }
  }, [src]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  return {
    currentTime,
    totalTime,
    isPlaying,
    togglePlaying,
    isMuted,
    toggleMuted,
    audioRef,
    progressBarRef,
    handleUpdate,
  };
};
