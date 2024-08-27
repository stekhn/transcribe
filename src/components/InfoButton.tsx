import { useState } from "react";
import { Modal } from "./Modal";

interface InfoButtonProps {
    icon: React.ReactNode;
    content: React.ReactNode;
}

export const InfoButton: React.FC<InfoButtonProps> = ({ icon, content }) => {
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
                className='rounded-full align-sub focus:outline-none focus:ring-2 focus:ring-blue-700 dark:focus:ring-slate-400'
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
