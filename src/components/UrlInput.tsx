export const UrlInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (
    props,
) => {
    return (
        <div>
            <input
                {...props}
                type='url'
                className='my-2 bg-slate-50 text-slate-900 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700 dark:focus:ring-slate-400 block w-full p-2.5 dark:bg-slate-900 ring-1 ring-slate-200 dark:ring-slate-700 dark:placeholder-slate-400 dark:text-slate-100 dark:focus:outline-none focus:ring-2 focus:ring-blue-700 dark:focus:ring-slate-400 '
                placeholder='www.example.com'
                required
            />
        </div>
    );
};
