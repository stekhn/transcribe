import { useState } from "react";
import { Switch } from "@headlessui/react";

import { TranscriberData } from "../hooks/useTranscriber";
import { formatAudioTimestamp } from "../utils/AudioUtils";

interface Props {
    transcribedData: TranscriberData | undefined;
}

export default function Transcript({ transcribedData }: Props) {
    const [showTimestamps, setShowTimestamps] = useState(true);

    const saveBlob = (blob: Blob, filename: string) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        link.click();
        URL.revokeObjectURL(url);
    };
    const formatTime = (seconds: number): string => {
        const date = new Date(0);
        date.setSeconds(seconds);
        const milliseconds = seconds * 1000;
        return (
            date.toISOString().substr(11, 8) +
            "," +
            ("000" + (milliseconds % 1000)).slice(-3)
        );
    };
    const exportSRT = () => {
        const jsonData = transcribedData?.chunks ?? [];
        const srt = jsonData
            .map((entry, index) => {
                const start = formatTime(entry.timestamp[0] as number);
                const end = formatTime(entry.timestamp[1] as number);
                const text = entry.text.trim();
                return `${index + 1}\n${start} --> ${end}\n${text}\n`;
            })
            .join("\n");

        const blob = new Blob([srt], { type: "text/plain" });
        saveBlob(blob, "transcript.srt");
    };

    const exportTXT = () => {
        const chunks = transcribedData?.chunks ?? [];
        const text = chunks
            .map((chunk) => chunk.text)
            .join("")
            .trim();

        const blob = new Blob([text], { type: "text/plain" });
        saveBlob(blob, "transcript.txt");
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
            <fieldset className='flex flex-row items-center justify-end mb-5'>
                <label className='text-sm text-gray-500 mr-2'>
                    Show timestamps
                </label>
                <Switch
                    checked={showTimestamps}
                    onChange={setShowTimestamps}
                    className={`${
                        showTimestamps ? "bg-teal-500" : "bg-gray-300"
                    }
                relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300`}
                >
                    <span
                        className={`${
                            showTimestamps ? "translate-x-6" : "translate-x-1"
                        }
                    inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300`}
                    />
                </Switch>
            </fieldset>
            {transcribedData?.chunks && !showTimestamps && (
                <div className='w-full flex flex-row bg-white rounded-lg ring-1 ring-slate-700/10 p-2 px-3'>
                    <div>
                        {transcribedData.chunks.map((chunk, i) => (
                            <span key={i}>{chunk.text}</span>
                        ))}
                    </div>
                </div>
            )}
            {transcribedData?.chunks &&
                showTimestamps &&
                transcribedData.chunks.map((chunk, i) => (
                    <div
                        key={`${i}-${chunk.text}`}
                        className='w-full flex flex-row mb-2 bg-white rounded-lg ring-1 ring-slate-700/10 p-2 px-3'
                    >
                        <div className='mr-5'>
                            {formatAudioTimestamp(chunk.timestamp[0])}
                        </div>
                        {chunk.text}
                    </div>
                ))}
            {transcribedData && !transcribedData.isBusy && (
                <div className='flex items-center ml-auto mt-5'>
                    <div>
                        <button
                            onClick={exportTXT}
                            className='text-white bg-teal-500 hover:bg-teal-600 focus:ring-4 focus:ring-teal-300 font-medium rounded-lg text-sm px-4 py-2 text-center ml-2 dark:bg-teal-600 dark:hover:bg-teal-700 dark:focus:ring-teal-800 inline-flex items-center'
                        >
                            Export TXT
                        </button>
                        <button
                            onClick={exportSRT}
                            className='text-white bg-teal-500 hover:bg-teal-600 focus:ring-4 focus:ring-teal-300 font-medium rounded-lg text-sm px-4 py-2 text-center ml-2 dark:bg-teal-600 dark:hover:bg-teal-700 dark:focus:ring-teal-800 inline-flex items-center'
                        >
                            Export SRT
                        </button>
                        <button
                            onClick={exportJSON}
                            className='text-white bg-teal-500 hover:bg-teal-600 focus:ring-4 focus:ring-teal-300 font-medium rounded-lg text-sm px-4 py-2 text-center ml-2 dark:bg-teal-600 dark:hover:bg-teal-700 dark:focus:ring-teal-800 inline-flex items-center'
                        >
                            Export JSON
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
