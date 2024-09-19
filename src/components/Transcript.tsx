import { useState } from "react";

import { ExportButtons } from "./ExportButtons";
import { TranscriptOutput } from "./TranscriptOutput";
import { ShareAndCopyButtons } from "./ShareAndCopyButtons";
import { ClockIcon, StopIcon } from "./Icons";
import { Switch } from "./Switch";
import { millisecondsToTime } from "../utils/string";
import { useNotification } from "../hooks/useNotification";
import { Transcriber } from "../hooks/useTranscriber";

interface TranscriptProps {
    transcriber: Transcriber;
}

export const Transcript: React.FC<TranscriptProps> = ({ transcriber }) => {
    const transcribedData = transcriber.output;
    const [showTimestamps, setShowTimestamps] = useState(true);

    useNotification({
        isTriggered: !transcribedData?.isBusy && !!transcriber.executionTime,
        title: "Transcribe",
        options: {
            body: `Transcription done in ${millisecondsToTime(
                transcriber.executionTime ?? 0,
            )}. Click to see the results.`,
        },
    });

    return (
        <div className='w-full flex flex-col p-5'>
            <div className='flex flex-row items-center justify-between gap-2 flex-wrap'>
                {!transcribedData?.isBusy && !!transcriber.executionTime && (
                    <div className='flex flex-row items-center gap-1.5 text-sm text-slate-500 mr-auto'>
                        <ClockIcon className='size-5 fill-slate-300 dark:fill-slate-500' />
                        <span className='whitespace-nowrap'>
                            {millisecondsToTime(transcriber.executionTime ?? 0)}
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
                    defaultChecked={showTimestamps}
                    onChange={setShowTimestamps}
                    label='Show timestamps'
                />
            </div>
            {transcribedData?.chunks && (
                <TranscriptOutput
                    transcribedData={transcribedData}
                    showTimestamps={showTimestamps}
                />
            )}
            {transcribedData && !transcribedData.isBusy && (
                <div className='flex flex-col-reverse sm:flex-row flex-wrap items-center justify-between gap-4'>
                    <ExportButtons
                        transcribedData={transcribedData}
                        showTimestamps={showTimestamps}
                    />
                    <ShareAndCopyButtons
                        transcribedData={transcribedData}
                        showTimestamps={showTimestamps}
                    />
                </div>
            )}
        </div>
    );
};
