import { Tooltip } from "./Tooltip";
import { ChevronDownIcon, HelpIcon } from "./Icons";
import { useLocalStorage } from "../hooks/useLocalStorage";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    setValue: React.Dispatch<any>;
    label?: string;
    info?: string;
    children: React.ReactNode;
}

export const Select: React.FC<SelectProps> = ({
    id,
    defaultValue,
    setValue,
    label,
    info,
    children,
    ...props
}) => {
    const [storedValue, setStoredValue] = useLocalStorage(
        id || "",
        defaultValue,
    );

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newValue = e.target.value;
        setStoredValue(newValue);
        setValue(newValue);
    };

    return (
        <div className='text-sm text-slate-500'>
            <div className='flex items-center gap-1'>
                {label && <label htmlFor={id}>{label}</label>}
                {info && (
                    <Tooltip message={info}>
                        <HelpIcon className='size-5 fill-slate-300 dark:fill-slate-500 hover:fill-blue-500' />
                    </Tooltip>
                )}
            </div>
            <div className='relative'>
                <select
                    id={id}
                    className='appearance-none block bg-slate-50 text-slate-900 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700 dark:focus:ring-slate-400 dark:bg-slate-900 ring-1 ring-slate-200 dark:ring-slate-700 dark:placeholder-slate-400 dark:text-slate-100 w-full h-10 p-2.5 pr-8 mt-2 mb-4'
                    value={storedValue}
                    onChange={handleChange}
                    {...props}
                >
                    {children}
                </select>
                <ChevronDownIcon
                    className='group pointer-events-none absolute top-3 right-3 stroke-slate-900 w-4'
                    aria-hidden='true'
                />
            </div>
        </div>
    );
};

interface OptionProps extends React.OptionHTMLAttributes<HTMLOptionElement> {}

export const Option: React.FC<OptionProps> = (props) => {
    return <option {...props}></option>;
};
