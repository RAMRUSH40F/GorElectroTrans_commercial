import React from "react";

const useFocus = <T extends HTMLElement = HTMLElement>(ref: React.RefObject<T>, isActive: boolean) => {
    React.useEffect(() => {
        if (isActive && ref.current) {
            ref.current.focus();
        }
    }, [isActive, ref]);
};

export default useFocus;
