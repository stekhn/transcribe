import { useState } from "react";

export const useLocalStorage = <T>(
    key: string | number | boolean,
    initialValue: T,
): [T, React.Dispatch<React.SetStateAction<T>>] => {
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            const item = window.localStorage.getItem(key.toString());
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error("Error reading from localStorage:", error);
            return initialValue;
        }
    });

    const setValue = (value: T | ((val: T) => T)) => {
        try {
            const valueToStore =
                value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            window.localStorage.setItem(
                key.toString(),
                JSON.stringify(valueToStore),
            );
        } catch (error) {
            console.error("Error writing to localStorage:", error);
        }
    };

    return [storedValue, setValue];
};
