import { Switch as HeadlessSwitch } from "@headlessui/react";

interface SwitchProps {
    checked: boolean;
    onChange: (e: any) => void;
    label?: string;
}

export const Switch: React.FC<SwitchProps> = ({ checked, onChange, label }) => {
    return (
        <div className='flex flex-row items-center text-sm text-slate-500 gap-2'>
            {label && <label>{label}</label>}
            <HeadlessSwitch
                checked={checked}
                onChange={onChange}
                className={`${
                    checked ? "bg-blue-500" : "bg-slate-300 dark:bg-slate-700"
                } relative inline-flex h-6 w-11 items-center rounded-full focus:outline-none focus:ring-2 focus:ring-blue-700 dark:focus:ring-slate-400 transition-colors duration-300`}
            >
                <span
                    className={`${
                        checked ? "translate-x-6" : "translate-x-1"
                    } inline-block w-4 h-4 transform bg-white dark:bg-slate-900 rounded-full transition-transform duration-300`}
                />
            </HeadlessSwitch>
        </div>
    );
};
