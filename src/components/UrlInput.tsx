import React from "react";

export const UrlInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (
    props,
) => {
    return (
        <form tabIndex={0}>
            <input
                type='url'
                className='block w-full h-11 text-sm rounded-lg text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-900 ring-1 ring-slate-200 dark:ring-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-700 dark:focus:ring-slate-400 dark:placeholder-slate-400 p-2.5 mt-2 mb-6'
                placeholder='www.example.com'
                required
                {...props}
            />
        </form>
    );
};
