import React, { useEffect, useState } from "react";
import { Stack, Group, Text, Collapse, UnstyledButton } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconChevronRight } from "@tabler/icons-react";

import { AudioPlayer } from "./AudioPlayer";
import { ModelProgress } from "./ModelProgress";
import { TranscribeButton } from "./ButtonTranscribe";
import { useProtocolHandler } from "../hooks/useProtocolHandler";
import { useShareWorker } from "../hooks/useShareWorker";
import { Transcriber } from "../hooks/useTranscriber";

import { Settings } from "./Settings";
import { Switch } from "./Switch";
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
      setProgress(0);
      setError({
        name: "Download Error",
        message: "The server might not allow cross-origin requests.",
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

  const [settingsOpened, { toggle: toggleSettings }] = useDisclosure(true);

  return (
    <Stack gap='lg'>
      <Stack gap="0.25rem">
        <Text size='sm' c='dimmed'>
          Audio source
        </Text>
        <Group gap='sm' grow preventGrowOverflow={false} wrap='wrap'>
          <FileTile
            icon={<IconFolder size='1.25rem' color='var(--mantine-primary-color-filled)' />}
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
          <UrlTile
            icon={<IconLink size='1.25rem' color='var(--mantine-primary-color-filled)' />}
            text={"Link"}
            ariaLabel='Enter audio URL'
            onUrlUpdate={(url) => {
              transcriber.onInputChange();
              setAudioDownloadUrl(url);
            }}
          />
          {navigator.mediaDevices && (
            <RecordTile
              icon={<IconMicrophone size='1.25rem' color='var(--mantine-primary-color-filled)' />}
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
      <div>
        <UnstyledButton onClick={toggleSettings} mb='xs'>
          <Group gap={4}>
            <Text size='sm' c='dimmed'>
              Settings
            </Text>
            <IconChevronRight
              size='0.875rem'
              color='var(--mantine-color-dimmed)'
              style={{
                transform: settingsOpened ? "rotate(90deg)" : "rotate(0deg)",
                transition: "transform 200ms ease",
              }}
            />
          </Group>
        </UnstyledButton>
        <Collapse in={settingsOpened}>
          <Stack gap='lg'>
            <Settings transcriber={transcriber} />
            <Stack gap='xs'>
              {hasWebGpu && (
                <Switch
                  id='switch-webgpu'
                  defaultChecked={false}
                  onChange={transcriber.setWebGPU}
                  label='WebGPU acceleration (experimental)'
                  showLine={true}
                />
              )}
              {hasNotification && (
                <Switch
                  id='switch-notification'
                  defaultChecked={notificationsEnabled}
                  onChange={toggleNotifications}
                  overrideStoredValue={true}
                  label='Notify when done'
                  showLine={true}
                />
              )}
            </Stack>
          </Stack>
        </Collapse>
      </div>
      <Stack pos='relative' style={{ zIndex: 10 }}>
        <Group gap='sm' wrap='wrap'>
          <AudioPlayer
            src={audioData?.url}
            type={audioData?.mimeType}
            loadingProgress={progress}
          />
          <TranscribeButton
            onClick={() => {
              if (audioData) {
                transcriber.start(audioData.buffer);
              }
            }}
            isModelLoading={transcriber.isModelLoading}
            isTranscribing={transcriber.isBusy}
            disabled={!audioData}
          />
        </Group>
        {transcriber.progressItems.length > 0 && (
          <Stack gap='sm'>
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
    </Stack>
  );
};
