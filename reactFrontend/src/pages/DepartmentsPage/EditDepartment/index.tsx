import React, { useRef } from "react";

import { useUnit } from "effector-react";

import DepartmentForm from "pages/DepartmentsPage/DepartmentForm";

import Alert, { ALERT } from "components/Alert";
import Confirm from "components/Comfirm";
import ModalLayout from "components/ModalLayout";
import ModalContent from "components/ModalLayout/ModalContent";
import ModalHeader from "components/ModalLayout/ModalHeader";

import useClickOutside from "hooks/useClickOutside";
import useEscape from "hooks/useEscape";
import useLockedBody from "hooks/useLockedBody";

import { IDepartment, TDepartmentDto } from "models/Department";

import { updateDepartmentFx } from "../model";

import {
    $editingDepartment,
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

const EditDepartment: React.FC = () => {
    const [isModalActive, editingDepartment] = useUnit([
        $isModalActive,
        $editingDepartment,
    ]);
    const modalRef = useRef<HTMLDivElement | null>(null);
    useClickOutside(modalRef, () => modalClosed());
    useEscape(() => modalClosed());
    useLockedBody(isModalActive);

    if (!isModalActive || editingDepartment === null) return null;

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

export default EditDepartment;

function Form() {
    const [department, isConfirming, isDisabled] = useUnit([
        $editingDepartment,
        $isConfirming,
        $isDisabled,
    ]);

    if (isConfirming || !department) return null;

    const handleSubmit = async (values: TDepartmentDto) => {
        const newDepartment: IDepartment = {
            id: department.id,
            name: values.name.trim(),
        };
        try {
            await updateDepartmentFx({
                data: newDepartment,
                controller: new AbortController(),
            });
        } catch (error) {}
    };

    return (
        <DepartmentForm
            onSubmit={handleSubmit}
            clearError={() => errorReset()}
            department={department}
            moveToConfrim={() => movedToConfirm()}
            isDisabled={isDisabled}
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
