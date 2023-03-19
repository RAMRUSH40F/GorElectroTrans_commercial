import React from "react";
import ActionButton from "../../../components/buttons/ActionButton";
import AddDepartmentModal from "../../../components/modals/AddDepartmentModal";
import useLockedBody from "../../../hooks/useLockedBody";

import "./styles.scss";

const NewDepartment: React.FC = () => {
    const [isAdding, setIsAdding] = React.useState(false);

    useLockedBody(isAdding);

    const handleOpenEditing = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        setIsAdding(true);
    };

    return (
        <>
            {isAdding && <AddDepartmentModal setIsActive={setIsAdding} />}
            <ActionButton className="new-department-btn" colorType="add" onClick={handleOpenEditing}>
                Добавить +
            </ActionButton>
        </>
    );
};

export default NewDepartment;
