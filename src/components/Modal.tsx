import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

interface ModalProps {
    show: boolean;
    onClose: () => void;
    onSubmit: () => void;
    submitText?: string;
    submitEnabled?: boolean;
    title: string | JSX.Element;
    content: string | JSX.Element;
}

export const Modal: React.FC<ModalProps> = ({
    show,
    onClose,
    onSubmit,
    title,
    content,
    submitText,
    submitEnabled = true,
}) => {
    return (
        <Transition appear show={show} as={Fragment}>
            <Dialog as='div' className='relative z-10' onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter='ease-out duration-300'
                    enterFrom='opacity-0'
                    enterTo='opacity-100'
                    leave='ease-in duration-200'
                    leaveFrom='opacity-100'
                    leaveTo='opacity-0'
                >
                    <div className='fixed inset-0 bg-slate-950 bg-opacity-50' />
                </Transition.Child>

                <div className='fixed inset-0 overflow-y-auto'>
                    <div className='flex min-h-full items-center justify-center p-4 text-center'>
                        <Transition.Child
                            as={Fragment}
                            enter='ease-out duration-300'
                            enterFrom='opacity-0 scale-95'
                            enterTo='opacity-100 scale-100'
                            leave='ease-in duration-200'
                            leaveFrom='opacity-100 scale-100'
                            leaveTo='opacity-0 scale-95'
                        >
                            <Dialog.Panel className='w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-slate-800 dark:text-slate-100 p-6 text-left align-middle shadow-xl transition-all'>
                                <Dialog.Title
                                    as='h3'
                                    className='text-lg font-medium leading-6 text-slate-900 dark:text-slate-100'
                                >
                                    {title}
                                </Dialog.Title>
                                <div className='mt-2 text-sm text-slate-500'>
                                    {content}
                                </div>

                                <div className='mt-4 flex flex-row-reverse'>
                                    {submitText && (
                                        <button
                                            type='button'
                                            disabled={!submitEnabled}
                                            className={`inline-flex ml-2 justify-center rounded-lg px-4 py-2 text-sm font-medium  ${
                                                submitEnabled
                                                    ? "text-white bg-blue-500 transition-colors duration-300 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-700 dark:focus:ring-slate-400"
                                                    : "text-slate-300 ring-1 ring-slate-200 dark:ring-slate-700 dark:text-slate-500"
                                            }`}
                                            onClick={onSubmit}
                                        >
                                            {submitText}
                                        </button>
                                    )}
                                    <button
                                        type='button'
                                        className='inline-flex justify-center rounded-lg text-sm font-medium bg-slate-200 dark:bg-slate-700 transition-colors duration-300 dark:text-slate-100 hover:bg-slate-300 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-700 dark:focus:ring-slate-400 px-4 py-2'
                                        onClick={onClose}
                                    >
                                        Close
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};
