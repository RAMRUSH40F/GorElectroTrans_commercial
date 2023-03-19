import React from "react";
import ActionButton from "../../../components/buttons/ActionButton";
import AddWorkPlanModal from "../../../components/modals/AddWorkPlanModal";
import useLockedBody from "../../../hooks/useLockedBody";

import "./styles.scss";

const NewWorkPlan: React.FC = () => {
    const [isAdding, setIsAdding] = React.useState(false);

    useLockedBody(isAdding);

    const handleOpenEditing = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        setIsAdding(true);
    };

    return (
        <>
            {isAdding && <AddWorkPlanModal setIsActive={setIsAdding} />}
            <ActionButton className="new-work-plan-btn" colorType="add" onClick={handleOpenEditing}>
                Добавить +
            </ActionButton>
        </>
    );
};

export default NewWorkPlan;
