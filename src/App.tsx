import { AudioManager } from "./components/AudioManager";
import Transcript from "./components/Transcript";
import { useTranscriber } from "./hooks/useTranscriber";

function App() {
    const transcriber = useTranscriber();

    return (
        <div className='flex flex-col items-center min-h-full bg-slate-50 p-5 dark:bg-slate-900 text-slate-900 dark:text-slate-100'>
            <header className='m-5'>
                <h1 className='text-3xl sm:text-5xl font-extrabold tracking-tight text-center '>
                    Transcribe
                </h1>
                <h2 className='text-xl font-semibold tracking-tight text-center mt-2'>
                    Use Whisper speech-to-text models directly in your browser.
                    <br />
                    Privacy-focused and free.
                </h2>
            </header>

            <section className='container flex items-center rounded-lg bg-white dark:bg-slate-800 shadow-xl shadow-slate-950/5 dark:shadow-slate-950/50 ring-1 ring-slate-200 dark:ring-slate-700 m-5 w-full'>
                <div className='transform overflow-hidden p-5 text-left align-middle w-full transition-all'>
                    <AudioManager transcriber={transcriber} />
                </div>
            </section>
            {transcriber.output && (
                <section className='container flex items-center rounded-lg bg-white dark:bg-slate-800 shadow-xl shadow-slate-950/5 dark:shadow-slate-950/50 ring-1 ring-slate-200 dark:ring-slate-700 m-5 w-full'>
                    <Transcript transcribedData={transcriber.output} />
                </section>
            )}

            <div className='flex flex-col flex-auto items-center'>&nbsp;</div>

            <footer className='text-center text-sm text-slate-500 mt-5'>
                Based on{" "}
                <a
                    className='underline'
                    href='https://github.com/xenova/whisper-web/'
                    target='_blank'
                >
                    Whisper Web
                </a>
                , made with{" "}
                <a
                    className='underline'
                    href='https://github.com/xenova/transformers.js'
                    target='_blank'
                >
                    Transformers.js
                </a>
                .<br /> Check out the code on{" "}
                <a
                    className='underline'
                    href='https://github.com/stekhn/transcribe/'
                    target='_blank'
                >
                    Github
                </a>
                .
            </footer>
        </div>
    );
}

export default App;
