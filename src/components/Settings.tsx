import React from "react";

import { Select, Option } from "./Select";
import { Switch } from "./Switch";
import { titleCase } from "../utils/stringUtils";
import { MODELS, LANGUAGES } from "../config";
import { useNotificationPermission } from "../hooks/useNotificationPermission";
import { Transcriber } from "../hooks/useTranscriber";

interface SettingsProps {
    transcriber: Transcriber;
}

export const Settings: React.FC<SettingsProps> = ({ transcriber }) => {
    // @ts-ignore
    const hasWebGpu = !!navigator.gpu;
    const hasNotification = "Notification" in window;
    const { notificationsEnabled, toggleNotifications } =
        useNotificationPermission();

    return (
        <>
            <Select
                id='select-model'
                defaultValue={transcriber.model}
                setValue={transcriber.setModel}
                label='Choose a transcription model'
                info='Bigger is better, smaller is faster'
            >
                {Object.keys(MODELS).map((key) => (
                    <Option key={key} value={key}>
                        {`${key} (${MODELS[key]} MB)`}
                    </Option>
                ))}
            </Select>
            <Select
                id='select-language'
                defaultValue={transcriber.language}
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
            {hasWebGpu && (
                <Switch
                    id='switch-webgpu'
                    className='mt-2 mb-4 flex-row-reverse justify-between'
                    defaultChecked={false}
                    onChange={transcriber.setWebGPU}
                    label='Enable WebGPU support (experimental)'
                    info='Fast, but potentially unstable'
                    showLine={true}
                />
            )}
            {hasNotification && (
                <Switch
                    id='switch-notification'
                    className='mt-2 mb-4 flex-row-reverse justify-between'
                    defaultChecked={notificationsEnabled}
                    onChange={toggleNotifications}
                    overrideStoredValue={true}
                    label='Turn on notifications'
                    info='Alert when the transcription is done'
                    showLine={true}
                />
            )}
        </>
    );
};
