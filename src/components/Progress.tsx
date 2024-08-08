export default function Progress({
    text,
    percentage,
}: {
    text: string;
    percentage: number;
}) {
    percentage = percentage ?? 0;
    return (
        <div className='mt-2 w-full relative text-sm dark:text-slate-100 bg-slate-50 dark:bg-slate-900 ring-1 ring-slate-200 dark:ring-slate-700 rounded-md text-left overflow-hidden'>
            <div
                className='top-0 h-full bg-slate-300 dark:bg-slate-600 whitespace-nowrap px-2'
                style={{ width: `${percentage}%` }}
            >
                {text} ({`${percentage.toFixed(0)} %`})
            </div>
        </div>
    );
}
