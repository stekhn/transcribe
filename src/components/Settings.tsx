import React from "react";
import { Group, Stack } from "@mantine/core";
import { IconCircle, IconCircleCheck } from "@tabler/icons-react";

import { Select, Option } from "./Select";
import { titleCase } from "../utils/string";
import { MODELS, LANGUAGES } from "../config";
import { useModelCacheStatus } from "../hooks/useModelCacheStatus";
import { Transcriber } from "../hooks/useTranscriber";

interface SettingsProps {
  transcriber: Transcriber;
}

export const Settings: React.FC<SettingsProps> = ({ transcriber }) => {
  const { cacheStatus } = useModelCacheStatus(
    Object.keys(MODELS),
    transcriber.progressItems,
    transcriber.isModelLoading,
  );

  return (
    <Stack gap='xs'>
      <Select
        id='select-model'
        defaultValue={transcriber.model}
        setValue={transcriber.setModel}
        label='Choose a transcription model'
        info='Bigger is better, smaller is faster'
        renderOption={({ option }) => (
          <Group gap='xs' justify='space-between' wrap='nowrap'>
            <span>{option.label}</span>
            {cacheStatus[option.value] ? (
              <IconCircleCheck size='1rem' color='var(--mantine-color-dimmed)' />
            ) : (
              <IconCircle size='1rem' color='var(--mantine-color-dimmed)' />
            )}
          </Group>
        )}
      >
        {Object.keys(MODELS).map((key) => (
          <Option key={key} value={key}>
            {`${key} (${MODELS[key]} MB)`}
          </Option>
        ))}
      </Select>
      <Select
        id='select-language'
        defaultValue={transcriber.language || "en"}
        setValue={transcriber.setLanguage}
        label='Select the source language'
        info='English is best supported'
      >
        {Object.keys(LANGUAGES).map((key) => (
          <Option key={key} value={key}>
            {titleCase(LANGUAGES[key])}
          </Option>
        ))}
      </Select>
    </Stack>
  );
};
