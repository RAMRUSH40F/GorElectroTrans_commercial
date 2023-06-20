import React, { useRef } from "react";
import ActionButton from "components/buttons/ActionButton";
import useLockedBody from "hooks/useLockedBody";
import ModalLayout from "components/modals/ModalLayout";
import ModalHeader from "components/modals/ModalLayout/ModalHeader";
import ModalContent from "components/modals/ModalLayout/ModalContent";
import Alert from "components/Alert";
import { ALERT } from "constants/alertTypes";
import PlanForm, { PlanFormValues } from "pages/PlanPage/PlanForm";
import { useUnit } from "effector-react";
import useClickOutside from "hooks/useClickOutside";
import useEscape from "hooks/useEscape";
import { parseISO } from "helpers/parseISO";
import { PlanDto } from "models/Plan";
import { addPlanFx } from "../model";
import {
    $error,
    $isModalActive,
    errorReset,
    modalClosed,
    modalOpened,
} from "./model";

import styles from "./styles.module.scss";

const NewPlan: React.FC = () => {
    return (
        <>
            <PlanModal />
            <ActionButton
                className={styles.addBtn}
                colorType="info"
                onClick={() => modalOpened()}
            >
                Добавить
            </ActionButton>
        </>
    );
};

export default NewPlan;

function PlanModal() {
    const isModalActive = useUnit($isModalActive);
    const modalRef = useRef<HTMLDivElement | null>(null);

    useClickOutside(modalRef, () => modalClosed());
    useEscape(() => modalClosed());
    useLockedBody(isModalActive);

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

        const newPlan: PlanDto = {
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
            await addPlanFx({
                data: newPlan,
                controller: new AbortController(),
            });
        } catch (error) {}
    };

    if (!isModalActive) return null;

    return (
        <ModalLayout ref={modalRef}>
            <ModalHeader closeModal={() => modalClosed()}>
                Добавление
            </ModalHeader>
            <ModalContent>
                <ErrorAlert />
                <PlanForm
                    onSubmit={handleSubmit}
                    clearError={() => errorReset()}
                />
            </ModalContent>
        </ModalLayout>
    );
}

function ErrorAlert() {
    const error = useUnit($error);
    if (error) {
        return (
            <Alert className={styles.alert} type={ALERT.ERROR}>
                {error}
            </Alert>
        );
    }
    return null;
}
