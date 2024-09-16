import React from "react";

interface ErrorMessageProps {
    error: { name: string; message: string };
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ error }) => {
    return (
        <div className='rounded-lg text-sm text-red-500 bg-red-50 dark:bg-red-950 p-2.5 px-4 mt-5'>
            <p>
                {error.name}: {error.message}
            </p>
        </div>
    );
};
