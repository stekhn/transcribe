import { useEffect } from "react";

type AudioFileHandler = (file: File) => void;

export const useAudioFileReceiver = (handleFile: AudioFileHandler) => {
    useEffect(() => {
        const handleFetchEvent = async (event: FetchEvent) => {
            if (event.request.method === "POST") {
                const url = new URL(event.request.url);
                console.log(event.request);
                console.log(url);

                event.respondWith(
                    (async () => {
                        try {
                            const formData = await event.request.formData();
                            const audioFile = formData.get(
                                "audio_files",
                            ) as File;

                            if (
                                audioFile &&
                                audioFile.type.startsWith("audio/")
                            ) {
                                handleFile(audioFile);
                                return new Response("Audio file received", {
                                    status: 200,
                                });
                            } else {
                                return new Response(
                                    "No audio file received or invalid file type",
                                    { status: 400 },
                                );
                            }
                        } catch (error) {
                            console.error("Error handling fetch event:", error);
                            return new Response("Error handling audio file", {
                                status: 500,
                            });
                        }
                    })(),
                );
            }
        };

        // @ts-ignore
        self.addEventListener("fetch", handleFetchEvent);

        return () => {
            // @ts-ignore
            self.removeEventListener("fetch", handleFetchEvent);
        };
    }, [handleFile]);
};
