import React, { useRef } from "react";

import { useUnit } from "effector-react";

import Alert, { ALERT } from "components/Alert";
import Confirm from "components/Comfirm";
import ModalLayout from "components/ModalLayout";
import ModalContent from "components/ModalLayout/ModalContent";
import ModalHeader from "components/ModalLayout/ModalHeader";

import useClickOutside from "hooks/useClickOutside";
import useEscape from "hooks/useEscape";
import useLockedBody from "hooks/useLockedBody";

import AttendanceForm, { AttendanceFormState } from "../AttendanceForm";
import { updateAttendanceFx } from "../model";

import {
    $editingAttendance,
    $error,
    $isConfirming,
    $isDisabled,
    $isModalActive,
    confirmButtonClicked,
    confirmingClosed,
    errorReset,
    modalClosed,
    movedToConfirm,
} from "./model";

import styles from "./styles.module.scss";

const EditAttendance: React.FC = () => {
    const [isModalActive, editingAtendance] = useUnit([
        $isModalActive,
        $editingAttendance,
    ]);
    const modalRef = useRef<HTMLDivElement | null>(null);
    useClickOutside(modalRef, () => modalClosed());
    useEscape(() => modalClosed());
    useLockedBody(isModalActive);

    if (!isModalActive || editingAtendance === null) return null;

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

export default EditAttendance;

function Form() {
    const [attendance, isConfirming, isDisabled] = useUnit([
        $editingAttendance,
        $isConfirming,
        $isDisabled,
    ]);

    const handleSubmit = async (values: AttendanceFormState) => {
        const { success, lessonId, studentId } = values;
        const lessonNumber = parseInt(lessonId);
        try {
            await updateAttendanceFx({
                data: {
                    lessonId: lessonNumber,
                    studentId,
                    success: parseInt(success.value),
                },
                controller: new AbortController(),
            });
        } catch (error) {}
    };

    if (isConfirming) return null;

    return (
        <AttendanceForm
            onSubmit={handleSubmit}
            attendance={attendance}
            moveToConfrim={() => movedToConfirm()}
            isDisabled={isDisabled}
            isEditing={true}
            clearError={() => errorReset()}
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

function Confirming() {
    const isConfirming = useUnit($isConfirming);
    if (!isConfirming) return null;
    return (
        <Confirm
            title="Вы уверены, что хотите удалить запись?"
            handleConfirm={() => confirmButtonClicked()}
            handleDecline={() => confirmingClosed()}
        />
    );
}
