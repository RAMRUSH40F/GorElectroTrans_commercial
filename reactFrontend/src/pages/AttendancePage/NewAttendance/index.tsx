import React from "react";
import ActionButton from "../../../components/buttons/ActionButton";
import AddAttendanceModal from "../../../components/modals/AddAttendanceModal";
import useLockedBody from "../../../hooks/useLockedBody";

import "./styles.scss";

const NewAttendance: React.FC = () => {
    const [isAdding, setIsAdding] = React.useState(false);

    useLockedBody(isAdding);

    const handleOpenEditing = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        setIsAdding(true);
    };

    return (
        <>
            {isAdding && <AddAttendanceModal setIsActive={setIsAdding} />}
            <ActionButton className="new-attendance-btn" colorType="add" onClick={handleOpenEditing}>
                Добавить +
            </ActionButton>
        </>
    );
};

export default NewAttendance;
