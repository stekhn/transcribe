import { useState } from "react";
import { Stack, Group, Text, Container } from "@mantine/core";
import { IconClock, IconPlayerStop } from "@tabler/icons-react";

import { ExportButtons } from "./ExportButtons";
import { TranscriptOutput } from "./TranscriptOutput";
import { ShareAndCopyButtons } from "./ShareAndCopyButtons";
import { Switch } from "./Switch";
import { millisecondsToTime } from "../utils/string";
import { useNotification } from "../hooks/useNotification";
import { Transcriber } from "../hooks/useTranscriber";

interface TranscriptProps {
  transcriber: Transcriber;
}

export const Transcript: React.FC<TranscriptProps> = ({ transcriber }) => {
  const transcribedData = transcriber.output;
  const [showTimestamps, setShowTimestamps] = useState(true);

  useNotification({
    isTriggered: !transcribedData?.isBusy && !!transcriber.executionTime,
    title: "Transcribe",
    options: {
      body: `Transcription done in ${millisecondsToTime(
        transcriber.executionTime ?? 0,
      )}. Click to see the results.`,
    },
  });

  return (
    <Stack gap='md'>
      <Group justify='space-between' align='center' wrap='wrap' gap='sm'>
        {!transcribedData?.isBusy && !!transcriber.executionTime && (
          <Group gap='xs' style={{ marginRight: "auto" }}>
            <IconClock size='1.25rem' />
            <Text size='sm' c='dimmed' style={{ whiteSpace: "nowrap" }}>
              {millisecondsToTime(transcriber.executionTime ?? 0)}
            </Text>
          </Group>
        )}
        {transcribedData?.isBusy && (
          <Group gap='xs' style={{ marginRight: "auto" }}>
            <IconPlayerStop
              style={{
                width: "1.25rem",
                height: "1.25rem",
                color: "var(--mantine-color-gray-4)",
              }}
            />
            <Text
              size='sm'
              c='dimmed'
              style={{
                whiteSpace: "nowrap",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {transcribedData.tps?.toFixed(1)} it/s
            </Text>
          </Group>
        )}
        <Switch
          id='switch-timestamps'
          defaultChecked={showTimestamps}
          onChange={setShowTimestamps}
          label='Show timestamps'
          style={{ marginLeft: "auto" }}
        />
      </Group>
      {transcribedData?.chunks && (
        <TranscriptOutput
          transcribedData={transcribedData}
          showTimestamps={showTimestamps}
        />
      )}
      {transcribedData && !transcribedData.isBusy && (
        <Group justify='space-between' align='center' wrap='wrap' gap='lg'>
          <ShareAndCopyButtons
            transcribedData={transcribedData}
            showTimestamps={showTimestamps}
          />
          <ExportButtons
            transcribedData={transcribedData}
            showTimestamps={showTimestamps}
          />
        </Group>
      )}
    </Stack>
  );
};
