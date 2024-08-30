import React, { useEffect, useState } from "react";
import axios from "axios";

import { AudioPlayer } from "./AudioPlayer";
import { AudioRecorder } from "./AudioRecorder";
import { Progress } from "./Progress";
import { TranscribeButton } from "./TranscribeButton";
import { Select, Option } from "./Select";
import { AnchorIcon, FolderIcon, MicrophoneIcon } from "./Icons";
import { Modal } from "./Modal";
import { Switch } from "./Switch";
import { UrlInput } from "./UrlInput";
import { Transcriber } from "../hooks/useTranscriber";
import { titleCase } from "../utils/StringUtils";
import { SAMPLING_RATE, DEFAULT_AUDIO_URL, LANGUAGES, MODELS } from "../config";

export enum AudioSource {
    URL = "URL",
    FILE = "FILE",
    RECORDING = "RECORDING",
}

interface AudiomanagerProps {
    transcriber: Transcriber;
}

export const AudioManager: React.FC<AudiomanagerProps> = ({ transcriber }) => {
    const [progress, setProgress] = useState(0);
    const [audioData, setAudioData] = useState<
        | {
              buffer: AudioBuffer;
              url: string;
              source: AudioSource;
              mimeType: string;
          }
        | undefined
    >(undefined);
    const [audioDownloadUrl, setAudioDownloadUrl] = useState<
        string | undefined
    >(undefined);

    const resetAudio = () => {
        setAudioData(undefined);
        setAudioDownloadUrl(undefined);
    };

    const setAudioFromDownload = async (
        data: ArrayBuffer,
        mimeType: string,
    ) => {
        const audioCTX = new AudioContext({
            sampleRate: SAMPLING_RATE,
        });
        const blobUrl = URL.createObjectURL(
            new Blob([data], { type: "audio/*" }),
        );
        const decoded = await audioCTX.decodeAudioData(data);
        setAudioData({
            buffer: decoded,
            url: blobUrl,
            source: AudioSource.URL,
            mimeType: mimeType,
        });
    };

    const setAudioFromRecording = async (data: Blob) => {
        resetAudio();
        setProgress(0);
        const blobUrl = URL.createObjectURL(data);
        const fileReader = new FileReader();
        fileReader.onprogress = (event) => {
            setProgress(event.loaded / event.total || 0);
        };
        fileReader.onloadend = async () => {
            const audioCTX = new AudioContext({
                sampleRate: SAMPLING_RATE,
            });
            const arrayBuffer = fileReader.result as ArrayBuffer;
            const decoded = await audioCTX.decodeAudioData(arrayBuffer);
            setAudioData({
                buffer: decoded,
                url: blobUrl,
                source: AudioSource.RECORDING,
                mimeType: data.type,
            });
        };
        fileReader.readAsArrayBuffer(data);
    };

    const downloadAudioFromUrl = async (
        requestAbortController: AbortController,
    ) => {
        if (audioDownloadUrl) {
            try {
                setAudioData(undefined);
                setProgress(0);
                const { data, headers } = (await axios.get(audioDownloadUrl, {
                    signal: requestAbortController.signal,
                    responseType: "arraybuffer",
                    onDownloadProgress(progressEvent) {
                        setProgress(progressEvent.progress || 0);
                    },
                })) as {
                    data: ArrayBuffer;
                    headers: { "content-type": string };
                };

                let mimeType = headers["content-type"];
                if (!mimeType || mimeType === "audio/wave") {
                    mimeType = "audio/wav";
                }
                setAudioFromDownload(data, mimeType);
            } catch (error) {
                console.log("Request failed or aborted", error);
            }
        }
    };

    // When URL changes, download audio
    useEffect(() => {
        if (audioDownloadUrl) {
            const requestAbortController = new AbortController();
            downloadAudioFromUrl(requestAbortController);
            return () => {
                requestAbortController.abort();
            };
        }
    }, [audioDownloadUrl]);

    return (
        <>
            <Settings transcriber={transcriber} />
            <div className='text-sm text-slate-500'>
                <label>Add the audio source</label>
                <div className='flex flex-col min-[440px]:flex-row w-full gap-2 mt-2 mb-5'>
                    <UrlTile
                        icon={<AnchorIcon />}
                        text={"Link"}
                        onUrlUpdate={(e) => {
                            transcriber.onInputChange();
                            setAudioDownloadUrl(e);
                        }}
                    />
                    <FileTile
                        icon={<FolderIcon />}
                        text={"File"}
                        onFileUpdate={(decoded, blobUrl, mimeType) => {
                            transcriber.onInputChange();
                            setAudioData({
                                buffer: decoded,
                                url: blobUrl,
                                source: AudioSource.FILE,
                                mimeType: mimeType,
                            });
                        }}
                    />
                    {navigator.mediaDevices && (
                        <>
                            <RecordTile
                                icon={<MicrophoneIcon />}
                                text={"Record"}
                                setAudioData={(e) => {
                                    transcriber.onInputChange();
                                    setAudioFromRecording(e);
                                }}
                            />
                        </>
                    )}
                </div>
            </div>
            {<AudioProgress progress={progress} />}
            {audioData && (
                <>
                    <div className='flex flex-col sm:flex-row relative z-10 w-full gap-2 mt-5'>
                        <AudioPlayer
                            src={audioData.url}
                            type={audioData.mimeType}
                        />
                        <TranscribeButton
                            onClick={() => {
                                transcriber.start(audioData.buffer);
                            }}
                            isModelLoading={transcriber.isModelLoading}
                            isTranscribing={transcriber.isBusy}
                        />
                    </div>
                    {transcriber.progressItems.length > 0 && (
                        <div className='relative z-10 w-full text-sm mt-5'>
                            <label className='text-slate-500 block mb-2'>
                                Loading Whisper model:
                            </label>
                            {transcriber.progressItems.map((data) => (
                                <div key={data.file}>
                                    <Progress
                                        text={data.file}
                                        percentage={data.progress}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                    {transcriber.error && <Error error={transcriber.error} />}
                </>
            )}
        </>
    );
};

interface SettingsProp {
    transcriber: Transcriber;
}

const Settings: React.FC<SettingsProp> = ({ transcriber }) => {
    // @ts-ignore
    const hasWebGPU = !!navigator.gpu;

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
                    <Option
                        key={key}
                        value={key}
                    >{`${key} (${MODELS[key]} MB)`}</Option>
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
            {hasWebGPU && (
                <Switch
                    className='mt-2 mb-4 flex-row-reverse justify-between'
                    checked={transcriber.webGPU}
                    onChange={transcriber.setWebGPU}
                    label='WebGPU support (experimental)'
                    info='Fast, but potentially unstable'
                    showLine={true}
                />
            )}
        </>
    );
};

interface AudioProgressProps {
    progress: number;
}

const AudioProgress: React.FC<AudioProgressProps> = ({ progress }) => {
    return (
        <div className='w-full bg-slate-200 rounded-full h-1 dark:bg-slate-900'>
            <div
                className='bg-blue-500 h-1 rounded-full transition-all duration-100'
                style={{ width: `${Math.round(progress * 100)}%` }}
            ></div>
        </div>
    );
};

interface ErrorProps {
    error: { name: string; message: string };
}

const Error: React.FC<ErrorProps> = ({ error }) => {
    return (
        <div className='rounded-lg text-sm text-red-500 bg-red-50 dark:bg-red-950 p-2.5 px-4 mt-5'>
            <p>
                {error.name}: {error.message}
            </p>
        </div>
    );
};

interface TileProps {
    icon: React.ReactElement;
    text: string;
    onClick: () => void;
}

const Tile: React.FC<TileProps> = ({ icon, text, onClick }) => {
    return (
        <button
            onClick={onClick}
            className='flex flex-1 items-center justify-center rounded-lg ring-1 ring-slate-200 dark:ring-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-700 dark:focus:ring-slate-400 h-10 basis-10 p-2'
        >
            <div className='w-7 h-7'>{icon}</div>
            {text && (
                <div className='ml-2 break-text text-center text-md w-30'>
                    {text}
                </div>
            )}
        </button>
    );
};

interface UrlTileProps {
    icon: React.ReactElement;
    text: string;
    onUrlUpdate: (url: string) => void;
}

const UrlTile: React.FC<UrlTileProps> = ({ icon, text, onUrlUpdate }) => {
    const [showModal, setShowModal] = useState(false);

    const onClick = () => {
        setShowModal(true);
    };

    const onClose = () => {
        setShowModal(false);
    };

    const onSubmit = (url: string) => {
        onUrlUpdate(url);
        onClose();
    };

    return (
        <>
            <Tile icon={icon} text={text} onClick={onClick} />
            <UrlModal show={showModal} onSubmit={onSubmit} onClose={onClose} />
        </>
    );
};

interface FileTileProps {
    icon: React.ReactElement;
    text: string;
    onFileUpdate: (
        decoded: AudioBuffer,
        blobUrl: string,
        mimeType: string,
    ) => void;
}

const FileTile: React.FC<FileTileProps> = ({ icon, text, onFileUpdate }) => {
    // Create hidden input element
    let elem = document.createElement("input");
    elem.type = "file";
    elem.oninput = (event) => {
        // Make sure we have files to use
        let files = (event.target as HTMLInputElement).files;
        if (!files) return;

        // Create a blob that we can use as an src for our audio element
        const urlObj = URL.createObjectURL(files[0]);
        const mimeType = files[0].type;

        const reader = new FileReader();
        reader.addEventListener("load", async (e) => {
            const arrayBuffer = e.target?.result as ArrayBuffer; // Get the ArrayBuffer
            if (!arrayBuffer) return;

            const audioCTX = new AudioContext({
                sampleRate: SAMPLING_RATE,
            });

            const decoded = await audioCTX.decodeAudioData(arrayBuffer);

            onFileUpdate(decoded, urlObj, mimeType);
        });
        reader.readAsArrayBuffer(files[0]);

        // Reset files
        elem.value = "";
    };

    return (
        <>
            <Tile icon={icon} text={text} onClick={() => elem.click()} />
        </>
    );
};

interface RecordTileProps {
    icon: React.ReactElement;
    text: string;
    setAudioData: (data: Blob) => void;
}

const RecordTile: React.FC<RecordTileProps> = ({
    icon,
    text,
    setAudioData,
}) => {
    const [showModal, setShowModal] = useState(false);

    const onClick = () => {
        setShowModal(true);
    };

    const onClose = () => {
        setShowModal(false);
    };

    const onSubmit = (data: Blob | undefined) => {
        if (data) {
            setAudioData(data);
            onClose();
        }
    };

    return (
        <>
            <Tile icon={icon} text={text} onClick={onClick} />
            <RecordModal
                show={showModal}
                onSubmit={onSubmit}
                onClose={onClose}
            />
        </>
    );
};

interface UrlModalProps {
    show: boolean;
    onSubmit: (url: string) => void;
    onClose: () => void;
}

const UrlModal: React.FC<UrlModalProps> = ({ show, onSubmit, onClose }) => {
    const [url, setUrl] = useState(DEFAULT_AUDIO_URL);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUrl(event.target.value);
    };

    const handleSubmit = () => onSubmit(url);

    return (
        <Modal
            show={show}
            title={"From URL"}
            content={
                <>
                    {"Enter the URL of the audio file you want to load"}
                    <UrlInput onChange={handleChange} value={url} />
                </>
            }
            onClose={onClose}
            submitText={"Load"}
            onSubmit={handleSubmit}
        />
    );
};

interface RecordModalProps {
    show: boolean;
    onSubmit: (data: Blob | undefined) => void;
    onClose: () => void;
}

const RecordModal: React.FC<RecordModalProps> = ({
    show,
    onSubmit,
    onClose,
}) => {
    const [audioBlob, setAudioBlob] = useState<Blob>();

    const onRecordingComplete = (blob: Blob) => {
        setAudioBlob(blob);
    };

    const handleSubmit = () => {
        onSubmit(audioBlob);
        setAudioBlob(undefined);
    };

    const handleClose = () => {
        onClose();
        setAudioBlob(undefined);
    };

    return (
        <Modal
            show={show}
            title={"From Recording"}
            content={
                <>
                    {"Record audio using your microphone"}
                    <AudioRecorder onRecordingComplete={onRecordingComplete} />
                </>
            }
            onClose={handleClose}
            submitText={"Load"}
            submitEnabled={audioBlob !== undefined}
            onSubmit={handleSubmit}
        />
    );
};
