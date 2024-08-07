import { DetailedHTMLProps, InputHTMLAttributes } from "react";

export function UrlInput(
    props: DetailedHTMLProps<
        InputHTMLAttributes<HTMLInputElement>,
        HTMLInputElement
    >,
) {
    return (
        <div>
            <input
                {...props}
                type='url'
                className='my-2 bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg focus:border-blue-500 block w-full p-2.5 dark:bg-slate-900 dark:border-slate-700 dark:placeholder-slate-400 dark:text-white dark:focus:border-blue-500'
                placeholder='www.example.com'
                required
            />
        </div>
    );
}
