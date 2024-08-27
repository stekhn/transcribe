import React, { useEffect, useState } from "react";
import axios from "axios";

import AudioPlayer from "./AudioPlayer";
import Progress from "./Progress";
import AudioRecorder from "./AudioRecorder";
import { TranscribeButton } from "./TranscribeButton";
import { Select, Option } from "./Select";
import { AnchorIcon, FolderIcon, MicrophoneIcon } from "./Icons";
import Modal from "./Modal";
import { UrlInput } from "./UrlInput";
import { Transcriber } from "../hooks/useTranscriber";
import { titleCase } from "../utils/StringUtils";
import { SAMPLING_RATE, DEFAULT_AUDIO_URL, LANGUAGES, MODELS } from "../config";

export enum AudioSource {
    URL = "URL",
    FILE = "FILE",
    RECORDING = "RECORDING",
}

export function AudioManager(props: { transcriber: Transcriber }) {
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
            <Settings transcriber={props.transcriber} />
            <div className='text-sm text-slate-500'>
                <label>Add the audio source</label>
                <div className='flex flex-col min-[440px]:flex-row w-full gap-2 mt-2 mb-5'>
                    <UrlTile
                        icon={<AnchorIcon />}
                        text={"Link"}
                        onUrlUpdate={(e) => {
                            props.transcriber.onInputChange();
                            setAudioDownloadUrl(e);
                        }}
                    />
                    <FileTile
                        icon={<FolderIcon />}
                        text={"File"}
                        onFileUpdate={(decoded, blobUrl, mimeType) => {
                            props.transcriber.onInputChange();
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
                                    props.transcriber.onInputChange();
                                    setAudioFromRecording(e);
                                }}
                            />
                        </>
                    )}
                </div>
            </div>
            {<AudioDataBar progress={progress} />}
            {audioData && (
                <>
                    <div className='flex flex-col sm:flex-row relative z-10 w-full gap-2 mt-5'>
                        <AudioPlayer
                            audioUrl={audioData.url}
                            mimeType={audioData.mimeType}
                        />
                        <TranscribeButton
                            onClick={() => {
                                props.transcriber.start(audioData.buffer);
                            }}
                            isModelLoading={props.transcriber.isModelLoading}
                            isTranscribing={props.transcriber.isBusy}
                        />
                    </div>
                    {props.transcriber.progressItems.length > 0 && (
                        <div className='relative z-10 w-full text-sm mt-5'>
                            <label className='text-slate-500 block mb-2'>
                                Loading Whisper model:
                            </label>
                            {props.transcriber.progressItems.map((data) => (
                                <div key={data.file}>
                                    <Progress
                                        text={data.file}
                                        percentage={data.progress}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                    {props.transcriber.error && (
                        <Error error={props.transcriber.error} />
                    )}
                </>
            )}
        </>
    );
}

function Settings(props: { transcriber: Transcriber }) {
    return (
        <>
            <Select
                id='select-model'
                defaultValue={props.transcriber.model}
                setValue={props.transcriber.setModel}
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
                defaultValue={props.transcriber.language}
                setValue={props.transcriber.setLanguage}
                label='Select the source language'
                info='English is best supported'
            >
                {Object.keys(LANGUAGES).map((key) => (
                    <Option key={key} value={key}>
                        {titleCase(LANGUAGES[key])}
                    </Option>
                ))}
            </Select>
        </>
    );
}

function AudioDataBar(props: { progress: number }) {
    return <ProgressBar progress={`${Math.round(props.progress * 100)}%`} />;
}

function ProgressBar(props: { progress: string }) {
    return (
        <div className='w-full bg-slate-200 rounded-full h-1 dark:bg-slate-900'>
            <div
                className='bg-blue-500 h-1 rounded-full transition-all duration-100'
                style={{ width: props.progress }}
            ></div>
        </div>
    );
}

function Error(props: { error: { name: string; message: string } }) {
    return (
        <div className='rounded-lg text-sm text-red-500 bg-red-50 dark:bg-red-950 p-2.5 px-4 mt-5'>
            <p>
                {props.error.name}: {props.error.message}
            </p>
        </div>
    );
}

function Tile(props: {
    icon: JSX.Element;
    text?: string;
    onClick?: () => void;
}) {
    return (
        <button
            onClick={props.onClick}
            className='flex flex-1 items-center justify-center rounded-lg ring-1 ring-slate-200 dark:ring-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-700 dark:focus:ring-slate-400 p-2'
        >
            <div className='w-7 h-7'>{props.icon}</div>
            {props.text && (
                <div className='ml-2 break-text text-center text-md w-30'>
                    {props.text}
                </div>
            )}
        </button>
    );
}

function UrlTile(props: {
    icon: JSX.Element;
    text: string;
    onUrlUpdate: (url: string) => void;
}) {
    const [showModal, setShowModal] = useState(false);

    const onClick = () => {
        setShowModal(true);
    };

    const onClose = () => {
        setShowModal(false);
    };

    const onSubmit = (url: string) => {
        props.onUrlUpdate(url);
        onClose();
    };

    return (
        <>
            <Tile icon={props.icon} text={props.text} onClick={onClick} />
            <UrlModal show={showModal} onSubmit={onSubmit} onClose={onClose} />
        </>
    );
}

function FileTile(props: {
    icon: JSX.Element;
    text: string;
    onFileUpdate: (
        decoded: AudioBuffer,
        blobUrl: string,
        mimeType: string,
    ) => void;
}) {
    // const audioPlayer = useRef<HTMLAudioElement>(null);

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

            props.onFileUpdate(decoded, urlObj, mimeType);
        });
        reader.readAsArrayBuffer(files[0]);

        // Reset files
        elem.value = "";
    };

    return (
        <>
            <Tile
                icon={props.icon}
                text={props.text}
                onClick={() => elem.click()}
            />
        </>
    );
}

