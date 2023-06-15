import { useUnit } from "effector-react";
import React, { useRef } from "react";
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
import useLockedBody from "hooks/useLockedBody";
import ModalLayout from "components/modals/ModalLayout";
import ModalHeader from "components/modals/ModalLayout/ModalHeader";
import ModalContent from "components/modals/ModalLayout/ModalContent";
import Alert from "components/Alert";
import Confirm from "components/Comfirm";
import AttendanceForm, { AttendanceFormState } from "../AttendanceForm";
import useClickOutside from "hooks/useClickOutside";
import useEscape from "hooks/useEscape";
import { ALERT } from "constants/alertTypes";
import { updateAttendanceFx } from "../model";

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
                lessonId: lessonNumber,
                studentId,
                success: parseInt(success.value),
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
