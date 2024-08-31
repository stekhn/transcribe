import { useState } from "react";

import { Switch } from "./Switch";
import { Transcriber } from "../hooks/useTranscriber";
import { formatAudioTimestamp } from "../utils/AudioUtils";
import { millisecondsToTime, secondsToSRT } from "../utils/StringUtils";
import { ClipboardIcon, ClockIcon, StopIcon } from "./Icons";

interface TranscriptProps {
    transcriber: Transcriber;
}

export const Transcript: React.FC<TranscriptProps> = ({ transcriber }) => {
    const transcribedData = transcriber.output;
    const [showTimestamps, setShowTimestamps] = useState(true);

    const formatText = (showTimestamps: boolean) => {
        if (showTimestamps) {
            return transcribedData?.chunks
                .map(
                    (chunk) =>
                        `${formatAudioTimestamp(
                            chunk.timestamp[0],
                        )}\t${chunk.text.trim()}`,
                )
                .join("\n");
        } else {
            return transcribedData?.text.trim();
        }
    };

    const copyToClipboard = async () => {
        if (navigator.clipboard && transcribedData?.text) {
            try {
                const text = formatText(showTimestamps);
                await navigator.clipboard.writeText(text || "");
            } catch (error) {
                console.error("Failed to copy:", error);
            }
        }
    };

    const saveBlob = (blob: Blob, filename: string) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        link.click();
        URL.revokeObjectURL(url);
    };

    const exportTXT = () => {
        const text = formatText(showTimestamps);
        const blob = new Blob([text || ""], { type: "text/plain" });
        saveBlob(blob, "transcript.txt");
    };

    const exportSRT = () => {
        const jsonData = transcribedData?.chunks ?? [];
        const srt = jsonData
            .map((entry, index) => {
                const start = secondsToSRT(entry.timestamp[0] as number);
                const end = secondsToSRT(entry.timestamp[1] as number);
                const text = entry.text.trim();
                return `${index + 1}\n${start} --> ${end}\n${text}\n`;
            })
            .join("\n");

        const blob = new Blob([srt], { type: "text/plain" });
        saveBlob(blob, "transcript.srt");
    };

    const exportJSON = () => {
        let jsonData = JSON.stringify(transcribedData?.chunks ?? [], null, 2);

        // post-process the JSON to make it more readable
        const regex = /(    "timestamp": )\[\s+(\S+)\s+(\S+)\s+\]/gm;
        jsonData = jsonData.replace(regex, "$1[$2 $3]");

        const blob = new Blob([jsonData], { type: "application/json" });
        saveBlob(blob, "transcript.json");
    };

    interface ExportButtonProps {
        label: string;
        ariaLabel?: string;
        onClick: (e: any) => void;
        className?: string;
    }

    const ExportButton: React.FC<ExportButtonProps> = ({
        label,
        onClick,
        className,
    }) => (
        <button
            onClick={onClick}
            className={`inline-flex items-center text-white font-medium text-sm text-center rounded-lg bg-blue-500 hover:bg-blue-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-700 dark:focus:ring-slate-400 px-4 py-2 ${className}`}
        >
            {label}
        </button>
    );

    interface FunctionButtonProps {
        icon: React.ReactElement;
        ariaLabel?: string;
        onClick: (e: any) => void;
        className?: string;
    }

    const FunctionButton: React.FC<FunctionButtonProps> = ({
        icon,
        ariaLabel,
        onClick,
        className,
    }) => (
        <button
            onClick={onClick}
            aria-label={ariaLabel}
            className={`inline-flex justify-center rounded-lg text-sm font-medium bg-slate-200 dark:bg-slate-700 transition-colors duration-300 dark:text-slate-100 hover:bg-slate-300 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-700 dark:focus:ring-slate-400 p-2 ${className}`}
        >
            {icon}
        </button>
    );

    return (
        <div className='w-full flex flex-col p-5'>
            <div className='flex flex-row items-center justify-between gap-2 flex-wrap'>
                {!transcribedData?.isBusy && !!transcriber.executionTime && (
                    <div className='flex flex-row items-center gap-1.5 text-sm text-slate-500 mr-auto'>
                        <ClockIcon className='size-5 fill-slate-300 dark:fill-slate-500' />
                        <span className='whitespace-nowrap'>
                            {millisecondsToTime(transcriber.executionTime)}
                        </span>
                    </div>
                )}
                {transcribedData?.isBusy && (
                    <div className='flex flex-row items-center gap-1.5 text-sm text-slate-500 mr-auto'>
                        <StopIcon className='size-5 fill-slate-300 dark:fill-slate-500' />
                        <span className='whitespace-nowrap tabular-nums'>
                            {transcribedData.tps?.toFixed(1)} it/s
                        </span>
                    </div>
                )}
                <Switch
                    id='switch-timestamps'
                    className='ml-auto flex-row-reverse'
                    checked={showTimestamps}
                    setChecked={setShowTimestamps}
                    label='Show timestamps'
                />
            </div>
            {transcribedData?.chunks && (
                <div className='my-5'>
                    {showTimestamps ? (
                        transcribedData.chunks.map((chunk, i) => (
                            <div
                                key={`${i}-${chunk.text}`}
                                className='w-full flex flex-row ring-1 ring-slate-200 dark:ring-slate-700 bg-white dark:bg-slate-900 rounded-lg p-2 px-3 mb-2 last:mb-0'
                            >
                                <div className='mr-5'>
                                    {formatAudioTimestamp(chunk.timestamp[0])}
                                </div>
                                {chunk.text}
                            </div>
                        ))
                    ) : (
                        <div className='w-full ring-1 ring-slate-200 dark:ring-slate-700 bg-white dark:bg-slate-900 rounded-lg p-2 px-3 mb-2 last:mb-0'>
                            {transcribedData.text ? (
                                transcribedData.text.trim()
                            ) : (
                                <div className='text-sm'>
                                    Transcription in progress. Enable timestamps
                                    to see the progress in real-time.
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
            {transcribedData && !transcribedData.isBusy && (
                <div className='flex flex-row flex-wrap items-center justify-center sm:justify-end gap-2'>
                    <ExportButton label='TXT' onClick={exportTXT} />
                    <ExportButton label='SRT' onClick={exportSRT} />
                    <ExportButton label='JSON' onClick={exportJSON} />
                    <FunctionButton
                        className='ml-auto'
                        icon={
                            <ClipboardIcon className='size-5 fill-slate-900 dark:fill-slate-100' />
                        }
                        ariaLabel='Copy to clipboard'
                        onClick={copyToClipboard}
                    />
                </div>
            )}
        </div>
    );
};
