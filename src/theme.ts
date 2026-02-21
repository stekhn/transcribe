import { createTheme } from "@mantine/core";
import { generateColors } from "@mantine/colors-generator";

export const theme = createTheme({
  colors: {
    brand: generateColors("#3b82f6"),
    gray: [
      "#f8fafc",
      "#f1f5f9",
      "#e2e8f0",
      "#cbd5e1",
      "#94a3b8",
      "#64748b",
      "#475569",
      "#334155",
      "#1e293b",
      "#0f172a",
    ],
    dark: [
      "#C9D1D9",
      "#B1BAC4",
      "#8B949E",
      "#6E7781",
      "#484F58",
      "#30363D",
      "#21262D",
      "#161B22",
      "#0D1117",
      "#010409",
    ],
  },
  primaryShade: 4,
  primaryColor: "brand",
  fontFamily:
    'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
  defaultRadius: "md",
  components: {
    Container: {
      defaultProps: {
        size: "41rem",
      },
    },
    Button: {
      defaultProps: {
        variant: "filled",
        size: "sm",
        radius: "md",
      },
      styles: {
        root: {
          transition: "all 300ms ease",
        },
      },
    },
    ActionIcon: {
      defaultProps: {
        variant: "subtle",
        radius: "xl",
      },
    },
    Select: {
      defaultProps: {
        size: "sm",
        radius: "md",
      },
      styles: {
        label: {
          color: "var(--mantine-color-dimmed)",
        },
        input: {
          backgroundColor:
            "light-dark(var(--mantine-color-gray-0), var(--mantine-color-gray-8))",
        },
      },
    },
    Paper: {
      defaultProps: {
        radius: "md",
        withBorder: true,
        shadow: "none",
      },
    },
    Modal: {
      defaultProps: {
        size: "md",
        radius: "md",
        shadow: "xl",
        centered: true,
      },
    },
  },
  other: {
    heights: {
      button: "2.5rem",
      input: 44,
      tile: 40,
    },
    iconSizes: {
      small: "1rem",
      medium: "1.25rem",
      large: "1.5rem",
    },
  },
});
