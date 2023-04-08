import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { NOTION } from "../../../constants/notion";
import { usePlansContext } from "../../../context/plansContext";
import { parseISO } from "../../../helpers/parseISO";
import { showNotion } from "../../../helpers/showNotion";
import useClickOutside from "../../../hooks/useClickOutside";
import useEscape from "../../../hooks/useEscape";
import { IPlan } from "../../../models/Plan";
import PlanService from "../../../services/PlanService";
import Confirm from "../../Comfirm";
import PlanForm, { PlanFormValues } from "../../forms/PlanForm";
import ModalLayout from "../ModalLayout";
import ModalContent from "../ModalLayout/ModalContent";
import ModalHeader from "../ModalLayout/ModalHeader";
import ModalMessage from "../ModalLayout/ModalMessage";

type Props = {
    closeEditing: () => void;
    plan: IPlan;
};

const EditPlanModal: React.FC<Props> = ({ closeEditing, plan }) => {
    const modalRef = React.useRef<HTMLDivElement | null>(null);
    useClickOutside(modalRef, closeEditing);
    useEscape(closeEditing);

    const { divisionId = "" } = useParams();

    const [error, setError] = useState<string | null>(null);
    const { updatePlans, deletePlan } = usePlansContext();
    const [isConfirming, setIsConfirming] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);

    const handleSubmit = async (values: PlanFormValues) => {
        setError(null);
        const { date, duration, peoplePlanned, teacher, topic } = values;
        const { day } = parseISO(date);

        const changedPlan: IPlan = {
            date: day,
            id: plan.id,
            duration: Number(duration),
            peoplePlanned: Number(peoplePlanned),
            teacher: teacher.trim(),
            topic: topic.trim(),
        };

        try {
            await PlanService.put({ depId: divisionId, plan: changedPlan });
            updatePlans(changedPlan);
            showNotion(NOTION.SUCCESS, "Изменения успешно сохранены");
            closeEditing();
        } catch (error) {
            console.log(error);
            const err = error as any;
            setError(err?.response?.data?.message ?? "Не удалось сохранить изменения");
        }
    };

    const handleDelete = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        setIsConfirming(false);
        setIsDisabled(true);
        setError(null);

        try {
            await PlanService.delete({ depId: divisionId, planId: plan.id });
            deletePlan(plan.id);
            showNotion(NOTION.SUCCESS, "Запись успешно удалена");
            closeEditing();
        } catch (error) {
            console.log(error);
            const err = error as any;
            setError(err?.response?.data?.message ?? "Не удалось удалить запись");
        } finally {
            setIsDisabled(false);
        }
    };

    const moveToConfirm = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        setIsConfirming(true);
    };

    const handleDecline = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        setIsConfirming(false);
    };

    return (
        <ModalLayout ref={modalRef}>
            <ModalHeader closeModal={closeEditing}>Редактирование</ModalHeader>
            {error && <ModalMessage>{error}</ModalMessage>}
            <ModalContent>
                {isConfirming ? (
                    <Confirm
                        title="Вы уверены, что хотите удалить запись?"
                        handleConfirm={handleDelete}
                        handleDecline={handleDecline}
                    />
                ) : (
                    <PlanForm
                        onSubmit={handleSubmit}
                        plan={plan}
                        moveToConfrim={moveToConfirm}
                        isDisabled={isDisabled}
                    />
                )}
            </ModalContent>
        </ModalLayout>
    );
};

export default EditPlanModal;
