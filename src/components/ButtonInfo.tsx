import { useState } from "react";

import { Modal } from "./Modal";

// @ts-ignore
interface ButtonInfoProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    icon: React.ReactNode;
    content?: React.ReactNode;
}

export const ButtonInfo: React.FC<ButtonInfoProps> = ({ icon, content }) => {
    const [showModal, setShowModal] = useState(false);

    const handleClick = () => {
        setShowModal(true);
    };

    const handleClose = () => {
        setShowModal(false);
    };

    return (
        <>
            <button
                className='rounded-full align-bottom focus:outline-none focus:ring-2 focus:ring-blue-700 dark:focus:ring-slate-400'
                aria-label='App info'
                onClick={handleClick}
            >
                {icon}
            </button>
            <Modal
                show={showModal}
                title={"About Transcribe"}
                content={
                    <div className='text-sm text-slate-900 dark:text-slate-100'>
                        {content}
                    </div>
                }
                onClose={handleClose}
                onSubmit={() => {}}
            />
        </>
    );
};
