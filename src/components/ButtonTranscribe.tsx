import React from "react";
import { Group, Loader, Button } from "@mantine/core";

interface TranscribeButtonProps {
  isModelLoading: boolean;
  isTranscribing: boolean;
  disabled?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export const TranscribeButton: React.FC<TranscribeButtonProps> = ({
  isModelLoading,
  isTranscribing,
  disabled,
  onClick,
}) => {
  const isBusy = isTranscribing || isModelLoading;

  const isDisabled = disabled && !isBusy;

  return (
    <Button
      variant='filled'
      size='sm'
      radius='md'
      style={{
        flex: "1 1 12rem",
        pointerEvents: isBusy || isDisabled ? "none" : undefined,
        ...(isDisabled ? {
          backgroundColor: "var(--mantine-color-default)",
          color: "var(--color-disabled)",
          border: "1px solid var(--mantine-color-default-border)",
        } : {}),
      }}
      aria-label='Start transcription'
      onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
        if (onClick && !isBusy && !disabled) {
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
