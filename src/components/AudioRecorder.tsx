import React from "react";
import { Stack, Button, Paper } from "@mantine/core";

import { AudioPlayer } from "./AudioPlayer";
import { formatAudioTimestamp } from "../utils/string";
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
    <Stack gap='md' align='center'>
      <form
        style={{ width: "100%", marginTop: 8, marginBottom: 16 }}
        tabIndex={0}
      >
        <Button
          type='button'
          onClick={handleToggleRecording}
          variant='filled'
          color={recording ? "red" : undefined}
          fullWidth
          h={44}
          style={{ transition: "background-color 300ms" }}
        >
          {recording
            ? `Stop Recording (${formatAudioTimestamp(duration)})`
            : "Start Recording"}
        </Button>
      </form>

      {blobUrl && (
        <Paper
          withBorder
          style={{
            flex: "auto",
            width: "100%",
          }}
        >
          <AudioPlayer src={blobUrl} />
        </Paper>
      )}
    </Stack>
  );
};
