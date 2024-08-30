interface IconProps {
    className?: string;
}

export const AnchorIcon: React.FC<IconProps> = ({ className }) => {
    return (
        <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth='1.5'
            stroke='currentColor'
            className={className}
        >
            <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244'
            />
        </svg>
    );
};

export const FolderIcon: React.FC<IconProps> = ({ className }) => {
    return (
        <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth='1.5'
            stroke='currentColor'
            className={className}
        >
            <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h3.879a1.5 1.5 0 011.06.44l2.122 2.12a1.5 1.5 0 001.06.44H18A2.25 2.25 0 0120.25 9v.776'
            />
        </svg>
    );
};

export const MicrophoneIcon: React.FC<IconProps> = ({ className }) => {
    return (
        <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className={className}
        >
            <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z'
            />
        </svg>
    );
};

export const ChevronDownIcon: React.FC<IconProps> = ({ className }) => {
    return (
        <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth='1.5'
            stroke='currentColor'
            className={className}
        >
            <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='m19.5 8.25-7.5 7.5-7.5-7.5'
            />
        </svg>
    );
};

export const InfoIcon: React.FC<IconProps> = ({ className }) => {
    return (
        <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 20 20'
            fill='currentColor'
            className={className}
        >
            <path
                fillRule='evenodd'
                d='M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-7-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM9 9a.75.75 0 0 0 0 1.5h.253a.25.25 0 0 1 .244.304l-.459 2.066A1.75 1.75 0 0 0 10.747 15H11a.75.75 0 0 0 0-1.5h-.253a.25.25 0 0 1-.244-.304l.459-2.066A1.75 1.75 0 0 0 9.253 9H9Z'
                clipRule='evenodd'
            />
        </svg>
    );
};

export const ClockIcon: React.FC<IconProps> = ({ className }) => {
    return (
        <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 16 16'
            fill='currentColor'
            className={className}
        >
            <path
                fillRule='evenodd'
                clipRule='evenodd'
                d='M1 8a7 7 0 1 1 14 0A7 7 0 0 1 1 8Zm7.75-4.25a.75.75 0 0 0-1.5 0V8c0 .414.336.75.75.75h3.25a.75.75 0 0 0 0-1.5h-2.5v-3.5Z'
            />
        </svg>
    );
};

export const HelpIcon: React.FC<IconProps> = ({ className }) => {
    return (
        <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 16 16'
            fill='currentColor'
            className={className}
        >
            <path
                fillRule='evenodd'
                clipRule='evenodd'
                d='M15 8A7 7 0 1 1 1 8a7 7 0 0 1 14 0Zm-6 3.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM7.293 5.293a1 1 0 1 1 .99 1.667c-.459.134-1.033.566-1.033 1.29v.25a.75.75 0 1 0 1.5 0v-.115a2.5 2.5 0 1 0-2.518-4.153.75.75 0 1 0 1.061 1.06Z'
            />
        </svg>
    );
};

export const PlayIcon: React.FC<IconProps> = ({ className }) => {
    return (
        <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 20 20'
            fill='currentColor'
            className={className}
        >
            <path d='M6.3 2.84A1.5 1.5 0 0 0 4 4.11v11.78a1.5 1.5 0 0 0 2.3 1.27l9.344-5.891a1.5 1.5 0 0 0 0-2.538L6.3 2.841Z' />
        </svg>
    );
};

export const PauseIcon: React.FC<IconProps> = ({ className }) => {
    return (
        <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 20 20'
            fill='currentColor'
            className={className}
        >
            <path d='M5.75 3a.75.75 0 0 0-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 0 0 .75-.75V3.75A.75.75 0 0 0 7.25 3h-1.5ZM12.75 3a.75.75 0 0 0-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 0 0 .75-.75V3.75a.75.75 0 0 0-.75-.75h-1.5Z' />
        </svg>
    );
};

export const StopIcon: React.FC<IconProps> = ({ className }) => {
    return (
        <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 20 20'
            fill='currentColor'
            className={className}
        >
            <path
                fillRule='evenodd'
                d='M2 10a8 8 0 1 1 16 0 8 8 0 0 1-16 0Zm5-2.25A.75.75 0 0 1 7.75 7h4.5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-.75.75h-4.5a.75.75 0 0 1-.75-.75v-4.5Z'
                clipRule='evenodd'
            />
        </svg>
    );
};

