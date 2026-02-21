import { Group, Button } from "@mantine/core";
import { IconDownload } from "@tabler/icons-react";
import { secondsToSRT } from "../utils/string";
import { formatText } from "../utils/transcript";
import { TranscriberData } from "../hooks/useTranscriber";

interface ExportButtonsProps {
  transcribedData: TranscriberData;
  showTimestamps: boolean;
}

const saveBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

const exportTXT = (
  transcribedData: TranscriberData,
  showTimestamps: boolean,
) => {
  const text = formatText(transcribedData, showTimestamps);
  const blob = new Blob([text || ""], { type: "text/plain" });
  saveBlob(blob, "transcript.txt");
};

const exportSRT = (transcribedData: TranscriberData) => {
  const jsonData = transcribedData?.chunks ?? [];
  const srt = jsonData
    .map((entry, index) => {
      const start = secondsToSRT(entry.timestamp[0] as number);
      const end = secondsToSRT(entry.timestamp[1] as number);
      const text = entry.text.trim();
      return `${index + 1}\n${start} --> ${end}\n${text}\n`;
    })
    .join("\n");

  const blob = new Blob([srt], { type: "text/plain" });
  saveBlob(blob, "transcript.srt");
};

const exportJSON = (transcribedData: TranscriberData) => {
  let jsonData = JSON.stringify(transcribedData?.chunks ?? [], null, 2);
  const regex = /(    "timestamp": )\[\s+(\S+)\s+(\S+)\s+\]/gm;
  jsonData = jsonData.replace(regex, "$1[$2 $3]");

  const blob = new Blob([jsonData], { type: "application/json" });
  saveBlob(blob, "transcript.json");
};

export const ExportButtons: React.FC<ExportButtonsProps> = ({
  transcribedData,
  showTimestamps,
}) => (
  <Group gap='xs' w={{ base: "100%", sm: "auto" }}>
    <Button
      variant='filled'
      leftSection={<IconDownload size='1.25rem' />}
      style={{ flex: 1 }}
      aria-label='Download text as text file'
      onClick={() => exportTXT(transcribedData, showTimestamps)}
    >
      Text
    </Button>
    <Button
      variant='filled'
      leftSection={<IconDownload size='1.25rem' />}
      style={{ flex: 1 }}
      aria-label='Download text as SRT file'
      onClick={() => exportSRT(transcribedData)}
    >
      SRT
    </Button>
    <Button
      variant='filled'
      leftSection={<IconDownload size='1.25rem' />}
      style={{ flex: 1 }}
      aria-label='Download text as JSON file'
      onClick={() => exportJSON(transcribedData)}
    >
      JSON
    </Button>
  </Group>
);
