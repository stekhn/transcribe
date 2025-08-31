import { useState, useEffect, useRef } from "react";
import { checkModelCacheStatus } from "../utils/modelCache";

interface ProgressItem {
    file: string;
    loaded: number;
    progress: number;
    total: number;
    name: string;
    status: string;
}

export function useModelCacheStatus(
    models: string[],
    progressItems?: ProgressItem[],
    isModelLoading?: boolean,
) {
    const [cacheStatus, setCacheStatus] = useState<Record<string, boolean>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [hasInitialized, setHasInitialized] = useState(false);
    
    const prevLoadingRef = useRef<boolean | undefined>(undefined);
    const modelsRef = useRef<string[]>([]);

    // Check cache status only on initial load and only once
    useEffect(() => {
        if (!hasInitialized && models.length > 0) {
            console.log('Initial cache check for models:', models);
            modelsRef.current = models;
            const checkCache = async () => {
                setIsLoading(true);
                try {
                    const status = await checkModelCacheStatus(models);
                    setCacheStatus(status);
                } catch (error) {
                    console.error("Error checking model cache status:", error);
                    setCacheStatus({});
                } finally {
                    setIsLoading(false);
                    setHasInitialized(true);
                }
            };

            checkCache();
        }
    }, [models.join(','), hasInitialized]); // Use join to prevent array reference changes

    // Refresh cache status only when model loading transitions from true to false
    useEffect(() => {
        if (hasInitialized && 
            prevLoadingRef.current === true && 
            isModelLoading === false) {
            
            console.log('Model loading completed, refreshing cache status');
            const refreshCache = async () => {
                try {
                    const status = await checkModelCacheStatus(modelsRef.current);
                    setCacheStatus(status);
                } catch (error) {
                    console.error("Error refreshing model cache status:", error);
                }
            };

            // Add a delay to ensure model is fully cached
            const timeout = setTimeout(refreshCache, 2000);
            return () => clearTimeout(timeout);
        }
        
        // Update the ref after the effect runs
        prevLoadingRef.current = isModelLoading;
    }, [isModelLoading, hasInitialized]);

    const refreshCacheStatus = async () => {
        console.log('Manual cache refresh requested');
        if (modelsRef.current.length > 0) {
            try {
                const status = await checkModelCacheStatus(modelsRef.current);
                setCacheStatus(status);
            } catch (error) {
                console.error("Error refreshing model cache status:", error);
            }
        }
    };

    return {
        cacheStatus,
        isLoading,
        refreshCacheStatus,
    };
}