export const SpeakerLoudIcon: React.FC<IconProps> = ({ className }) => {
    return (
        <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 20 20'
            fill='currentColor'
            className={className}
        >
            <path d='M10.5 3.75a.75.75 0 0 0-1.264-.546L5.203 7H2.667a.75.75 0 0 0-.7.48A6.985 6.985 0 0 0 1.5 10c0 .887.165 1.737.468 2.52.111.29.39.48.7.48h2.535l4.033 3.796a.75.75 0 0 0 1.264-.546V3.75ZM16.45 5.05a.75.75 0 0 0-1.06 1.061 5.5 5.5 0 0 1 0 7.778.75.75 0 0 0 1.06 1.06 7 7 0 0 0 0-9.899Z' />
            <path d='M14.329 7.172a.75.75 0 0 0-1.061 1.06 2.5 2.5 0 0 1 0 3.536.75.75 0 0 0 1.06 1.06 4 4 0 0 0 0-5.656Z' />
        </svg>
    );
};

export const SpeakerMuteIcon: React.FC<IconProps> = ({ className }) => {
    return (
        <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 20 20'
            fill='currentColor'
            className={className}
        >
            <path d='M10.047 3.062a.75.75 0 0 1 .453.688v12.5a.75.75 0 0 1-1.264.546L5.203 13H2.667a.75.75 0 0 1-.7-.48A6.985 6.985 0 0 1 1.5 10c0-.887.165-1.737.468-2.52a.75.75 0 0 1 .7-.48h2.535l4.033-3.796a.75.75 0 0 1 .811-.142ZM13.78 7.22a.75.75 0 1 0-1.06 1.06L14.44 10l-1.72 1.72a.75.75 0 0 0 1.06 1.06l1.72-1.72 1.72 1.72a.75.75 0 1 0 1.06-1.06L16.56 10l1.72-1.72a.75.75 0 0 0-1.06-1.06L15.5 8.94l-1.72-1.72Z' />
        </svg>
    );
};

interface LogoProps extends IconProps {
    foregroundClassName?: string;
    backgroundClassName?: string;
}

export const Logo: React.FC<LogoProps> = ({
    className,
    foregroundClassName,
    backgroundClassName,
}) => {
    return (
        <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 32 32'
            clipRule='evenodd'
            fillRule='evenodd'
            strokeLinejoin='round'
            strokeMiterlimit='2'
            className={className}
        >
            <path
                d='m30.036 10.325v14.884c0 3.748-3.043 6.791-6.792 6.791h-16.452c-3.749 0-6.792-3.043-6.792-6.791v-15.933c0-3.748 3.043-6.791 6.792-6.791h14.425l.155-.155c1.083-1.416 2.789-2.33 4.707-2.33 3.268 0 5.921 2.653 5.921 5.922 0 1.746-.759 3.318-1.964 4.403z'
                fill='#3b82f6'
                className={foregroundClassName}
            />
            <path
                d='m29.259 2.755c-1.806-1.805-4.734-1.805-6.539 0l-10.618 10.618c-.201.201-.336.456-.392.733l-1.128 5.64c-.095.47.053.955.392 1.294s.824.487 1.294.392l5.64-1.128c.277-.056.532-.191.733-.392l10.618-10.618c1.805-1.805 1.805-4.733 0-6.539zm-4.511 2.026c.685-.685 1.797-.685 2.485 0 .685.688.685 1.8 0 2.485l-10.312 10.312-3.107.622.622-3.107zm-20.493 5.275c0-1.847 1.496-3.343 3.343-3.343h5.673c.792 0 1.434-.642 1.434-1.434 0-.791-.642-1.434-1.434-1.434h-5.673c-3.43 0-6.211 2.781-6.211 6.211v14.332c0 3.431 2.781 6.211 6.211 6.211h14.332c3.43 0 6.211-2.78 6.211-6.211v-5.673c0-.791-.643-1.434-1.434-1.434-.792 0-1.434.642-1.434 1.434v5.673c0 1.847-1.496 3.343-3.343 3.343h-14.332c-1.847 0-3.343-1.496-3.343-3.343z'
                fill='#ffffff'
                className={backgroundClassName}
            />
        </svg>
    );
};
