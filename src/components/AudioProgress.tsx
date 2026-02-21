import React from "react";
import { Progress } from "@mantine/core";

interface AudioProgressProps {
  progress: number;
}

export const AudioProgress: React.FC<AudioProgressProps> = ({ progress }) => {
  return (
    <Progress
      value={Math.round(progress * 100)}
      size='xs'
      style={{
        width: "100%",
        transition: "all 100ms",
      }}
    />
  );
};
