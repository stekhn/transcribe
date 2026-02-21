import React from "react";
import ReactDOM from "react-dom/client";
import { MantineProvider } from "@mantine/core";

import "@mantine/core/styles.css";
import "./App.css";
import "./css/audio-progress.css";

import { App } from "./App";
import { theme, cssVariablesResolver } from "./theme";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <MantineProvider
      theme={theme}
      cssVariablesResolver={cssVariablesResolver}
      defaultColorScheme='auto'
    >
      <App />
    </MantineProvider>
  </React.StrictMode>,
);
