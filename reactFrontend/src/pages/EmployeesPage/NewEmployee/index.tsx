import React, { useRef } from "react";
import ActionButton from "../../../components/buttons/ActionButton";
import useLockedBody from "../../../hooks/useLockedBody";
import { useUnit } from "effector-react";
import Alert, { ALERT } from "components/Alert";
import ModalLayout from "components/modals/ModalLayout";
import ModalHeader from "components/modals/ModalLayout/ModalHeader";
import ModalContent from "components/modals/ModalLayout/ModalContent";
import EmployeeForm, {
    EmployeeFormState,
} from "pages/EmployeesPage/EmployeeForm";
import Loader from "components/Loader";
import useClickOutside from "hooks/useClickOutside";
import useEscape from "hooks/useEscape";
import { IEmployee } from "models/Employee";
import { addEmployeeFx } from "../model";
import cn from "classnames";
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

type Props = {
    className?: string;
};

const NewEmployee: React.FC<Props> = ({ className }) => {
    return (
        <>
            <EmployeeModal />
            <ActionButton
                className={cn(styles.addBtn, className)}
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
