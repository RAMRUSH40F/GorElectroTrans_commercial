import React from "react";
import ActionButton from "../../../components/buttons/ActionButton";
import PlanReportModal from "../../../components/modals/plans/PlanReportModal";
import useLockedBody from "../../../hooks/useLockedBody";

import "./styles.scss";

const PlanReport: React.FC = () => {
    const [isActive, setIsActive] = React.useState(false);

    useLockedBody(isActive);

    const handleOpenReport = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        setIsActive(true);
    };

    return (
        <>
            {isActive && <PlanReportModal setIsActive={setIsActive} />}
            <ActionButton className="plan-report-btn" onClick={handleOpenReport} colorType="custom">
                Сформировать отчет
            </ActionButton>
        </>
    );
};

export default PlanReport;
