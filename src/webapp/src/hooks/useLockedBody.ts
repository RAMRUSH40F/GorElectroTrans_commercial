import React from "react";

const useLockedBody = (isLocked: boolean) => {
    React.useEffect(() => {
        if (isLocked) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "initial";
        }
    }, [isLocked]);
};

export default useLockedBody;
