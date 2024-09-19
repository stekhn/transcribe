import { formatAudioTimestamp } from "../utils/string";
import { TranscriberData } from "../hooks/useTranscriber";

interface TranscriptOutputProps {
    transcribedData: TranscriberData;
    showTimestamps: boolean;
}

export const TranscriptOutput: React.FC<TranscriptOutputProps> = ({
    transcribedData,
    showTimestamps,
}) => (
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
                        Transcription in progress. Enable timestamps to see the
                        progress in real-time.
                    </div>
                )}
            </div>
        )}
    </div>
);
