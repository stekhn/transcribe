import { Progress, Text, Paper } from "@mantine/core";

interface ModelProgressProps {
  text: string;
  percentage: number;
}

export const ModelProgress: React.FC<ModelProgressProps> = ({
  text,
  percentage,
}) => {
  percentage = percentage ?? 0;
  return (
    <Paper
      withBorder
      mt='xs'
      p='xs'
      style={{
        width: "100%",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Progress
        value={percentage}
        size='lg'
        color='gray'
        style={{ position: "relative" }}
      />
      <Text
        size='sm'
        style={{
          position: "absolute",
          top: "50%",
          left: 8,
          transform: "translateY(-50%)",
          whiteSpace: "nowrap",
          zIndex: 10,
          color: "inherit",
        }}
      >
        {text} ({`${percentage.toFixed(0)} %`})
      </Text>
    </Paper>
  );
};
