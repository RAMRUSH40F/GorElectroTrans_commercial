import React, { useRef } from "react";
import useLockedBody from "hooks/useLockedBody";
import ActionButton from "components/buttons/ActionButton";
import ModalLayout from "components/modals/ModalLayout";
import ModalHeader from "components/modals/ModalLayout/ModalHeader";
import ModalContent from "components/modals/ModalLayout/ModalContent";
import Alert from "components/Alert";
import AttendanceForm, {
    AttendanceFormState,
} from "pages/AttendancePage/AttendanceForm";
import { ALERT } from "constants/alertTypes";
import { useUnit } from "effector-react";
import useClickOutside from "hooks/useClickOutside";
import useEscape from "hooks/useEscape";
import { addAttendanceFx } from "../model";
import { TAttendanceDto } from "models/Attendance";
import {
    $isModalActive,
    errorReset,
    modalClosed,
    modalOpened,
    $error,
} from "./model";

import styles from "./styles.module.scss";

const NewAttendance: React.FC = () => {
    return (
        <>
            <AttendanceModal />
            <ActionButton
                className={styles.addBtn}
                colorType="info"
                onClick={() => modalOpened()}
            >
                Добавить +
            </ActionButton>
        </>
    );
};

export default NewAttendance;

function AttendanceModal() {
    const isModalActive = useUnit($isModalActive);
    const modalRef = useRef<HTMLDivElement | null>(null);

    useClickOutside(modalRef, () => modalClosed());
    useEscape(() => modalClosed());
    useLockedBody(isModalActive);

    const handleSubmit = async (values: AttendanceFormState) => {
        const { lessonId, studentId, success } = values;

        const newAttendance: TAttendanceDto = {
            studentId,
            lessonId: parseInt(lessonId),
            success: parseInt(success.value),
        };
        await addAttendanceFx(newAttendance);
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
