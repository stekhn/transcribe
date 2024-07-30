import { AudioManager } from "./components/AudioManager";
import Transcript from "./components/Transcript";
import { useTranscriber } from "./hooks/useTranscriber";

function App() {
    const transcriber = useTranscriber();

    return (
        <div className='flex flex-col items-center min-h-screen bg-gray-50 p-5'>
            <h1 className='text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 text-center mt-5'>
                Transcribe
            </h1>
            <h2 className='text-xl font-semibold tracking-tight text-slate-900 text-center mb-5 px-4'>
                Use Whisper speech-to-text models directly in your browser
            </h2>
            <div className='container flex justify-center items-center rounded-lg bg-white shadow-xl shadow-black/5 ring-1 ring-slate-700/10 m-5 w-full'>
                <div className='transform overflow-hidden p-5 text-left align-middle w-full transition-all'>
                    <AudioManager transcriber={transcriber} />
                </div>
            </div>

            {transcriber.output && (
                <div className='container flex justify-center items-center rounded-lg bg-white shadow-xl shadow-black/5 ring-1 ring-slate-700/10 m-5 w-full'>
                    <Transcript transcribedData={transcriber.output} />
                </div>
            )}

            <div className='mt-5'>
                Made with{" "}
                <a
                    className='underline'
                    href='https://github.com/xenova/transformers.js'
                >
                    Transformers.js{" "}
                </a>
                , based on{" "}
                <a
                    className='underline'
                    href='https://github.com/xenova/whisper-web/'
                >
                    Whisper Web
                </a>
            </div>
        </div>
    );
}

export default App;
