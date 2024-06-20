import React, { MouseEvent, useRef } from "react";

import { useUnit } from "effector-react";

import AttendanceForm, {
    AttendanceFormState,
} from "pages/AttendancePage/AttendanceForm";

import ActionButton from "components/ActionButton";
import Alert, { ALERT } from "components/Alert";
import ModalLayout from "components/ModalLayout";
import ModalContent from "components/ModalLayout/ModalContent";
import ModalHeader from "components/ModalLayout/ModalHeader";

import useClickOutside from "hooks/useClickOutside";
import useEscape from "hooks/useEscape";
import useLockedBody from "hooks/useLockedBody";

import { AttendanceDto } from "models/Attendance";

import { addAttendanceFx } from "../model";

import {
    $error,
    $isModalActive,
    errorReset,
    modalClosed,
    modalOpened,
} from "./model";

import styles from "./styles.module.scss";

const NewAttendance: React.FC = () => {
    const handleModalOpen = (event: MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        modalOpened();
    };

    return (
        <>
            <AttendanceModal />
            <ActionButton
                className={styles.addBtn}
                colorType="info"
                onClick={handleModalOpen}
            >
                Добавить
            </ActionButton>
        </>
    );
};

export default NewAttendance;

function AttendanceModal() {
    const isModalActive = useUnit($isModalActive);
    const modalRef = useRef<HTMLDivElement | null>(null);

    useClickOutside(modalRef, () => modalClosed(), { capture: false });
    useEscape(() => modalClosed());
    useLockedBody(isModalActive);

    const handleSubmit = async (values: AttendanceFormState) => {
        const { lessonId, studentId, success } = values;

        const newAttendance: AttendanceDto = {
            studentId,
            lessonId: parseInt(lessonId),
            success: parseInt(success.value),
        };
        try {
            await addAttendanceFx({
                data: newAttendance,
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
                <AttendanceForm
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
