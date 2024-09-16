import React, { useState } from "react";

import { Modal } from "./Modal";
import { AudioRecorder } from "./AudioRecorder";
import { SAMPLING_RATE, DEFAULT_AUDIO_URL } from "../config";

const UrlInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (
    props,
) => {
    return (
        <form tabIndex={0}>
            <input
                type='url'
                className='block w-full h-11 text-sm rounded-lg text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-900 ring-1 ring-slate-200 dark:ring-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-700 dark:focus:ring-slate-400 dark:placeholder-slate-400 p-2.5 mt-2 mb-6'
                placeholder='www.example.com'
                required
                {...props}
            />
        </form>
    );
};

interface TileProps {
    icon: React.ReactElement;
    text: string;
    ariaLabel?: string;
    onClick: () => void;
}

export const Tile: React.FC<TileProps> = ({
    icon,
    text,
    ariaLabel,
    onClick,
}) => {
    return (
        <button
            className='flex flex-1 items-center justify-center rounded-lg ring-1 ring-slate-200 dark:ring-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-700 dark:focus:ring-slate-400 h-10 basis-10 p-2'
            onClick={onClick}
            aria-label={ariaLabel}
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
    ariaLabel?: string;
    onUrlUpdate: (url: string) => void;
}

export const UrlTile: React.FC<UrlTileProps> = ({
    icon,
    text,
    ariaLabel,
    onUrlUpdate,
}) => {
    const [showModal, setShowModal] = useState(false);

    const onClick = () => setShowModal(true);
    const onClose = () => setShowModal(false);
    const onSubmit = (url: string) => {
        onUrlUpdate(url);
        onClose();
    };

    return (
        <>
            <Tile
                icon={icon}
                text={text}
                ariaLabel={ariaLabel}
                onClick={onClick}
            />
            <UrlModal show={showModal} onSubmit={onSubmit} onClose={onClose} />
        </>
    );
};

interface FileTileProps {
    icon: React.ReactElement;
    text: string;
    ariaLabel?: string;
    onFileUpdate: (
        decoded: AudioBuffer,
        blobUrl: string,
        mimeType: string,
    ) => void;
}

export const FileTile: React.FC<FileTileProps> = ({
    icon,
    text,
    ariaLabel,
    onFileUpdate,
}) => {
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
            <Tile
                icon={icon}
                text={text}
                ariaLabel={ariaLabel}
                onClick={() => elem.click()}
            />
        </>
    );
};

interface RecordTileProps {
    icon: React.ReactElement;
    text: string;
    ariaLabel?: string;
    setAudioData: (data: Blob) => void;
}

export const RecordTile: React.FC<RecordTileProps> = ({
    icon,
    text,
    ariaLabel,
    setAudioData,
}) => {
    const [showModal, setShowModal] = useState(false);

    const onClick = () => setShowModal(true);
    const onClose = () => setShowModal(false);
    const onSubmit = (data: Blob | undefined) => {
        if (data) {
            setAudioData(data);
            onClose();
        }
    };

    return (
        <>
            <Tile
                icon={icon}
                text={text}
                ariaLabel={ariaLabel}
                onClick={onClick}
            />
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
