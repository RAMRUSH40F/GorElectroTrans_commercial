import React, { useRef } from "react";

import { useUnit } from "effector-react";

import Alert, { ALERT } from "components/Alert";
import Confirm from "components/Comfirm";
import Loader from "components/Loader";
import ModalLayout from "components/ModalLayout";
import ModalContent from "components/ModalLayout/ModalContent";
import ModalHeader from "components/ModalLayout/ModalHeader";

import useClickOutside from "hooks/useClickOutside";
import useEscape from "hooks/useEscape";
import useLockedBody from "hooks/useLockedBody";

import { IEmployee } from "models/Employee";

import EmployeeForm, { EmployeeFormState } from "../EmployeeForm";
import { updateEmployeeFx } from "../model/model";

import {
    $depError,
    $departments,
    $editingEmployee,
    $error,
    $isConfirming,
    $isDisabled,
    $isLoading,
    $isModalActive,
    confirmButtonClicked,
    confirmingClosed,
    errorReset,
    modalClosed,
    movedToConfirm,
} from "./model";

import styles from "./styles.module.scss";

const EditEmployee: React.FC = () => {
    const [isModalActive, editingEmployee, depError] = useUnit([
        $isModalActive,
        $editingEmployee,
        $depError,
    ]);
    const modalRef = useRef<HTMLDivElement | null>(null);
    useClickOutside(modalRef, () => modalClosed());
    useEscape(() => modalClosed());
    useLockedBody(isModalActive);

    if (!isModalActive || editingEmployee === null) return null;

    return (
        <ModalLayout ref={modalRef}>
            <ModalHeader closeModal={() => modalClosed()}>
                Редактирование
            </ModalHeader>
            <ModalContent>
                <ErrorAlert error={depError} />
                <Loading />
                <Confirming />
                <Form />
            </ModalContent>
        </ModalLayout>
    );
};

export default EditEmployee;

function Form() {
    const [
        employee,
        isConfirming,
        isDisabled,
        error,
        departments,
        depError,
        isLoading,
    ] = useUnit([
        $editingEmployee,
        $isConfirming,
        $isDisabled,
        $error,
        $departments,
        $depError,
        $isLoading,
    ]);

    const handleSubmit = async (values: EmployeeFormState) => {
        const { fullName, studentId, subdepartment } = values;
        const newEmployee: IEmployee = {
            fullName,
            studentId,
            subdepartmentName: subdepartment.value,
        };
        try {
            await updateEmployeeFx({
                data: newEmployee,
                controller: new AbortController(),
            });
        } catch (error) {}
    };

    if (isConfirming || depError || isLoading || departments.length === 0) {
        return null;
    }

    return (
        <>
            <ErrorAlert error={error} />
            <EmployeeForm
                onSubmit={handleSubmit}
                departments={departments}
                clearError={() => errorReset()}
                employee={employee}
                moveToConfrim={() => movedToConfirm()}
                isDisabled={isDisabled}
                isEditing={true}
            />
        </>
    );
}

function ErrorAlert({ error }: { error: string | null }) {
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
            title="Вы уверены, что хотите удалить работника?"
            handleConfirm={() => confirmButtonClicked()}
            handleDecline={() => confirmingClosed()}
        />
    );
}

function Loading() {
    const isLoading = useUnit($isLoading);
    return isLoading ? <Loader className={styles.loader} /> : null;
}
