import React, { useRef, MouseEvent } from "react";
import useClickOutside from "hooks/useClickOutside";
import useEscape from "hooks/useEscape";
import ModalLayout from "components/ModalLayout";
import ModalHeader from "components/ModalLayout/ModalHeader";
import ModalContent from "components/ModalLayout/ModalContent";
import Alert, { ALERT } from "components/Alert";
import Confirm from "components/Comfirm";
import PlanForm, { PlanFormValues } from "pages/PlanPage/PlanForm";
import { updatePlanFx } from "../model";
import { IPlan } from "models/Plan";
import { parseISO } from "helpers/parseISO";
import useLockedBody from "hooks/useLockedBody";
import { useUnit } from "effector-react";
import {
    $editingPlan,
    $error,
    $isConfirming,
    $isDisabled,
    $isModalActive,
    confirmButtonClicked,
    confirmingClosed,
    errorReset,
    modalClosed,
} from "./model";

import styles from "./styles.module.scss";

const EditPlan: React.FC = () => {
    const [isModalActive, editingPlan] = useUnit([
        $isModalActive,
        $editingPlan,
    ]);
    const modalRef = useRef<HTMLDivElement | null>(null);
    useClickOutside(modalRef, () => modalClosed(), { capture: false });
    useEscape(() => modalClosed());
    useLockedBody(isModalActive);

    if (!isModalActive || editingPlan === null) return null;

    return (
        <ModalLayout ref={modalRef}>
            <ModalHeader closeModal={() => modalClosed()}>
                Редактирование
            </ModalHeader>
            <ModalContent>
                <ErrorAlert />
                <Confirming />
                <Form />
            </ModalContent>
        </ModalLayout>
    );
};

export default EditPlan;

function Form() {
    const [plan, isConfirming, isDisabled] = useUnit([
        $editingPlan,
        $isConfirming,
        $isDisabled,
    ]);

    if (isConfirming || plan === null) return null;

    const handleSubmit = async (values: PlanFormValues) => {
        const {
            date,
            duration,
            peoplePlanned,
            teacher,
            topic,
            status,
            teacherPost,
        } = values;
        const { day } = parseISO(date);

        const changedPlan: IPlan = {
            date: day,
            id: plan.id,
            duration: Number(duration),
            peoplePlanned: Number(peoplePlanned),
            teacher: teacher.trim(),
            topic: topic.trim(),
            isHeld: !!Number(status.value),
            teacherPost: String(teacherPost.label),
            lessonContent: plan.lessonContent,
        };

        try {
            await updatePlanFx({
                data: changedPlan,
                controller: new AbortController(),
            });
        } catch (error) {}
    };

    return (
        <PlanForm
            onSubmit={handleSubmit}
            clearError={() => errorReset()}
            plan={plan}
            isDisabled={isDisabled}
            isEditing={true}
        />
    );
}

function Confirming() {
    const isConfirming = useUnit($isConfirming);
    if (!isConfirming) return null;
    const handleConfirm = (event: MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        confirmButtonClicked();
    };
    const handleDecline = (event: MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        confirmingClosed();
    };
    return (
        <Confirm
            title="Вы уверены, что хотите удалить запись?"
            handleConfirm={handleConfirm}
            handleDecline={handleDecline}
        />
    );
}

function ErrorAlert() {
    const error = useUnit($error);
    if (!error) return null;
    return (
        <Alert className={styles.alert} type={ALERT.ERROR}>
            {error}
        </Alert>
    );
}
