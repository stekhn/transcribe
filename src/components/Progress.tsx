export default function Progress({
    text,
    percentage,
}: {
    text: string;
    percentage: number;
}) {
    percentage = percentage ?? 0;
    return (
        <div className='mt-0.5 w-full relative text-sm dark:text-slate-100 background-bg-cyan-400 bg-slate-200 dark:bg-slate-900 ring-1 ring-slate-200 dark:ring-slate-700 rounded-lg text-left overflow-hidden'>
            <div
                className='top-0 h-full bg-blue-500 whitespace-nowrap px-2'
                style={{ width: `${percentage}%` }}
            >
                {text} ({`${percentage.toFixed(2)}%`})
            </div>
        </div>
    );
}
