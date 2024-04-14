import { useCallback, useRef } from "react";

export const useDeboucedCallback = <A extends any[]>(
    callback: (...args: A) => void,
    delay: number,
) => {
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const debouncedCallback = useCallback(
        (...args: A) => {
            if (timer.current) {
                clearTimeout(timer.current);
            }

            timer.current = setTimeout(() => {
                callback(...args);
            }, delay);
        },
        [callback, delay],
    );

    return debouncedCallback;
};
