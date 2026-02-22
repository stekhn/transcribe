import React from "react";
import { Group, Paper, ActionIcon, Text, Slider } from "@mantine/core";
import {
  IconPlayerPause,
  IconPlayerPlay,
  IconVolume,
  IconVolumeOff,
} from "@tabler/icons-react";

import { secondsToTimecode } from "../utils/string";
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
    <Paper shadow='none' h={42} px='xs' bg='var(--mantine-color-default)' style={{ flexGrow: 1 }}>
      <Group gap='xs' h='100%' align='center' justify='center'>
        <PlayControl isPlaying={isPlaying} togglePlayPause={togglePlaying} />
        <ProgressBar
          progressBarRef={progressBarRef}
          currentTime={currentTime}
          totalTime={totalTime}
          handleUpdate={handleUpdate}
        />
        <VolumeControl isMuted={isMuted} toggleMute={toggleMuted} />
        <audio ref={audioRef}>
          <source src={src} type={type} />
        </audio>
      </Group>
    </Paper>
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
    <ActionIcon
      variant='subtle'
      size='md'
      radius='xl'
      c='inherit'
      aria-label='Play/Pause audio'
      onClick={togglePlayPause}
    >
      {isPlaying ? (
        <IconPlayerPause size='1.25rem' />
      ) : (
        <IconPlayerPlay size='1.25rem' />
      )}
    </ActionIcon>
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
    <Group gap='xs' style={{ flex: 1 }} align='center'>
      <Text
        size='sm'
        visibleFrom='xs'
        style={{ whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums" }}
      >
        <Text component='span' visibleFrom='sm'>
          {secondsToTimecode(currentTime)}&nbsp;/
        </Text>
        <span>&nbsp;{secondsToTimecode(totalTime)}</span>
      </Text>
      <input
        ref={progressBarRef}
        type='range'
        step={0.1}
        defaultValue='0'
        onInput={handleInput}
        style={{ flex: 1 }}
      />
    </Group>
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
    <ActionIcon
      variant='subtle'
      size='md'
      radius='xl'
      c='inherit'
      aria-label='Mute/Unmute audio'
      onClick={toggleMute}
    >
      {isMuted ? (
        <IconVolumeOff size='1.25rem' />
      ) : (
        <IconVolume size='1.25rem' />
      )}
    </ActionIcon>
  );
};
