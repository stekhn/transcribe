self.addEventListener("fetch", (event) => {
    const url = new URL(event.request.url);

    if (
        url.pathname === "/transcribe/" &&
        url.searchParams.has("share-target") &&
        event.request.method === "POST"
    ) {
        event.respondWith(
            (async () => {
                try {
                    const formData = await event.request.formData();

                    // Immediately respond to the request with a redirect
                    event.respondWith(Response.redirect("/?share-target"));

                    const audioFile = formData.get("file");
                    if (audioFile && audioFile.type.startsWith("audio/")) {
                        const arrayBuffer = await audioFile.arrayBuffer();
                        const clients = await self.clients.matchAll();

                        for (const client of clients) {
                            client.postMessage({
                                type: "AUDIO_FILE_RECEIVED",
                                file: arrayBuffer,
                                mimeType: audioFile.type,
                            });
                        }

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
});
