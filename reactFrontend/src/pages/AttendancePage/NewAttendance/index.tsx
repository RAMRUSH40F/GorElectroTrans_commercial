import React from "react";
import ActionButton from "../../../components/buttons/ActionButton";
import AddAttendanceModal from "../../../components/modals/attendance/AddAttendanceModal";
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
            {isAdding && <AddAttendanceModal closeModal={() => setIsAdding(false)} />}
            <ActionButton className="new-attendance-btn" colorType="info" onClick={handleOpenEditing}>
                Добавить +
            </ActionButton>
        </>
    );
};

export default NewAttendance;
