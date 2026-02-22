import { Group, ActionIcon } from "@mantine/core";
import { IconClipboard, IconShare } from "@tabler/icons-react";
import { formatText } from "../utils/transcript";
import { TranscriberData } from "../hooks/useTranscriber";

interface ShareAndCopyButtonsProps {
  transcribedData: any;
  showTimestamps: boolean;
}

export const ShareAndCopyButtons: React.FC<ShareAndCopyButtonsProps> = ({
  transcribedData,
  showTimestamps,
}) => {
  const copyToClipboard = async (
    transcribedData: TranscriberData,
    showTimestamps: boolean,
  ) => {
    if (navigator.clipboard && transcribedData?.text) {
      try {
        const text = formatText(transcribedData, showTimestamps);
        await navigator.clipboard.writeText(text || "");
      } catch (error) {
        console.error("Failed to copy:", error);
      }
    }
  };

  const shareText = async (
    transcribedData: TranscriberData,
    showTimestamps: boolean,
  ) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Share Text",
          text: formatText(transcribedData, showTimestamps),
        });
      } catch (error) {
        console.error("Failed to share text:", error);
      }
    }
  };

  return (
    <Group gap='xs' w={{ base: "100%", sm: "auto" }}>
      {!!navigator.clipboard && (
        <ActionIcon
          variant='default'
          size='36'
          aria-label='Copy to clipboard'
          onClick={() => copyToClipboard(transcribedData, showTimestamps)}
          style={{ flex: 1 }}
        >
          <IconClipboard size='1.25rem' color='var(--mantine-primary-color-filled)' />
        </ActionIcon>
      )}
      {!!navigator.share && (
        <ActionIcon
          variant='default'
          size='36'
          aria-label='Share text'
          onClick={() => shareText(transcribedData, showTimestamps)}
          style={{ flex: 1 }}
        >
          <IconShare size='1.25rem' color='var(--mantine-primary-color-filled)' />
        </ActionIcon>
      )}
    </Group>
  );
};
