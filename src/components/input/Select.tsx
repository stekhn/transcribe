import {
    ReactNode,
    Dispatch,
    SelectHTMLAttributes,
    OptionHTMLAttributes,
} from "react";

import { ChevronDownIcon } from "./Icons";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    setValue: Dispatch<any>;
    label?: string;
    children: ReactNode;
}

export function Select(props: SelectProps) {
    return (
        <div className='text-sm text-slate-500'>
            {props.label && <label htmlFor={props.id}>{props.label}</label>}
            <div className='relative'>
                <select
                    id={props.id}
                    className='appearance-none bg-slate-50 text-slate-900 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700 dark:focus:ring-slate-400 block w-full p-2.5 pr-8 dark:bg-slate-900 ring-1 ring-slate-200 dark:ring-slate-700 dark:placeholder-slate-400 dark:text-slate-100 mt-1 mb-3'
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
