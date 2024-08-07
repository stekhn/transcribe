import { useEffect, useRef } from "react";

export default function AudioPlayer(props: {
    audioUrl: string;
    mimeType: string;
}) {
    const audioPlayer = useRef<HTMLAudioElement>(null);
    const audioSource = useRef<HTMLSourceElement>(null);

    // Updates src when url changes
    useEffect(() => {
        if (audioPlayer.current && audioSource.current) {
            audioSource.current.src = props.audioUrl;
            audioPlayer.current.load();
        }
    }, [props.audioUrl]);

    return (
        <div className='flex-auto border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-lg'>
            <audio ref={audioPlayer} controls className='w-full h-11'>
                <source ref={audioSource} type={props.mimeType}></source>
            </audio>
        </div>
    );
}
