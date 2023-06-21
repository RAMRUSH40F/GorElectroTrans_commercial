import React, { useState } from "react";
import useClickOutside from "../../../../hooks/useClickOutside";
import useEscape from "../../../../hooks/useEscape";
import ModalLayout from "../../ModalLayout";
import ModalHeader from "../../ModalLayout/ModalHeader";
import ModalContent from "../../ModalLayout/ModalContent";
import Alert, { ALERT } from "../../../Alert";
import { useParams } from "react-router-dom";
import PlanReportForm from "../../../../pages/PlanPage/PlanReport/PlanReportForm";
import Loader from "../../../Loader";
import { DropdownOption } from "../../../formElements/Dropdown";
import { IReportPeriod } from "pages/PlanPage/PlanReport/PlanReportForm/model";

import "./styles.scss";

type Props = {
    closeModal: () => void;
};

const PlanReportModal: React.FC<Props> = ({ closeModal }) => {
    const modalRef = React.useRef<HTMLDivElement | null>(null);
    useClickOutside(modalRef, closeModal);
    useEscape(closeModal);

    const { divisionId = "" } = useParams();

    // const { logout } = useUserContext();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [quartersError, setQuartersError] = useState<string | null>(null);
    const [quarters] = useState<IReportPeriod[]>([]);

    const options: DropdownOption[] = quarters.map((quarter) => ({
        label: `Год: ${quarter.year}, квартал: ${quarter.quoter}`,
        value: String(quarter.quoter),
    }));

    const handleSubmit = async (
        event: React.FormEvent<HTMLFormElement>,
        quarter: string
    ) => {
        event.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            // const year =
            //     quarters.find(
            //         (currQuarter) => currQuarter.quoter === parseInt(quarter)
            //     )?.year ?? new Date().getFullYear();
            // const response = await PlanService.fetchReport(divisionId, {
            //     params: { quarter, year },
            // });
            // const fileName = `Отчет_${quarter}кв_${year}.xls`;
            // downloadFile(response.data, fileName);
        } catch (error) {
            const err = error as any;
            if (err.response.status === 401) {
                // logout();
            } else {
                setError(
                    err?.response?.data?.message ?? "Не удалось скачать отчет"
                );
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    let contentToRender: React.ReactNode;

    if (quartersError) {
        contentToRender = (
            <Alert className="plan-report-modal__alert" type={ALERT.ERROR}>
                {quartersError}
            </Alert>
        );
    } else if (isLoading) {
        contentToRender = <Loader className="plan-report-modal__loader" />;
    } else {
        contentToRender = (
            <>
                {error && (
                    <Alert
                        className="plan-report-modal__alert"
                        type={ALERT.ERROR}
                    >
                        {error}
                    </Alert>
                )}
                <PlanReportForm />
            </>
        );
    }

    return (
        <ModalLayout className="plan-report-modal" ref={modalRef}>
            <ModalHeader closeModal={closeModal}>Отчетность</ModalHeader>
            <ModalContent>{contentToRender}</ModalContent>
        </ModalLayout>
    );
};

export default PlanReportModal;
