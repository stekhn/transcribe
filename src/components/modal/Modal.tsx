import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

export interface Props {
    show: boolean;
    onClose: () => void;
    onSubmit: () => void;
    submitText?: string;
    submitEnabled?: boolean;
    title: string | JSX.Element;
    content: string | JSX.Element;
}

export default function Modal({
    show,
    onClose,
    onSubmit,
    title,
    content,
    submitText,
    submitEnabled = true,
}: Props) {
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
                    <div className='fixed inset-0 bg-black bg-opacity-25' />
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
                            <Dialog.Panel className='w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-slate-800 dark:text-white p-6 text-left align-middle shadow-xl transition-all'>
                                <Dialog.Title
                                    as='h3'
                                    className='text-lg font-medium leading-6 text-slate-900 dark:text-white'
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
                                            className={`inline-flex ml-2 justify-center rounded-lg border border-transparent ${
                                                submitEnabled
                                                    ? "bg-blue-700"
                                                    : "bg-grey-300 dark:bg-grey-700"
                                            } px-4 py-2 text-sm font-medium text-blue-100 ${
                                                submitEnabled
                                                    ? "hover:bg-blue-800 focus:border-blue-500"
                                                    : ""
                                            }`}
                                            onClick={onSubmit}
                                        >
                                            {submitText}
                                        </button>
                                    )}
                                    <button
                                        type='button'
                                        className='inline-flex justify-center rounded-lg border border-transparent bg-slate-200 dark:bg-slate-700 px-4 py-2 text-sm font-medium dark:text-white hover:bg-blue-200 dark:hover:bg-slate-700 focus:border-blue-500'
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
}
