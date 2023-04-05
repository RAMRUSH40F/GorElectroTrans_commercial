import React from "react";

const useClickOutside = <T extends HTMLElement = HTMLElement>(
    ref: React.RefObject<T>,
    handleClose: () => void
): void => {
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                handleClose();
            }
        };
        
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, [handleClose, ref]);
};

export default useClickOutside;
