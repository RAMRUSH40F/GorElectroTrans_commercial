import React, { useRef } from "react";

import { useUnit } from "effector-react";

import DepartmentForm from "pages/DepartmentsPage/DepartmentForm";

import ActionButton from "components/ActionButton";
import Alert, { ALERT } from "components/Alert";
import ModalLayout from "components/ModalLayout";
import ModalContent from "components/ModalLayout/ModalContent";
import ModalHeader from "components/ModalLayout/ModalHeader";

import useClickOutside from "hooks/useClickOutside";
import useEscape from "hooks/useEscape";
import useLockedBody from "hooks/useLockedBody";

import { TDepartmentDto } from "models/Department";

import { addDepartmentFx } from "../model";

import {
    $error,
    $isModalActive,
    errorReset,
    modalClosed,
    modalOpened,
} from "./model";

import styles from "./styles.module.scss";

const NewDepartment: React.FC = () => {
    return (
        <>
            <DepartmentModal />
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

export default NewDepartment;

function DepartmentModal() {
    const isModalActive = useUnit($isModalActive);
    const modalRef = useRef<HTMLDivElement | null>(null);

    useClickOutside(modalRef, () => modalClosed());
    useEscape(() => modalClosed());
    useLockedBody(isModalActive);

    if (!isModalActive) return null;

    const handleSubmit = async (values: TDepartmentDto) => {
        try {
            await addDepartmentFx({
                data: { name: values.name.trim() },
                controller: new AbortController(),
            });
        } catch (error) {}
    };

    return (
        <ModalLayout ref={modalRef}>
            <ModalHeader closeModal={() => modalClosed()}>
                Добавление
            </ModalHeader>
            <ModalContent>
                <ErrorAlert />
                <DepartmentForm
                    clearError={() => errorReset()}
                    onSubmit={handleSubmit}
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
