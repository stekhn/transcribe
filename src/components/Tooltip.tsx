import React, { useState } from "react";

interface TooltipProps {
    message: string;
    children: React.ReactNode;
}

export const Tooltip: React.FC<TooltipProps> = ({ message, children }) => {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <div className='relative'>
            <button
                className='rounded-full align-bottom focus:outline-none focus:ring-2 focus:ring-blue-700 dark:focus:ring-slate-400'
                onMouseEnter={() => setIsVisible(true)}
                onMouseLeave={() => setIsVisible(false)}
            >
                {children}
            </button>
            {isVisible && (
                <div
                    className={`absolute bottom-full left-1/2 transform -translate-x-1/2 w-max bg-blue-500 text-white text-sm rounded shadow-m shadow-slate-950/5 mb-2 py-1 px-2`}
                >
                    {message}
                    <div className='absolute left-1/2 transform -translate-x-1/2 bottom-[-4px] w-2 h-2 bg-blue-500 rotate-45'></div>
                </div>
            )}
        </div>
    );
};
