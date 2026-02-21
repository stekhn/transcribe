import { createTheme, CSSVariablesResolver } from "@mantine/core";
import { generateColors } from "@mantine/colors-generator";

export const theme = createTheme({
  colors: {
    brand: generateColors("#3b82f6"),
    gray: [
      "#f6f8fc",
      "#edf1f7",
      "#dde4ef",
      "#c5cfdd",
      "#8d9cb2",
      "#627089",
      "#465468",
      "#313f54",
      "#1c2a3e",
      "#0d1629",
    ],
    dark: [
      "#C1C9D4",
      "#A8B3C0",
      "#8494A7",
      "#667A8D",
      "#435060",
      "#2D3A48",
      "#1F2937",
      "#151D2A",
      "#0E1520",
      "#060B12",
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
          transition: "background-color 300ms ease, color 300ms ease",
        },
      },
    },
    ActionIcon: {
      defaultProps: {
        variant: "subtle",
        radius: "xl",
      },
    },
    Divider: {
      styles: {
        root: {
          borderColor: "var(--mantine-color-default-border)",
        },
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
          fontWeight: "normal",
        },
        input: {
          backgroundColor: "var(--inset-bg)",
          border: "1px solid var(--mantine-color-default-border)",
        },
      },
    },
    Paper: {
      defaultProps: {
        radius: "md",
        shadow: "none",
        withBorder: true,
      },
      styles: {
        root: {
          "--paper-border-color": "var(--mantine-color-default-border)",
          backgroundColor: "var(--paper-bg)",
        },
      },
    },
    Modal: {
      defaultProps: {
        size: "md",
        radius: "md",
        shadow: "xl",
        centered: true,
      },
      styles: {
        header: {
          backgroundColor: "transparent",
        },
      },
    },
  },
  other: {
    iconSizes: {
      small: "1rem",
      medium: "1.25rem",
      large: "1.5rem",
    },
  },
});

export const cssVariablesResolver: CSSVariablesResolver = (theme) => ({
  variables: {},
  light: {
    "--mantine-color-body": theme.colors.gray[0],
    "--mantine-color-dimmed": theme.colors.gray[5],
    "--mantine-color-default-border": theme.colors.gray[2],
    "--mantine-color-default": theme.colors.gray[0],
    "--mantine-color-default-hover": "var(--mantine-primary-color-light)",
    "--mantine-color-default-color": "var(--mantine-color-text)",
    "--mantine-color-default-color-hover": "var(--mantine-primary-color-light-color)",
    "--inset-bg": theme.colors.gray[0],
    "--paper-bg": "#fff",
  },
  dark: {
    "--mantine-color-body": theme.colors.dark[7],
    "--mantine-color-dimmed": theme.colors.gray[4],
    "--mantine-color-default-border": theme.colors.dark[5],
    "--mantine-color-default": theme.colors.dark[7],
    "--mantine-color-default-hover": "var(--mantine-primary-color-light)",
    "--mantine-color-default-color": "var(--mantine-color-text)",
    "--mantine-color-default-color-hover": "var(--mantine-primary-color-light-color)",
    "--inset-bg": theme.colors.dark[7],
    "--paper-bg": theme.colors.dark[6],
  },
});
