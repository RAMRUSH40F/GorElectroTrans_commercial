import React from "react";
import ActionButton from "../../../components/buttons/ActionButton";
import AddPlanModal from "../../../components/modals/plans/AddPlanModal";
import useLockedBody from "../../../hooks/useLockedBody";

import "./styles.scss";

const NewPlan: React.FC = () => {
    const [isAdding, setIsAdding] = React.useState(false);
    useLockedBody(isAdding);

    return (
        <>
            {isAdding && <AddPlanModal closeModal={() => setIsAdding(false)} />}
            <ActionButton className="new-plan-btn" colorType="info" onClick={() => setIsAdding(true)}>
                Добавить +
            </ActionButton>
        </>
    );
};

export default NewPlan;
