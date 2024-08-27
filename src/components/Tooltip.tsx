import React, { useState } from "react";

interface Props {
    message: string;
    children: React.ReactNode;
}

const Tooltip: React.FC<Props> = ({ message, children }) => {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <div
            className='relative'
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
        >
            {children}
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

export default Tooltip;
