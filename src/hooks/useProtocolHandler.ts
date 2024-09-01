import { useEffect, useRef } from "react";

type ProtocolHandler = (url: URL) => void;

export const useProtocolHandler = (
    protocol: string,
    handler: ProtocolHandler,
) => {
    const lastUrlRef = useRef<string | null>(null);

    useEffect(() => {
        if ("registerProtocolHandler" in navigator) {
            try {
                navigator.registerProtocolHandler(
                    protocol,
                    `${window.location.origin}/?url=%s`,
                );
            } catch (error) {
                console.warn("Failed to register protocol handler:", error);
            }
        }
    }, [protocol]);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const incomingUrl = urlParams.get("url");

        if (incomingUrl && incomingUrl !== lastUrlRef.current) {
            try {
                const parsedUrl = new URL(incomingUrl);
                handler(parsedUrl);
                lastUrlRef.current = incomingUrl; // Update the last URL
            } catch (error) {
                console.error("Failed to parse incoming URL:", error);
            }
        }
    }, [handler]);
};
