import React from "react";

const useClickOutside = <T extends HTMLElement = HTMLElement>(
    ref: React.RefObject<T>,
    handleClose: () => void,
    eventOptions?: AddEventListenerOptions
): void => {
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                handleClose();
            }
        };

        document.addEventListener("click", handleClickOutside, { capture: true, ...eventOptions });
        return () => document.removeEventListener("click", handleClickOutside, { capture: true, ...eventOptions });
    }, [handleClose, ref, eventOptions]);
};

export default useClickOutside;
