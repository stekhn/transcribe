export async function isModelCached(modelId: string): Promise<boolean> {
  try {
    const cache = await caches.open("transformers-cache");
    const keys = await cache.keys();
    return keys.some((req) => req.url.includes(modelId));
  } catch {
    return false;
  }
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
