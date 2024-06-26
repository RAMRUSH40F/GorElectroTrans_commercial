import React, { useRef } from "react";

import { useUnit } from "effector-react";

import ActionButton from "components/ActionButton";
import Alert, { ALERT } from "components/Alert";
import { DateRangeForm } from "components/DateRangeForm";
import ModalLayout from "components/ModalLayout";
import ModalContent from "components/ModalLayout/ModalContent";
import ModalHeader from "components/ModalLayout/ModalHeader";

import useClickOutside from "hooks/useClickOutside";
import useEscape from "hooks/useEscape";
import useLockedBody from "hooks/useLockedBody";

import { $error, $isModalActive, modalClosed, modalOpened } from "./model";

import styles from "./styles.module.scss";

const AttendanceReport: React.FC = () => {
    return (
        <>
            <ReportModal />
            <ActionButton
                className={styles.reportBtn}
                onClick={() => modalOpened()}
                colorType="teal"
            >
                Сформировать отчет
            </ActionButton>
        </>
    );
};

export default AttendanceReport;

function ReportModal() {
    const isModalActive = useUnit($isModalActive);

    const modalRef = useRef<HTMLDivElement | null>(null);
    useClickOutside(modalRef, () => modalClosed());
    useEscape(() => modalClosed());
    useLockedBody(isModalActive);

    if (!isModalActive) return null;

    return (
        <ModalLayout ref={modalRef}>
            <ModalHeader closeModal={() => modalClosed()}>
                Отчетность
            </ModalHeader>
            <ModalContent>
                <ErrorAlert />
                <DateRangeForm onSubmit={async (data) => console.log(data)} />
            </ModalContent>
        </ModalLayout>
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
