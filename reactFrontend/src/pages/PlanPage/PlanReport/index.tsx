import React from "react";
import ActionButton from "../../../components/buttons/ActionButton";
import PlanReportModal from "../../../components/modals/plans/PlanReportModal";
import useLockedBody from "../../../hooks/useLockedBody";

import "./styles.scss";

const PlanReport: React.FC = () => {
    const [isActive, setIsActive] = React.useState(false);
    useLockedBody(isActive);

    return (
        <>
            {isActive && <PlanReportModal closeModal={() => setIsActive(false)} />}
            <ActionButton className="plan-report-btn" onClick={() => setIsActive(true)} colorType="custom">
                Сформировать отчет
            </ActionButton>
        </>
    );
};

export default PlanReport;
