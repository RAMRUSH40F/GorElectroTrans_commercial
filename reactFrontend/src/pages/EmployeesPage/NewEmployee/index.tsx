import React from "react";
import ActionButton from "../../../components/buttons/ActionButton";
import AddEmployeeModal from "../../../components/modals/employess/AddEmployeeModal";
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
            {isAdding && <AddEmployeeModal closeModal={() => setIsAdding(false)} />}
            <ActionButton className="new-employee-btn" colorType="info" onClick={handleOpenEditing}>
                Добавить +
            </ActionButton>
        </>
    );
};

export default NewEmployee;
