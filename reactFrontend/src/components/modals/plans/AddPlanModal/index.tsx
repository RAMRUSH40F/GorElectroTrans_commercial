import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { NOTION } from "../../../../constants/notion";
import { usePlansContext } from "../../../../context/plansContext";
import { parseISO } from "../../../../helpers/parseISO";
import { showNotion } from "../../../../helpers/showNotion";
import useClickOutside from "../../../../hooks/useClickOutside";
import useEscape from "../../../../hooks/useEscape";
import { TPlanDto } from "../../../../models/Plan";
import PlanService from "../../../../services/PlanService";
import PlanForm, { PlanFormValues } from "../../../forms/PlanForm";
import ModalLayout from "../../ModalLayout";
import ModalHeader from "../../ModalLayout/ModalHeader";
import { ALERT } from "../../../../constants/alertTypes";
import ModalContent from "../../ModalLayout/ModalContent";
import Alert from "../../../Alert";
import { useUserContext } from "../../../../context/userContext";

import "./styles.scss";

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
    const { logout } = useUserContext();

    const handleSubmit = async (values: PlanFormValues) => {
        setError(null);
        const { date, duration, peoplePlanned, teacher, topic, status, teacherPost } = values;
        const { day } = parseISO(date);

        const newPlan: TPlanDto = {
            date: day,
            duration: Number(duration),
            peoplePlanned: Number(peoplePlanned),
            teacher: teacher.trim(),
            topic: topic.trim(),
            isHeld: !!+status.value,
            teacherPost: String(teacherPost.label),
            lessonContent: [],
        };

        try {
            const response = await PlanService.post({ depId: divisionId, plan: newPlan });
            addPlan({ ...newPlan, id: response.data });
            showNotion(NOTION.SUCCESS, "Запись успешно добавлена");
            closeModal();
        } catch (error) {
            const err = error as any;
            console.log(err);
            if (err.response.status === 401) {
                logout();
            } else {
                setError(err?.response?.data?.message ?? "Не удалось добавить запись");
            }
        }
    };

    return (
        <ModalLayout ref={modalRef}>
            <ModalHeader closeModal={closeModal}>Добавление</ModalHeader>
            <ModalContent>
                {error && <Alert type={ALERT.ERROR}>{error}</Alert>}
                <PlanForm onSubmit={handleSubmit} />
            </ModalContent>
        </ModalLayout>
    );
};

export default AddPlanModal;
