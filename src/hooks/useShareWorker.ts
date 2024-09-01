import { useEffect, useState } from "react";

type AudioFileHandler = (file: ArrayBuffer, mimeType: string) => void;

export const useShareWorker = (handleFile: AudioFileHandler) => {
    const [isRegistered, setIsRegistered] = useState(false);

    useEffect(() => {
        const registerServiceWorker = async () => {
            try {
                // Register the service worker
                await navigator.serviceWorker.register("/service-worker.js");
                setIsRegistered(true);
            } catch (error) {
                console.error("ServiceWorker registration failed: ", error);
            }
        };

        if ("serviceWorker" in navigator && !isRegistered) {
            registerServiceWorker();

            navigator.serviceWorker.addEventListener("message", (event) => {
                if (event.data && event.data.type === "AUDIO_FILE_RECEIVED") {
                    const { file, mimeType } = event.data;
                    handleFile(file, mimeType);
                }
            });
        }
    }, [handleFile, isRegistered]);
};
