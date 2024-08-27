import {
    ReactNode,
    Dispatch,
    SelectHTMLAttributes,
    OptionHTMLAttributes,
} from "react";

import Tooltip from "./Tooltip";
import { ChevronDownIcon, Info } from "./Icons";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    setValue: Dispatch<any>;
    label?: string;
    info?: string;
    children: ReactNode;
}

export function Select(props: SelectProps) {
    return (
        <div className='text-sm text-slate-500'>
            <div className='flex items-center gap-1'>
                {props.label && <label htmlFor={props.id}>{props.label}</label>}
                {props.info && (
                    <Tooltip message={props.info}>
                        <Info className='size-5 fill-slate-300 hover:fill-blue-500' />
                    </Tooltip>
                )}
            </div>
            <div className='relative'>
                <select
                    id={props.id}
                    className='appearance-none bg-slate-50 text-slate-900 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700 dark:focus:ring-slate-400 block w-full p-2.5 pr-8 dark:bg-slate-900 ring-1 ring-slate-200 dark:ring-slate-700 dark:placeholder-slate-400 dark:text-slate-100 mt-2 mb-4'
                    defaultValue={props.defaultValue}
                    onChange={(e) => {
                        props.setValue(e.target.value);
                    }}
                >
                    {props.children}
                </select>
                <ChevronDownIcon
                    className='group pointer-events-none absolute top-3 right-3 stroke-slate-900 w-4'
                    aria-hidden='true'
                />
            </div>
        </div>
    );
}

interface OptionProps extends OptionHTMLAttributes<HTMLOptionElement> {}

export function Option(props: OptionProps) {
    return <option {...props}></option>;
}
