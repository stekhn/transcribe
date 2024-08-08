import { useEffect, useRef } from "react";

export default function AudioPlayer(props: {
    audioUrl: string;
    mimeType: string;
}) {
    const audioPlayer = useRef<HTMLAudioElement>(null);
    const audioSource = useRef<HTMLSourceElement>(null);

    useEffect(() => {
        if (audioPlayer.current && audioSource.current) {
            audioSource.current.src = props.audioUrl;
            audioPlayer.current.load();
        }
    }, [props.audioUrl]);

    return (
        <div className='flex-auto rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900'>
            <audio
                ref={audioPlayer}
                controls
                className='w-full rounded-lg h-11 focus:outline-none focus:ring-2 focus:ring-blue-700 dark:focus:ring-slate-400 '
            >
                <source ref={audioSource} type={props.mimeType} />
            </audio>
        </div>
    );
}
