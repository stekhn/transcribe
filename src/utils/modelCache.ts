export async function isModelCached(modelId: string): Promise<boolean> {
    try {
        if (!("indexedDB" in window)) {
            return false;
        }

        return await checkTransformersCache(modelId);
    } catch (error) {
        return false;
    }
}

async function checkTransformersCache(modelId: string): Promise<boolean> {
    return new Promise((resolve) => {
        const request = indexedDB.open("transformers-cache");
        
        request.onsuccess = () => {
            const db = request.result;
            try {
                // Get all object stores
                const storeNames = Array.from(db.objectStoreNames);
                if (storeNames.length === 0) {
                    db.close();
                    resolve(false);
                    return;
                }

                const transaction = db.transaction(storeNames, 'readonly');
                let completed = 0;
                let found = false;

                storeNames.forEach(storeName => {
                    const store = transaction.objectStore(storeName);
                    const keysRequest = store.getAllKeys();

                    keysRequest.onsuccess = () => {
                        const keys = keysRequest.result;
                        
                        // Simple check: if any key contains the model name
                        if (keys.some(key => String(key).includes(modelId))) {
                            found = true;
                        }

                        completed++;
                        if (completed === storeNames.length) {
                            db.close();
                            resolve(found);
                        }
                    };

                    keysRequest.onerror = () => {
                        completed++;
                        if (completed === storeNames.length) {
                            db.close();
                            resolve(found);
                        }
                    };
                });

            } catch (error) {
                db.close();
                resolve(false);
            }
        };

        request.onerror = () => resolve(false);
        request.onblocked = () => resolve(false);
    });
}

export async function checkModelCacheStatus(
    models: string[],
): Promise<Record<string, boolean>> {
    const results: Record<string, boolean> = {};

    await Promise.all(
        models.map(async (modelId) => {
            results[modelId] = await isModelCached(modelId);
        }),
    );

    return results;
}
