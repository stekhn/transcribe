import { useState } from "react";
import { InfoIcon } from "./Icons";
import { Modal } from "./Modal";

export const InfoButton: React.FC = () => {
    const [showModal, setShowModal] = useState(false);

    const handleClick = () => {
        setShowModal(true);
    };

    const handleClose = () => {
        setShowModal(false);
    };

    return (
        <>
            <button
                className='rounded-full focus:outline-none focus:ring-inset focus:ring-2 focus:ring-blue-700 dark:focus:ring-slate-400'
                onClick={handleClick}
            >
                <InfoIcon className='size-8 stroke-slate-400 hover:stroke-blue-600 dark:hover:stroke-slate-900' />
            </button>
            <Modal
                show={showModal}
                title={"About Transcribe"}
                content={<InfoContent />}
                onClose={handleClose}
                onSubmit={() => {}}
            />
        </>
    );
};

const InfoContent: React.FC = () => {
    return (
        <div className='text-sm text-slate-900'>
            <p className='mb-3'>
                This prototype demonstrates the potential of local AI models for
                speech-to-text transcription, offering a cost-effective and
                privacy-friendly solution. Running directly in the browser, it
                eliminates the need for complicated setups or expensive
                services. However, transcription can be slow when using larger
                models.
            </p>
            <p className='mb-3'>
                Transcribe is based on{" "}
                <a
                    className='underline'
                    href='https://github.com/xenova/whisper-web/'
                    target='_blank'
                    rel='nofollow'
                >
                    Whisper Web
                </a>
                , built with{" "}
                <a
                    className='underline'
                    href='https://github.com/xenova/transformers.js'
                    target='_blank'
                    rel='nofollow'
                >
                    Transformers.js
                </a>
                , using{" "}
                <a
                    className='underline'
                    href='https://onnx.ai/'
                    target='_blank'
                    rel='nofollow'
                >
                    ONNX Whisper
                </a>{" "}
                models from{" "}
                <a
                    className='underline'
                    href='https://huggingface.co/models?sort=downloads&amp;search=onnx+whisper'
                    target='_blank'
                    rel='nofollow'
                >
                    Hugging Face
                </a>
                .{" "}
                <a
                    className='underline'
                    href='https://github.com/openai/whisper'
                    target='_blank'
                    rel='nofollow'
                >
                    Whisper
                </a>{" "}
                is a open-source speech recognition model developed
                by OpenAI.
            </p>
            <p className='mb-3'>
                If you'd like to support this project, consider donating to{" "}
                <a
                    className='underline'
                    href='https://github.com/sponsors/xenova'
                    target='_blank'
                    rel='nofollow'
                >
                    Joshua Lochner (xenova)
                </a>
                , the creator of Transformers.js and many cool browser-based AI
                demos.
            </p>
            <p>
                Check out this application's code on{" "}
                <a
                    className='underline'
                    href='https://github.com/stekhn/transcribe/'
                    target='_blank'
                >
                    Github
                </a>
                .
            </p>
        </div>
    );
};
