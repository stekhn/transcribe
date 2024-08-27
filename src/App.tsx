import { Logo } from "./components/Icons";
import { InfoButton } from "./components/InfoButton";
import { AudioManager } from "./components/AudioManager";
import { Transcript } from "./components/Transcript";
import { useTranscriber } from "./hooks/useTranscriber";

export const App: React.FC = () => {
    const transcriber = useTranscriber();

    return (
        <main className='relative flex flex-col items-center bg-slate-50 p-5 dark:bg-slate-900 text-slate-900 dark:text-slate-100'>
            <aside className='absolute top-2 right-2'>
                <InfoButton />
            </aside>
            <header className='container m-5 w-full'>
                <div className='flex justify-center items-center gap-2 sm:gap-3 mb-2 sm:mb-4'>
                    <Logo className='size-9 sm:size-14' />
                    <h1 className='text-3xl sm:text-5xl font-extrabold tracking-tight text-center '>
                        Transcribe
                    </h1>
                </div>
                <h2 className='text-l sm:text-xl font-semibold tracking-tight text-center'>
                    Use Whisper speech-to-text models directly in your browser.
                    <br />
                    Privacy-focused and free.
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