function RecordTile(props: {
    icon: JSX.Element;
    text: string;
    setAudioData: (data: Blob) => void;
}) {
    const [showModal, setShowModal] = useState(false);

    const onClick = () => {
        setShowModal(true);
    };

    const onClose = () => {
        setShowModal(false);
    };

    const onSubmit = (data: Blob | undefined) => {
        if (data) {
            props.setAudioData(data);
            onClose();
        }
    };

    return (
        <>
            <Tile icon={props.icon} text={props.text} onClick={onClick} />
            <RecordModal
                show={showModal}
                onSubmit={onSubmit}
                onClose={onClose}
            />
        </>
    );
}

function UrlModal(props: {
    show: boolean;
    onSubmit: (url: string) => void;
    onClose: () => void;
}) {
    const [url, setUrl] = useState(DEFAULT_AUDIO_URL);

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUrl(event.target.value);
    };

    const onSubmit = () => {
        props.onSubmit(url);
    };

    return (
        <Modal
            show={props.show}
            title={"From URL"}
            content={
                <>
                    {"Enter the URL of the audio file you want to load"}
                    <UrlInput onChange={onChange} value={url} />
                </>
            }
            onClose={props.onClose}
            submitText={"Load"}
            onSubmit={onSubmit}
        />
    );
}

function RecordModal(props: {
    show: boolean;
    onSubmit: (data: Blob | undefined) => void;
    onClose: () => void;
}) {
    const [audioBlob, setAudioBlob] = useState<Blob>();

    const onRecordingComplete = (blob: Blob) => {
        setAudioBlob(blob);
    };

    const onSubmit = () => {
        props.onSubmit(audioBlob);
        setAudioBlob(undefined);
    };

    const onClose = () => {
        props.onClose();
        setAudioBlob(undefined);
    };

    return (
        <Modal
            show={props.show}
            title={"From Recording"}
            content={
                <>
                    {"Record audio using your microphone"}
                    <AudioRecorder onRecordingComplete={onRecordingComplete} />
                </>
            }
            onClose={onClose}
            submitText={"Load"}
            submitEnabled={audioBlob !== undefined}
            onSubmit={onSubmit}
        />
    );
}
