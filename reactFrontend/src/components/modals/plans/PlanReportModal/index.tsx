import React, { useState } from "react";
import useClickOutside from "../../../../hooks/useClickOutside";
import useEscape from "../../../../hooks/useEscape";
import ModalLayout from "../../ModalLayout";
import ModalHeader from "../../ModalLayout/ModalHeader";
import ModalContent from "../../ModalLayout/ModalContent";
import Alert from "../../../Alert";
import { ALERT } from "../../../../constants/alertTypes";
import { useParams } from "react-router-dom";
import PlanService from "../../../../services/PlanService";
import { Option } from "react-dropdown";
import PlanReportForm from "../../../forms/PlanReportForm";

import "./styles.scss";

interface IPeriod {
    year: number;
    quarters: [1, 2, 3, 4];
}

const reportPeriod: IPeriod = { year: new Date().getFullYear(), quarters: [1, 2, 3, 4] };

type Props = {
    setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
};

const PlanReportModal: React.FC<Props> = ({ setIsActive }) => {
    const modalRef = React.useRef<HTMLDivElement | null>(null);
    useClickOutside(modalRef, () => setIsActive(false));
    useEscape(() => setIsActive(false));

    const { divisionId = "" } = useParams();

    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const options: Option[] = reportPeriod.quarters.map((quater) => ({
        label: `Квартал: ${quater}`,
        value: String(quater),
    }));

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>, quarter: number) => {
        event.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            const response = await PlanService.fetchReport(divisionId, { params: { quarter } });
            console.log(response);
        } catch (error) {
            console.log(error);
            setError("Не удалось скачать отчет");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <ModalLayout className="plan-report-modal" ref={modalRef}>
            <ModalHeader closeModal={() => setIsActive(false)}>Отчетность</ModalHeader>
            <ModalContent>
                {error && (
                    <Alert className="plan-report-modal__alert" type={ALERT.ERROR}>
                        {error}
                    </Alert>
                )}
                <div className="plan-report-modal__year">Год: {reportPeriod.year}</div>
                <PlanReportForm options={options} handleSubmit={handleSubmit} isSubmitting={isSubmitting} />
            </ModalContent>
        </ModalLayout>
    );
};

export default PlanReportModal;
