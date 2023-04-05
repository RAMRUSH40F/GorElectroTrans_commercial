import React from "react";

const useEscape = (handleClose: () => void): void => {
    React.useEffect(() => {
        const handleCloseModalByKeyboard = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                handleClose();
            }
        };

        document.addEventListener("keydown", handleCloseModalByKeyboard);
        return () => document.removeEventListener("keydown", handleCloseModalByKeyboard);
    }, [handleClose]);
};

export default useEscape;
