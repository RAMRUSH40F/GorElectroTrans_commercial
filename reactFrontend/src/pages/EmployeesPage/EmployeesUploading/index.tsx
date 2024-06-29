import { MouseEvent, useRef } from "react";

import { useUnit } from "effector-react";

import ActionButton from "components/ActionButton";
import Alert, { ALERT } from "components/Alert";
import ModalLayout from "components/ModalLayout";
import ModalContent from "components/ModalLayout/ModalContent";
import ModalHeader from "components/ModalLayout/ModalHeader";
import { InputFile } from "components/formElements";

import useClickOutside from "hooks/useClickOutside";
import useEscape from "hooks/useEscape";
import useLockedBody from "hooks/useLockedBody";

import backIconSrc from "assets/img/back-icon.svg";

import {
    $error,
    $file,
    $isModalActive,
    $isTemplateDownloaded,
    $isTemplateLoading,
    $isUploaded,
    $isUploading,
    backButtonClicked,
    downloadButtonClicked,
    fileChanged,
    modalClosed,
    uploadButtonClicked,
} from "./model";

import styles from "./styles.module.scss";

type ButtonClick = MouseEvent<HTMLButtonElement>;

export const EmployeesUploading = () => {
    const [isModalActive] = useUnit([$isModalActive]);

    const modalRef = useRef<HTMLDivElement | null>(null);
    useClickOutside(modalRef, () => modalClosed());
    useEscape(() => modalClosed());
    useLockedBody(isModalActive);

    if (!isModalActive) return null;

    return (
        <ModalLayout ref={modalRef} id="employees-uploading-modal">
            <ModalHeader closeModal={() => modalClosed()}>
                Загрузка сотрудников
            </ModalHeader>
            <ModalContent>
                <ErrorAlert />
                <FileUploader />
                <TemplateLoader />
                <ModalControls />
            </ModalContent>
        </ModalLayout>
    );
};

function TemplateLoader() {
    const [isDisabled, isTemplateDownloaded, isUploaded] = useUnit([
        $isTemplateLoading,
        $isTemplateDownloaded,
        $isUploaded,
    ]);

    if (isTemplateDownloaded || isUploaded) return null;

    return (
        <ActionButton
            colorType="teal"
            onClick={() => downloadButtonClicked()}
            disabled={isDisabled}
            className={styles.templateButton}
        >
            Скачать шаблон
        </ActionButton>
    );
}

function FileUploader() {
    const [file, isUploading] = useUnit([$file, $isUploading]);

    return (
        <div className={styles.uploader}>
            <InputFile
                file={file}
                onChange={fileChanged}
                disabled={isUploading}
                placeholder="Загрузите шаблон"
            />
            <ActionButton
                colorType="success"
                className={styles.uploadButton}
                disabled={!file || isUploading}
                onClick={() => uploadButtonClicked()}
            >
                Загрузить файл
            </ActionButton>
        </div>
    );
}

function ModalControls() {
    const handleReturn = (event: ButtonClick) => {
        event.stopPropagation();
        backButtonClicked();
    };

    return (
        <div className={styles.controls}>
            <ActionButton onClick={handleReturn} colorType="warning">
                Вернуться
                <img src={backIconSrc} alt="Back" />
            </ActionButton>
        </div>
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
