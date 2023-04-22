import React, { useState } from "react";
import PlanForm, { PlanFormValues } from "../../components/forms/PlanForm";
import { usePlansContext } from "../../context/plansContext";
import { parseISO } from "../../helpers/parseISO";
import { IPlan } from "../../models/Plan";
import { useParams } from "react-router-dom";
import PlanService from "../../services/PlanService";
import { showNotion } from "../../helpers/showNotion";
import { NOTION } from "../../constants/notion";
import Confirm from "../../components/Comfirm";
import { useUserContext } from "../../context/userContext";

type Props = {
    plan: IPlan;
    closeEditing: () => void;
    openMaterialsEditing: (event: React.MouseEvent<HTMLButtonElement>) => void;
    setError: React.Dispatch<React.SetStateAction<string | null>>;
};

const PlanEditing: React.FC<Props> = ({ plan, closeEditing, openMaterialsEditing, setError }) => {
    const { divisionId = "" } = useParams();

    const { logout } = useUserContext();
    const { updatePlans, deletePlan } = usePlansContext();
    const [isConfirming, setIsConfirming] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);

    const handleSubmit = async (values: PlanFormValues) => {
        setError(null);
        const { date, duration, peoplePlanned, teacher, topic, status, teacherPost } = values;
        const { day } = parseISO(date);

        const changedPlan: IPlan = {
            date: day,
            id: plan.id,
            duration: parseInt(duration),
            peoplePlanned: parseInt(peoplePlanned),
            teacher: teacher.trim(),
            topic: topic.trim(),
            isHeld: !+status.value,
            teacherPost: String(teacherPost.label),
            lessonContent: plan.lessonContent,
        };

        try {
            await PlanService.put({ depId: divisionId, plan: changedPlan });
            updatePlans(changedPlan);
            showNotion(NOTION.SUCCESS, "Изменения успешно сохранены");
            closeEditing();
        } catch (error) {
            const err = error as any;
            console.log(err);
            if (err.response.status === 401) {
                logout();
            } else {
                setError(err?.response?.data?.message ?? "Не удалось сохранить изменения");
            }
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
            const err = error as any;
            console.log(err);
            if (err.response.status === 401) {
                logout();
            } else {
                setError(err?.response?.data?.message ?? "Не удалось удалить запись");
            }
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
        <>
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
                    openMaterialsEditing={openMaterialsEditing}
                    isDisabled={isDisabled}
                    isEditing={true}
                />
            )}
        </>
    );
};

export default PlanEditing;
