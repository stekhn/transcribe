import { Button } from "./Button";
import { ClipboardIcon, ShareIcon } from "./Icons";
import { formatText } from "../utils/transcript";
import { TranscriberData } from "../hooks/useTranscriber";

interface ShareAndCopyButtonsProps {
    transcribedData: any;
    showTimestamps: boolean;
}

export const ShareAndCopyButtons: React.FC<
    ShareAndCopyButtonsProps
> = ({ transcribedData, showTimestamps }) => {
    const copyToClipboard = async (
        transcribedData: TranscriberData,
        showTimestamps: boolean,
    ) => {
        if (navigator.clipboard && transcribedData?.text) {
            try {
                const text = formatText(transcribedData, showTimestamps);
                await navigator.clipboard.writeText(text || "");
            } catch (error) {
                console.error("Failed to copy:", error);
            }
        }
    };

    const shareText = async (
        transcribedData: TranscriberData,
        showTimestamps: boolean,
    ) => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: "Share Text",
                    text: formatText(transcribedData, showTimestamps),
                });
            } catch (error) {
                console.error("Failed to share text:", error);
            }
        }
    };

    return (
        <div className='flex flex-row gap-2 w-full sm:w-auto'>
            {!!navigator.clipboard && (
                <Button
                    isBlue={false}
                    aria-label='Copy to clipboard'
                    onClick={() =>
                        copyToClipboard(transcribedData, showTimestamps)
                    }
                    className='flex-1'
                >
                    <ClipboardIcon className='size-5 fill-slate-900 dark:fill-slate-100' />
                </Button>
            )}
            {!!navigator.share && (
                <Button
                    isBlue={false}
                    aria-label='Share text'
                    onClick={() => shareText(transcribedData, showTimestamps)}
                    className='flex-1'
                >
                    <ShareIcon className='size-5 fill-slate-900 dark:fill-slate-100' />
                </Button>
            )}
        </div>
    );
};
