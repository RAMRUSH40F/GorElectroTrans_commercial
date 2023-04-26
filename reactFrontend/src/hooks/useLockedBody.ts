import React from "react";

const useLockedBody = (isLocked: boolean) => {
    React.useEffect(() => {
        if (isLocked) {
            document.body.classList.add("overflow");
        } else {
            document.body.classList.remove("overflow");
        }
    }, [isLocked]);
};

export default useLockedBody;
