import { useCallback, useMemo, useState } from "react";
import { useWorker } from "./useWorker";
import {
    DEFAULT_MODEL,
    DEFAULT_SUBTASK,
    DEFAULT_QUANTIZED,
    DEFAULT_MULTILINGUAL,
    DEFAULT_LANGUAGE,
} from "../config";

interface ProgressItem {
    file: string;
    loaded: number;
    progress: number;
    total: number;
    name: string;
    status: string;
}

interface TranscriberUpdateData {
    data: [
        string,
        { chunks: { text: string; timestamp: [number, number | null] }[] },
    ];
    text: string;
}

interface TranscriberCompleteData {
    data: {
        text: string;
        chunks: { text: string; timestamp: [number, number | null] }[];
    };
}

export interface TranscriberData {
    isBusy: boolean;
    text: string;
    chunks: { text: string; timestamp: [number, number | null] }[];
}

export interface Transcriber {
    onInputChange: () => void;
    isBusy: boolean;
    isModelLoading: boolean;
    progressItems: ProgressItem[];
    start: (audioData: AudioBuffer | undefined) => void;
    output?: TranscriberData;
    model: string;
    setModel: (model: string) => void;
    multilingual: boolean;
    setMultilingual: (model: boolean) => void;
    quantized: boolean;
    setQuantized: (model: boolean) => void;
    subtask: string;
    setSubtask: (subtask: string) => void;
    language?: string;
    setLanguage: (language: string) => void;
    executionTime?: number;
    error?: { name: string; message: string } | undefined;
}

export function useTranscriber(): Transcriber {
    const [transcript, setTranscript] = useState<TranscriberData | undefined>(
        undefined,
    );
    const [error, setError] = useState(undefined);
    const [isBusy, setIsBusy] = useState(false);
    const [isModelLoading, setIsModelLoading] = useState(false);
    const [executionTime, setExecutionTime] = useState(0);

    const [progressItems, setProgressItems] = useState<ProgressItem[]>([]);

    const webWorker = useWorker((event) => {
        const message = event.data;
        // Update the state with the result
        switch (message.status) {
            case "progress":
                // Model file progress: update one of the progress items.
                setProgressItems((prev) =>
                    prev.map((item) => {
                        if (item.file === message.file) {
                            return { ...item, progress: message.progress };
                        }
                        return item;
                    }),
                );
                break;
            case "update":
                // Received partial update
                // eslint-disable-next-line no-case-declarations
                const updateMessage = message as TranscriberUpdateData;
                setTranscript({
                    isBusy: true,
                    text: updateMessage.data[0],
                    chunks: updateMessage.data[1].chunks,
                });
                break;
            case "complete":
                // Received complete transcript
                // eslint-disable-next-line no-case-declarations
                const completeMessage = message as TranscriberCompleteData;
                setTranscript({
                    isBusy: false,
                    text: completeMessage.data.text,
                    chunks: completeMessage.data.chunks,
                });
                setIsBusy(false);
                break;
            case "execution-time":
                setExecutionTime(message.data);
                break;
            case "initiate":
                // Model file start load: add a new progress item to the list.
                setIsModelLoading(true);
                setProgressItems((prev) => [...prev, message]);
                break;
            case "ready":
                setIsModelLoading(false);
                break;
            case "error":
                setIsBusy(false);
                setIsModelLoading(false);
                setError(message.data);
                break;
            case "done":
                // Model file loaded: remove the progress item from the list.
                setProgressItems((prev) =>
                    prev.filter((item) => item.file !== message.file),
                );
                break;
            default:
                // initiate/download/done
                break;
        }
    });

    const [model, setModel] = useState<string>(DEFAULT_MODEL);
    const [subtask, setSubtask] = useState<string>(DEFAULT_SUBTASK);
    const [quantized, setQuantized] = useState<boolean>(DEFAULT_QUANTIZED);
    const [multilingual, setMultilingual] =
        useState<boolean>(DEFAULT_MULTILINGUAL);
    const [language, setLanguage] = useState<string>(DEFAULT_LANGUAGE);

    const onInputChange = useCallback(() => {
        setTranscript(undefined);
    }, []);

    const postRequest = useCallback(
        async (audioData: AudioBuffer | undefined) => {
            if (audioData) {
                setTranscript(undefined);
                setIsBusy(true);

                let audio;
                if (audioData.numberOfChannels === 2) {
                    const SCALING_FACTOR = Math.sqrt(2);

                    let left = audioData.getChannelData(0);
                    let right = audioData.getChannelData(1);

                    audio = new Float32Array(left.length);
                    for (let i = 0; i < audioData.length; ++i) {
                        audio[i] = (SCALING_FACTOR * (left[i] + right[i])) / 2;
                    }
                } else {
                    // If the audio is not stereo, we can just use the first channel:
                    audio = audioData.getChannelData(0);
                }

                webWorker.postMessage({
                    audio,
                    model,
                    multilingual,
                    quantized,
                    subtask: multilingual ? subtask : null,
                    language:
                        multilingual && language !== "auto" ? language : null,
                });
            }
        },
        [webWorker, model, multilingual, quantized, subtask, language],
    );

    const transcriber: Transcriber = useMemo(() => {
        return {
            onInputChange,
            isBusy,
            isModelLoading,
            progressItems,
            start: postRequest,
            output: transcript,
            model,
            setModel,
            multilingual,
            setMultilingual,
            quantized,
            setQuantized,
            subtask,
            setSubtask,
            language,
            setLanguage,
            executionTime,
            error,
        };
    }, [
        onInputChange,
        isBusy,
        isModelLoading,
        progressItems,
        postRequest,
        transcript,
        model,
        multilingual,
        quantized,
        subtask,
        language,
        executionTime,
        error,
    ]);

    return transcriber;
}
