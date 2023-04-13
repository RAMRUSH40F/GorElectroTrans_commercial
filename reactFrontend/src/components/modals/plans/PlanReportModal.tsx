import React from "react";
import useClickOutside from "../../../hooks/useClickOutside";
import useEscape from "../../../hooks/useEscape";
import PlanReportForm from "../../forms/PlanReportForm";
import ModalLayout from "../ModalLayout";
import ModalHeader from "../ModalLayout/ModalHeader";

type Props = {
    setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
};

const PlanReportModal: React.FC<Props> = ({ setIsActive }) => {
    const modalRef = React.useRef<HTMLDivElement | null>(null);
    useClickOutside(modalRef, () => setIsActive(false));
    useEscape(() => setIsActive(false));

    return (
        <ModalLayout ref={modalRef}>
            <ModalHeader closeModal={() => setIsActive(false)}>Отчетность</ModalHeader>
            <PlanReportForm />
        </ModalLayout>
    );
};

export default PlanReportModal;
