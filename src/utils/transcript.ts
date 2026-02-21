import { formatAudioTimestamp } from "./string";
import { TranscriberData } from "../hooks/useTranscriber";

export const formatText = (
  transcribedData: TranscriberData,
  showTimestamps: boolean,
) => {
  if (showTimestamps) {
    return transcribedData?.chunks
      .map(
        (chunk) =>
          `${formatAudioTimestamp(chunk.timestamp[0])}\t${chunk.text.trim()}`,
      )
      .join("\n");
  } else {
    return transcribedData?.text.trim();
  }
};
