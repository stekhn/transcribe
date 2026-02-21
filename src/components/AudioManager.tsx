import React, { useEffect, useState } from "react";
import { Stack, Group, Text } from "@mantine/core";

import { AudioPlayer } from "./AudioPlayer";
import { ModelProgress } from "./ModelProgress";
import { TranscribeButton } from "./ButtonTranscribe";
import { useProtocolHandler } from "../hooks/useProtocolHandler";
import { useShareWorker } from "../hooks/useShareWorker";
import { Transcriber } from "../hooks/useTranscriber";

import { Settings } from "./Settings";
import { Switch } from "./Switch";
import { AudioProgress } from "./AudioProgress";
import { ErrorMessage } from "./ErrorMessage";
import { useNotificationPermission } from "../hooks/useNotificationPermission";

import { UrlTile } from "./AudioInput";
import { FileTile } from "./AudioInput";
import { RecordTile } from "./AudioInput";

import {
  setAudioFromDownload,
  setAudioFromRecording,
  downloadAudioFromUrl,
  AudioSource,
} from "../utils/audio";
import { IconLink, IconFolder, IconMicrophone } from "@tabler/icons-react";

interface AudioManagerProps {
  transcriber: Transcriber;
}

export const AudioManager: React.FC<AudioManagerProps> = ({ transcriber }) => {
  const hasWebGpu = !!("gpu" in navigator);
  const hasNotification = "Notification" in window;
  const { notificationsEnabled, toggleNotifications } =
    useNotificationPermission();
  const [progress, setProgress] = useState(0);
  const [audioData, setAudioData] = useState<
    | {
        buffer: AudioBuffer;
        url: string;
        source: AudioSource;
        mimeType: string;
      }
    | undefined
  >(undefined);
  const [audioDownloadUrl, setAudioDownloadUrl] = useState<string | undefined>(
    undefined,
  );
  const [error, setError] = useState<{
    name: string;
    message: string;
  } | null>(null);

  const handleSetAudioFromDownload = async (
    data: ArrayBuffer,
    mimeType: string,
  ) => {
    try {
      await setAudioFromDownload(data, mimeType, setAudioData);
    } catch (err) {
      setError({
        name: "Decoding Error",
        message: "Failed to decode audio data.",
      });
    }
  };

  const handleSetAudioFromRecording = async (data: Blob) => {
    try {
      await setAudioFromRecording(data, setProgress, setAudioData);
    } catch (err) {
      setError({
        name: "Recording Error",
        message: "Failed to process recorded audio.",
      });
    }
  };

  const handleDownloadAudio = async (
    requestAbortController: AbortController,
  ) => {
    try {
      await downloadAudioFromUrl(
        audioDownloadUrl,
        requestAbortController,
        setAudioData,
        setProgress,
        handleSetAudioFromDownload,
      );
    } catch (err) {
      setError({
        name: "Download Error",
        message: "Failed to download audio.",
      });
    }
  };

  // Handle protocol and share worker
  useProtocolHandler("web+transcribe", (url: URL) => {
    const incomingUrl = url.toString();
    setAudioDownloadUrl(incomingUrl);
  });

  // Handle requests to http://localhost:5173/transcribe/?share-target
  useShareWorker((file, mimeType) => {
    setAudioFromDownload(file, mimeType, setAudioData);
  });

  // When URL changes, download audio
  useEffect(() => {
    if (audioDownloadUrl) {
      const requestAbortController = new AbortController();
      handleDownloadAudio(requestAbortController);
      return () => {
        requestAbortController.abort();
      };
    }
  }, [audioDownloadUrl]);

  return (
    <Stack gap='lg'>
      <Settings transcriber={transcriber} />
      <Stack gap="0.25rem">
        <Text size='sm' c='dimmed'>
          Add the audio source
        </Text>
        <Group gap='sm' grow preventGrowOverflow={false} wrap='wrap'>
          <UrlTile
            icon={<IconLink />}
            text={"Link"}
            ariaLabel='Enter audio URL'
            onUrlUpdate={(url) => {
              transcriber.onInputChange();
              setAudioDownloadUrl(url);
            }}
          />
          <FileTile
            icon={<IconFolder />}
            text={"File"}
            ariaLabel='Upload audio file'
            onFileUpdate={(decoded, blobUrl, mimeType) => {
              transcriber.onInputChange();
              setAudioData({
                buffer: decoded,
                url: blobUrl,
                source: AudioSource.FILE,
                mimeType: mimeType,
              });
            }}
          />
          {navigator.mediaDevices && (
            <RecordTile
              icon={<IconMicrophone />}
              text={"Record"}
              ariaLabel='Record audio'
              setAudioData={(blob) => {
                transcriber.onInputChange();
                handleSetAudioFromRecording(blob);
              }}
            />
          )}
        </Group>
      </Stack>
      <Stack gap='xs'>
        {hasWebGpu && (
          <Switch
            id='switch-webgpu'
            defaultChecked={false}
            onChange={transcriber.setWebGPU}
            label='Enable WebGPU support (experimental)'
            info='Fast, but potentially unstable'
            showLine={true}
          />
        )}
        {hasNotification && (
          <Switch
            id='switch-notification'
            defaultChecked={notificationsEnabled}
            onChange={toggleNotifications}
            overrideStoredValue={true}
            label='Turn on notifications'
            info='Alert when the transcription is done'
            showLine={true}
          />
        )}
      </Stack>
      <AudioProgress progress={progress} />
      {audioData && (
        <Stack pos='relative' style={{ zIndex: 10 }}>
          <Group gap='sm'>
            <AudioPlayer src={audioData.url} type={audioData.mimeType} />
            <TranscribeButton
              onClick={() => {
                transcriber.start(audioData.buffer);
              }}
              isModelLoading={transcriber.isModelLoading}
              isTranscribing={transcriber.isBusy}
            />
          </Group>
          {transcriber.progressItems.length > 0 && (
            <Stack pos='relative' style={{ zIndex: 10 }} gap='sm'>
              <Text size='sm' c='dimmed'>
                Loading Whisper model:
              </Text>
              {transcriber.progressItems.map((data) => (
                <ModelProgress
                  key={data.file}
                  text={data.file}
                  percentage={data.progress}
                />
              ))}
            </Stack>
          )}
          {error && <ErrorMessage error={error} />}
          {transcriber.error && <ErrorMessage error={transcriber.error} />}
        </Stack>
      )}
    </Stack>
  );
};
