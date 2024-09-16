import { useState, useEffect, Dispatch, SetStateAction } from "react";

interface UseLocalStorage {
    (key: string, initialValue?: any): [
        any | undefined,
        Dispatch<SetStateAction<any | undefined>>,
    ];
}

export const useLocalStorage: UseLocalStorage = (
    key: string,
    initialValue?: any,
) => {
    const [storedValue, setStoredValue] = useState<any | undefined>(() => {
        try {
            const item = window.localStorage.getItem(key);
            if (item !== null) {
                return JSON.parse(item);
            } else {
                return initialValue;
            }
        } catch (error) {
            console.error("Error reading from localStorage:", error);
            return initialValue;
        }
    });

    useEffect(() => {
        try {
            if (storedValue !== undefined) {
                window.localStorage.setItem(key, JSON.stringify(storedValue));
            }
        } catch (error) {
            console.error("Error writing to localStorage:", error);
        }
    }, [key, storedValue]);

    return [storedValue, setStoredValue];
};
