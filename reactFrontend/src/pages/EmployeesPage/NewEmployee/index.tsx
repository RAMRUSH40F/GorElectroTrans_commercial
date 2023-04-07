import React from "react";
import ActionButton from "../../../components/buttons/ActionButton";
import AddStudentModal from "../../../components/modals/employess/AddEmployeeModal";
import useLockedBody from "../../../hooks/useLockedBody";

import "./styles.scss";

const NewEmployee: React.FC = () => {
    const [isAdding, setIsAdding] = React.useState(false);

    useLockedBody(isAdding);

    const handleOpenEditing = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        setIsAdding(true);
    };

    return (
        <>
            {isAdding && <AddStudentModal closeModal={() => setIsAdding(false)} />}
            <ActionButton className="new-student-btn" colorType="info" onClick={handleOpenEditing}>
                Добавить +
            </ActionButton>
        </>
    );
};

export default NewEmployee;
