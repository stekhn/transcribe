import { Logo, InfoIcon } from "./components/Icons";
import { InfoButton } from "./components/InfoButton";
import { AudioManager } from "./components/AudioManager";
import { Transcript } from "./components/Transcript";
import { useTranscriber } from "./hooks/useTranscriber";

export const App: React.FC = () => {
    const transcriber = useTranscriber();

    return (
        <main className='relative flex flex-col items-center text-slate-900 dark:text-slate-100 p-5'>
            <header className='container p-5 w-full'>
                <div className='flex justify-center items-center gap-2 sm:gap-3 mb-2 sm:mb-4'>
                    <Logo
                        className='size-10 sm:size-14'
                        foregroundClassName='fill-blue-500'
                        backgroundClassName='fill-white dark:fill-slate-100'
                    />
                    <h1 className='text-3xl sm:text-5xl font-extrabold tracking-tight text-center '>
                        Transcribe
                    </h1>
                </div>
                <h2 className='text-l sm:text-xl font-semibold tracking-tight text-center'>
                    Use Whisper speech-to-text models directly in your browser.
                    Privacy-focused and free.{" "}
                    <InfoButton
                        icon={
                            <InfoIcon className='size-6 sm:size-7 fill-slate-300 dark:fill-slate-500 hover:fill-blue-500' />
                        }
                        content={<InfoContent />}
                    />
                </h2>
            </header>

            <section className='container flex items-center rounded-lg bg-white dark:bg-slate-800 shadow-xl shadow-slate-950/5 dark:shadow-slate-950/50 ring-1 ring-slate-200 dark:ring-slate-700 m-5 w-full'>
                <div className='w-full p-5'>
                    <AudioManager transcriber={transcriber} />
                </div>
            </section>
            {transcriber.output && (
                <section className='container flex items-center rounded-lg bg-white dark:bg-slate-800 shadow-xl shadow-slate-950/5 dark:shadow-slate-950/50 ring-1 ring-slate-200 dark:ring-slate-700 m-5 w-full'>
                    <Transcript transcriber={transcriber} />
                </section>
            )}
        </main>
    );
};

const InfoContent: React.FC = () => {
    return (
        <>
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
                is a open-source speech recognition model developed by OpenAI.
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
                , the creator of Transformers.js and many cool, browser-based AI
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
        </>
    );
};
