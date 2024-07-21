import { FC } from "react";

import ActionButton from "components/ActionButton";

import { usePlanFormContext } from "../context";

interface EditButtonProps {
    className?: string;
}

export const EditButton: FC<EditButtonProps> = ({ className }) => {
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
            Сохранить
        </ActionButton>
    );
};
