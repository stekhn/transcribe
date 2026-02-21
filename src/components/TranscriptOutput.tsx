import { Stack, Paper, Group, Text } from "@mantine/core";
import { formatAudioTimestamp } from "../utils/string";
import { TranscriberData } from "../hooks/useTranscriber";

interface TranscriptOutputProps {
  transcribedData: TranscriberData;
  showTimestamps: boolean;
}

export const TranscriptOutput: React.FC<TranscriptOutputProps> = ({
  transcribedData,
  showTimestamps,
}) => (
  <Stack gap='sm' my='md'>
    {showTimestamps ? (
      transcribedData.chunks.map((chunk, i) => (
        <Paper
          key={`${i}-${chunk.text}`}
          radius='md'
          p='sm'
          shadow='none'
        >
          <Group gap='xs' align='flex-start'>
            <Text size='sm' c='dimmed' style={{ fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>
              {formatAudioTimestamp(chunk.timestamp[0])}
            </Text>
            <Text size='sm' style={{ flex: 1 }}>
              {chunk.text}
            </Text>
          </Group>
        </Paper>
      ))
    ) : (
      <Paper radius='md' p='sm' shadow='none'>
        <Text size='sm'>
          {transcribedData.text
            ? transcribedData.text.trim()
            : "Transcription in progress. Enable timestamps to see the progress in real-time."}
        </Text>
      </Paper>
    )}
  </Stack>
);
