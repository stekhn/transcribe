import { useEffect } from "react";
import { Switch as HeadlessSwitch } from "@headlessui/react";

import { Tooltip } from "./Tooltip";
import { HelpIcon } from "./Icons";
import { useLocalStorage } from "../hooks/useLocalStorage";

interface SwitchProps {
    id: string;
    onChange: (isChecked: boolean) => void;
    defaultChecked?: boolean;
    overrideStoredValue?: boolean;
    label?: string;
    info?: string;
    showLine?: boolean;
    className?: string;
}

export const Switch: React.FC<SwitchProps> = ({
    id,
    onChange,
    defaultChecked = false,
    overrideStoredValue = false,
    label,
    info,
    showLine = false,
    className,
}) => {
    const [storedValue, setStoredValue] = useLocalStorage(id, defaultChecked);
    const isChecked = overrideStoredValue ? defaultChecked : storedValue;

    const handleChange = (isChecked: boolean) => {
        setStoredValue(isChecked);
        onChange(isChecked);
    };

    useEffect(() => {
        onChange(storedValue);
    }, []);

    return (
        <div
            className={`flex flex-row items-center text-sm text-slate-500 gap-2 ${className}`}
        >
            <HeadlessSwitch
                id={id}
                className={`${
                    isChecked ? "bg-blue-500" : "bg-slate-200 dark:bg-slate-700"
                } relative inline-flex items-center shrink-0 grow-0 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-700 dark:focus:ring-slate-400 transition-colors duration-300 h-5 w-8`}
                checked={isChecked}
                onChange={handleChange}
            >
                <span
                    className={`${
                        isChecked ? "translate-x-3.5" : "translate-x-0.5"
                    } inline-block w-4 h-4 transform bg-white dark:bg-slate-100 rounded-full transition-transform duration-300`}
                />
            </HeadlessSwitch>
            {showLine && (
                <div className='hidden min-[440px]:flex grow justify-center'>
                    <hr className='w-11/12 border-1 border-slate-200 dark:border-slate-700' />
                </div>
            )}
            <div className='flex items-center gap-1'>
                {label && <label htmlFor={id}>{label}</label>}
                {info && (
                    <Tooltip message={info}>
                        <HelpIcon className='size-5 fill-slate-300 dark:fill-slate-500 hover:fill-blue-500' />
                    </Tooltip>
                )}
            </div>
        </div>
    );
};
