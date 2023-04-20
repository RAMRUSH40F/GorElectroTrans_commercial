import React from "react";
import ActionButton from "../../../components/buttons/ActionButton";
import AddDepartmentModal from "../../../components/modals/departments/AddDepartmentModal";
import useLockedBody from "../../../hooks/useLockedBody";
import cn from "classnames";

import "./styles.scss";

type Props = {
    className?: string;
};

const NewDepartment: React.FC<Props> = ({ className }) => {
    const [isAdding, setIsAdding] = React.useState(false);

    useLockedBody(isAdding);

    const handleOpenEditing = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        setIsAdding(true);
    };

    return (
        <>
            {isAdding && <AddDepartmentModal closeModal={() => setIsAdding(false)} />}
            <ActionButton className={cn("new-department-btn", className)} colorType="info" onClick={handleOpenEditing}>
                Добавить +
            </ActionButton>
        </>
    );
};

export default NewDepartment;
