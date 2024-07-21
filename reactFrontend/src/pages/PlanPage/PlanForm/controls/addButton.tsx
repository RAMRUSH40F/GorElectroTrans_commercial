import { FC } from "react";

import ActionButton from "components/ActionButton";
import { usePlanFormContext } from "../context";

interface AddButtonProps {
    className?: string;
}

export const AddButton: FC<AddButtonProps> = ({ className }) => {
    const {
        state: { isDisabled },
    } = usePlanFormContext();
    
    return (
        <ActionButton
            className={className}
            disabled={isDisabled}
            type="submit"
            colorType="success"
        >
            Добавить
        </ActionButton>
    );
};
