import { useState } from "react";

import { Switch } from "./Switch";
import { Button } from "./Button";
import {
    ClipboardIcon,
    ClockIcon,
    DownloadIcon,
    ShareIcon,
    StopIcon,
} from "./Icons";
import { millisecondsToTime, secondsToSRT } from "../utils/StringUtils";
import { formatAudioTimestamp } from "../utils/AudioUtils";
import { Transcriber } from "../hooks/useTranscriber";

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

    const shareText = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: "Share Text",
                    text: formatText(showTimestamps),
                });
            } catch (error) {
                console.error("Failed to share text:", error);
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
                <div className='flex flex-col-reverse sm:flex-row flex-wrap items-center justify-between gap-4'>
                    <div className='flex flex-col min-[380px]:flex-row gap-2 w-full sm:w-auto'>
                        <Button
                            aria-label='Download text as text file'
                            onClick={exportTXT}
                            className='flex-1'
                        >
                            <DownloadIcon className='size-5 fill-slate-100' />{" "}
                            TXT
                        </Button>
                        <Button
                            aria-label='Download text as SRT file'
                            onClick={exportSRT}
                            className='flex-1'
                        >
                            <DownloadIcon className='size-5 fill-slate-100' />{" "}
                            SRT
                        </Button>
                        <Button
                            aria-label='Download text as JSON file'
                            onClick={exportJSON}
                            className='flex-1'
                        >
                            <DownloadIcon className='size-5 fill-slate-100' />{" "}
                            JSON
                        </Button>
                    </div>
                    <div className='flex flex-row gap-2 w-full sm:w-auto'>
                        {!!navigator.clipboard && (
                            <Button
                                isBlue={false}
                                aria-label='Copy to clipboard'
                                onClick={copyToClipboard}
                                className='flex-1'
                            >
                                <ClipboardIcon className='size-5 fill-slate-900 dark:fill-slate-100' />
                            </Button>
                        )}
                        {!!navigator.share && (
                            <Button
                                isBlue={false}
                                aria-label='Share text'
                                onClick={shareText}
                                className='flex-1'
                            >
                                <ShareIcon className='size-5 fill-slate-900 dark:fill-slate-100' />
                            </Button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
