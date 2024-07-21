import React, { useRef } from "react";

import { useUnit } from "effector-react";

import ActionButton from "components/ActionButton";
import Alert, { ALERT } from "components/Alert";
import Loader from "components/Loader";
import ModalLayout from "components/ModalLayout";
import ModalContent from "components/ModalLayout/ModalContent";
import ModalHeader from "components/ModalLayout/ModalHeader";

import useClickOutside from "hooks/useClickOutside";
import useEscape from "hooks/useEscape";
import useLockedBody from "hooks/useLockedBody";

import { IEmployee } from "models/Employee";

import EmployeeForm, { EmployeeFormState } from "../EmployeeForm";
import { addEmployeeFx } from "../model";

import {
    $depError,
    $departments,
    $error,
    $isLoading,
    $isModalActive,
    errorReset,
    modalClosed,
    modalOpened,
} from "./model";

import styles from "./styles.module.scss";

const NewEmployee: React.FC = () => {
    return (
        <>
            <EmployeeModal />
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

export default NewEmployee;

function EmployeeModal() {
    const isModalActive = useUnit($isModalActive);
    const modalRef = useRef<HTMLDivElement | null>(null);

    useClickOutside(modalRef, () => modalClosed());
    useEscape(() => modalClosed());
    useLockedBody(isModalActive);

    const depError = useUnit($depError);

    if (!isModalActive) return null;

    return (
        <ModalLayout ref={modalRef}>
            <ModalHeader closeModal={() => modalClosed()}>
                Добавление
            </ModalHeader>
            <ModalContent>
                <Loading />
                <ErrorAlert error={depError} />
                <EmptyAlert />
                <Form />
            </ModalContent>
        </ModalLayout>
    );
}

function Form() {
    const [error, departments, depError, isLoading] = useUnit([
        $error,
        $departments,
        $depError,
        $isLoading,
    ]);

    const handleSubmit = async (values: EmployeeFormState) => {
        const { fullName, studentId, subdepartment } = values;
        const newEmployee: IEmployee = {
            fullName: fullName.trim(),
            studentId,
            subdepartmentName: subdepartment.value,
        };
        try {
            await addEmployeeFx({
                data: newEmployee,
                controller: new AbortController(),
            });
        } catch (error) {}
    };

    if (depError || isLoading || departments.length === 0) return null;

    return (
        <>
            <ErrorAlert error={error} />
            <EmployeeForm
                onSubmit={handleSubmit}
                clearError={() => errorReset()}
                departments={departments}
                isEditing={false}
            />
        </>
    );
}

function ErrorAlert({ error }: { error: string | null }) {
    if (error) {
        return (
            <Alert className={styles.alert} type={ALERT.ERROR}>
                {error}
            </Alert>
        );
    }
    return null;
}

function EmptyAlert() {
    const [departments, isLoading, depError] = useUnit([
        $departments,
        $isLoading,
        $depError,
    ]);
    if (departments.length > 0 || isLoading || depError) return null;
    return (
        <Alert className={styles.alert} type={ALERT.INFO}>
            Нет существующих отделов
        </Alert>
    );
}

function Loading() {
    const isLoading = useUnit($isLoading);
    return isLoading ? <Loader className={styles.loader} /> : null;
}
