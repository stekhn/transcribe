self.addEventListener("fetch", (event) => {
    if (event.request.method === "POST") {
        const url = new URL(event.request.url);

        if (url.pathname === "/transcribe/audio") {
            event.respondWith(
                (async () => {
                    try {
                        const formData = await event.request.formData();
                        const audioFile = formData.get("audio_files");

                        if (audioFile && audioFile.type.startsWith("audio/")) {
                            console.log("Audio file received:", audioFile);

                            // Example: send the file back to the main thread (e.g., to AudioManager)
                            const arrayBuffer = await audioFile.arrayBuffer();
                            self.clients.matchAll().then((clients) => {
                                clients.forEach((client) => {
                                    client.postMessage({
                                        type: "AUDIO_FILE_RECEIVED",
                                        file: arrayBuffer,
                                        mimeType: audioFile.type,
                                    });
                                });
                            });

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
    }
});
