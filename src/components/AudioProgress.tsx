import React from "react";

interface AudioProgressProps {
    progress: number;
}

export const AudioProgress: React.FC<AudioProgressProps> = ({ progress }) => {
    return (
        <div className='w-full bg-slate-200 rounded-full h-1 dark:bg-slate-900'>
            <div
                className='bg-blue-500 h-1 rounded-full transition-all duration-100'
                style={{ width: `${Math.round(progress * 100)}%` }}
            ></div>
        </div>
    );
};
