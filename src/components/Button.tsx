import React from "react";
import clsx from "clsx";

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    isBlue?: boolean;
    submitEnabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
    isBlue = true,
    submitEnabled = true,
    className,
    children,
    ...props
}) => {
    const buttonStyle = clsx(
        "inline-flex items-center text-sm justify-center font-medium whitespace-nowrap rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 px-4 py-2",
        {
            "text-white bg-blue-500 hover:bg-blue-600 focus:ring-blue-700 dark:focus:ring-slate-400":
                isBlue && submitEnabled,
            "text-slate-300 ring-1 ring-slate-200 dark:ring-slate-700 dark:text-slate-500":
                !submitEnabled,
            "justify-center bg-slate-200 dark:bg-slate-700 dark:text-slate-100 hover:bg-slate-300 dark:hover:bg-slate-700 focus:ring-blue-700 dark:focus:ring-slate-400 p-2":
                !isBlue && submitEnabled,
        },
        className,
    );

    return (
        <button className={buttonStyle} disabled={!submitEnabled} {...props}>
            {children}
        </button>
    );
};
