import { Text, Box } from "@mantine/core";

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
    <Box
      px='sm'
      py='xs'
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: "var(--mantine-radius-md)",
        backgroundColor: "var(--mantine-color-default)",
        border: "1px solid var(--mantine-color-default-border)",
      }}
    >
      <Box
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          bottom: 0,
          width: `${percentage}%`,
          backgroundColor: "var(--mantine-color-default-border)",
          transition: "width 300ms ease",
        }}
      />
      <Text size='sm' style={{ position: "relative", whiteSpace: "nowrap" }}>
        {text} ({`${percentage.toFixed(0)} %`})
      </Text>
    </Box>
  );
};
