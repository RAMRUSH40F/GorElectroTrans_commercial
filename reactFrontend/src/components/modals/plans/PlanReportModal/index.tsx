import React, { useEffect, useState } from "react";
import useClickOutside from "../../../../hooks/useClickOutside";
import useEscape from "../../../../hooks/useEscape";
import ModalLayout from "../../ModalLayout";
import ModalHeader from "../../ModalLayout/ModalHeader";
import ModalContent from "../../ModalLayout/ModalContent";
import Alert from "../../../Alert";
import { ALERT } from "../../../../constants/alertTypes";
import { useParams } from "react-router-dom";
import PlanService from "../../../../services/PlanService";
import PlanReportForm from "../../../forms/PlanReportForm";
import { useUserContext } from "../../../../context/userContext";
import { downloadFile } from "../../../../helpers/downloadFile";
import Loader from "../../../Loader";
import { IQuarter } from "../../../../models/Quarter";
import axios from "axios";
import { DropdownOption } from "../../../formElements/Dropdown";

import "./styles.scss";

type Props = {
    closeModal: () => void;
};

const PlanReportModal: React.FC<Props> = ({ closeModal }) => {
    const modalRef = React.useRef<HTMLDivElement | null>(null);
    useClickOutside(modalRef, closeModal);
    useEscape(closeModal);

    const { divisionId = "" } = useParams();

    const { logout } = useUserContext();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [quarters, setQuarters] = useState<IQuarter[]>([]);

    const options: DropdownOption[] = quarters.map((quarter) => ({
        label: `Год: ${quarter.year}, квартал: ${quarter.quoter}`,
        value: String(quarter.quoter),
    }));

    useEffect(() => {
        const cancelToken = axios.CancelToken.source();
        setIsLoading(true);
        setError(null);

        const fetchQuarters = async () => {
            try {
                const response = await PlanService.fetchQuarters(divisionId, { cancelToken: cancelToken.token });
                setQuarters(response.data);
            } catch (error) {
                const err = error as any;
                console.log(err);
                if (err.response.status === 401) {
                    logout();
                } else {
                    setError(err?.response?.data?.message ?? "Не удалось скачать отчет");
                }
            } finally {
                setIsLoading(false);
            }
        };
        fetchQuarters();

        return () => cancelToken.cancel();
    }, [divisionId, logout]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>, quarter: string) => {
        event.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            const response = await PlanService.fetchReport(divisionId, { params: { quarter } });
            const year =
                quarters.find((currQuarter) => currQuarter.quoter === parseInt(quarter))?.year ??
                new Date().getFullYear();
            const fileName = `Отчет_${quarter}кв_${year}.xls`;
            downloadFile(response.data, fileName);
        } catch (error) {
            const err = error as any;
            console.log(err);
            if (err.response.status === 401) {
                logout();
            } else {
                setError(err?.response?.data?.message ?? "Не удалось скачать отчет");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <ModalLayout className="plan-report-modal" ref={modalRef}>
            <ModalHeader closeModal={closeModal}>Отчетность</ModalHeader>
            <ModalContent>
                {isLoading && <Loader className="plan-report-modal__loader" />}
                {error && (
                    <Alert className="plan-report-modal__alert" type={ALERT.ERROR}>
                        {error}
                    </Alert>
                )}
                {!error && !isLoading && (
                    <PlanReportForm options={options} handleSubmit={handleSubmit} isSubmitting={isSubmitting} />
                )}
            </ModalContent>
        </ModalLayout>
    );
};

export default PlanReportModal;
