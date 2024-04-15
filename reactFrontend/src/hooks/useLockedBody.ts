import { useEffect } from "react";

const useLockedBody = (isLocked: boolean) => {
    useEffect(() => {
        if (isLocked) {
            document.body.classList.add("overflow");
        } else {
            document.body.classList.remove("overflow");
        }
    }, [isLocked]);
};

export default useLockedBody;
