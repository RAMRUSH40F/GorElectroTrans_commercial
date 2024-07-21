import { FC } from "react";

import ActionButton from "components/ActionButton";
import CheckAccess from "components/CheckAccess";

import { ROLES } from "shared/auth";

import { usePlanFormContext } from "../context";

interface DeleteButtonProps {
    className?: string;
}

export const DeleteButton: FC<DeleteButtonProps> = ({ className }) => {
    const {
        state: { isDisabled },
        actions: { handleMoveToConfirm },
    } = usePlanFormContext();

    return (
        <CheckAccess allowedRoles={[ROLES.ADMIN]}>
            <ActionButton
                className={className}
                disabled={isDisabled}
                onClick={handleMoveToConfirm}
                type="button"
                colorType="danger"
            >
                Удалить
            </ActionButton>
        </CheckAccess>
    );
};
