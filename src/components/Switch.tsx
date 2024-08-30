import {
    Switch as HeadlessSwitch,
    SwitchProps as HeadlessSwitchProps,
} from "@headlessui/react";
import { Tooltip } from "./Tooltip";
import { HelpIcon } from "./Icons";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useEffect } from "react";

interface SwitchProps {
    id: string;
    checked: boolean;
    setChecked: (checked: boolean) => void;
    label?: string;
    info?: string;
    showLine?: boolean;
    className?: string;
}

export const Switch: React.FC<SwitchProps> = ({
    id,
    checked,
    setChecked,
    label,
    info,
    showLine = false,
    className,
}) => {
    const [storedValue, setStoredValue] = useLocalStorage(id, checked);

    const handleChange = (isChecked: boolean) => {
        console.log(isChecked);
        const newValue = isChecked;
        setStoredValue(newValue);
        setChecked(newValue);
    };

    useEffect(() => {
        setChecked(storedValue);
    }, []);

    return (
        <div
            className={`flex flex-row items-center text-sm text-slate-500 gap-2 ${className}`}
        >
            <HeadlessSwitch
                checked={checked}
                onChange={handleChange}
                className={`${
                    checked ? "bg-blue-500" : "bg-slate-200 dark:bg-slate-700"
                } relative inline-flex items-center shrink-0 grow-0 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-700 dark:focus:ring-slate-400 transition-colors duration-300 h-5 w-8`}
            >
                <span
                    className={`${
                        checked ? "translate-x-3.5" : "translate-x-0.5"
                    } inline-block w-4 h-4 transform bg-white dark:bg-slate-900 rounded-full transition-transform duration-300`}
                />
            </HeadlessSwitch>
            {showLine && (
                <div className='hidden min-[440px]:flex grow justify-center'>
                    <hr className='w-11/12 border-1 border-slate-200 dark:border-slate-700' />
                </div>
            )}
            <div className={`flex items-center gap-1`}>
                {label && <label>{label}</label>}
                {info && (
                    <Tooltip message={info}>
                        <HelpIcon className='size-5 fill-slate-300 dark:fill-slate-500 hover:fill-blue-500' />
                    </Tooltip>
                )}
            </div>
        </div>
    );
};
