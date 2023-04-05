import React from "react";
import ActionButton from "../../../components/buttons/ActionButton";
import AddDepartmentModal from "../../../components/modals/departments/AddDepartmentModal";
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
            {isAdding && <AddDepartmentModal closeModal={() => setIsAdding(false)} />}
            <ActionButton className="new-department-btn" colorType="info" onClick={handleOpenEditing}>
                Добавить +
            </ActionButton>
        </>
    );
};

export default NewDepartment;
