self.addEventListener("fetch", async (event) => {
    const url = new URL(event.request.url);

    // Check if the request is a POST request to the share target endpoint
    if (
        url.pathname === "/transcribe/" &&
        url.searchParams.has("share-target") &&
        event.request.method === "POST"
    ) {
        event.respondWith(handleShareTargetRequest(event.request));
        event.preventDefault();
    }
});

async function handleShareTargetRequest(request) {
    try {
        const formData = await request.formData();
        const audioFile = formData.get("audio_file");

        if (!audioFile) {
            return new Response(
                JSON.stringify({ error: "No audio file received" }),
                {
                    status: 400,
                    headers: { "Content-Type": "application/json" },
                },
            );
        }

        const arrayBuffer = await audioFile.arrayBuffer();

        const message = {
            type: "AUDIO_FILE_RECEIVED",
            file: arrayBuffer,
            mimeType: audioFile.type,
        };

        const clients = await self.clients.matchAll({ type: "window" });
        clients.forEach((client) => {
            client.postMessage(message);
        });

        return new Response(null, { status: 204 }); // 204 No Content
    } catch (error) {
        return new Response(
            JSON.stringify({ error: "Failed to process the audio file" }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            },
        );
    }
}
