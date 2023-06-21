import React, { useRef } from "react";
import ActionButton from "components/buttons/ActionButton";
import useClickOutside from "hooks/useClickOutside";
import useEscape from "hooks/useEscape";
import useLockedBody from "hooks/useLockedBody";
import ModalLayout from "components/modals/ModalLayout";
import ModalHeader from "components/modals/ModalLayout/ModalHeader";
import ModalContent from "components/modals/ModalLayout/ModalContent";
import PlanReportForm from "pages/PlanPage/PlanReport/PlanReportForm";
import Alert, { ALERT } from "components/Alert";
import Loader from "components/Loader";
import { useUnit } from "effector-react";
import {
    $isLoading,
    $isModalActive,
    $periods,
    $periodsError,
    modalClosed,
    modalOpened,
} from "./model";

import styles from "./styles.module.scss";

const PlanReport: React.FC = () => {
    return (
        <>
            <ReportModal />
            <ActionButton
                className={styles.reportBtn}
                onClick={() => modalOpened()}
                colorType="custom"
            >
                Сформировать отчет
            </ActionButton>
        </>
    );
};

export default PlanReport;

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
                <EmptyAlert />
                <Loading />
                <Form />
            </ModalContent>
        </ModalLayout>
    );
}

function Form() {
    const [periods, periodsError] = useUnit([$periods, $periodsError]);
    if (periodsError || periods.length === 0) return null;
    return <PlanReportForm />;
}

function EmptyAlert() {
    const [periods, periodsError, isLoading] = useUnit([
        $periods,
        $periodsError,
        $isLoading,
    ]);
    if (periods.length > 0 || periodsError !== null || isLoading) return null;
    return (
        <Alert className={styles.alert} type={ALERT.INFO}>
            Нет информации о кварталах
        </Alert>
    );
}

function ErrorAlert() {
    const periodsError = useUnit($periodsError);
    if (!periodsError) return null;
    return (
        <Alert className={styles.alert} type={ALERT.ERROR}>
            {periodsError}
        </Alert>
    );
}

function Loading() {
    const isLoading = useUnit($isLoading);
    return isLoading ? <Loader className={styles.loader} /> : null;
}
