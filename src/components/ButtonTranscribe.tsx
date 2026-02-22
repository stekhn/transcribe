import React from "react";
import { Group, Loader, Button } from "@mantine/core";

interface TranscribeButtonProps {
  isModelLoading: boolean;
  isTranscribing: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export const TranscribeButton: React.FC<TranscribeButtonProps> = ({
  isModelLoading,
  isTranscribing,
  onClick,
}) => {
  return (
    <Button
      variant='filled'
      size='md'
      radius='md'
      style={{
        flex: "1 1 12rem",
        pointerEvents: isTranscribing || isModelLoading ? "none" : undefined,
      }}
      aria-label='Start transcription'
      onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
        if (onClick && !isTranscribing && !isModelLoading) {
          onClick(event);
        }
      }}
    >
      {isModelLoading ? (
        <Group gap='xs'>
          <Loader size='xs' color='white' type='bars' />
          Loading model...
        </Group>
      ) : isTranscribing ? (
        <Group gap='xs'>
          <Loader size='xs' color='white' type='bars' />
          Transcribing...
        </Group>
      ) : (
        "Transcribe"
      )}
    </Button>
  );
};
