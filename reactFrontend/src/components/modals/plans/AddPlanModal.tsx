import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { NOTION } from "../../../constants/notion";
import { usePlansContext } from "../../../context/plansContext";
import { parseISO } from "../../../helpers/parseISO";
import { showNotion } from "../../../helpers/showNotion";
import useClickOutside from "../../../hooks/useClickOutside";
import useEscape from "../../../hooks/useEscape";
import { TNewPlan } from "../../../models/Plan";
import PlanService from "../../../services/PlanService";
import PlanForm, { PlanFormValues } from "../../forms/PlanForm";
import ModalLayout from "../ModalLayout";
import ModalContent from "../ModalLayout/ModalContent";
import ModalHeader from "../ModalLayout/ModalHeader";
import ModalMessage from "../ModalLayout/ModalMessage";

type Props = {
    closeModal: () => void;
};

const AddPlanModal: React.FC<Props> = ({ closeModal }) => {
    const modalRef = React.useRef<HTMLDivElement | null>(null);
    useClickOutside(modalRef, closeModal);
    useEscape(closeModal);

    const { divisionId = "" } = useParams();

    const [error, setError] = useState<string | null>(null);
    const { addPlan } = usePlansContext();

    const handleSubmit = async (values: PlanFormValues) => {
        const { day } = parseISO(values.date);

        const newPlan: TNewPlan = {
            date: day,
            duration: Number(values.duration),
            peoplePlanned: Number(values.peoplePlanned),
            teacher: values.teacher,
            topic: values.topic,
        };

        try {
            const response = await PlanService.post({ depId: divisionId, plan: newPlan });
            console.log(response);
            addPlan({ ...newPlan, id: response.data });
            showNotion(NOTION.SUCCESS, "Запись успешно удалена");
            closeModal();
        } catch (error) {
            console.log(error);
            const err = error as any;
            setError(err?.response?.data?.message ?? "Не удалось добавить запись");
        }
    };

    return (
        <ModalLayout ref={modalRef}>
            <ModalHeader closeModal={closeModal}>Добавление занятия</ModalHeader>
            {error && <ModalMessage>{error}</ModalMessage>}
            <ModalContent>
                <PlanForm onSubmit={handleSubmit} />
            </ModalContent>
        </ModalLayout>
    );
};

export default AddPlanModal;
