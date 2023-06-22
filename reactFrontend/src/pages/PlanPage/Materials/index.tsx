import React, { FC, useRef, MouseEvent } from "react";
import ActionButton from "components/ActionButton";
import backIconSrc from "assets/img/back-icon.svg";
import InputFile from "components/formElements/InputFile";
import Confirm from "components/Comfirm";
import Alert, { ALERT } from "components/Alert";
import Loader from "components/Loader";
import cn from "classnames";
import ModalLayout from "components/ModalLayout";
import ModalHeader from "components/ModalLayout/ModalHeader";
import ModalContent from "components/ModalLayout/ModalContent";
import { useUnit } from "effector-react";
import useClickOutside from "hooks/useClickOutside";
import useEscape from "hooks/useEscape";
import useLockedBody from "hooks/useLockedBody";
import {
    $error,
    $file,
    $fileNames,
    $isAdding,
    $isConfirming,
    $isDisabled,
    $fileLoaders,
    $isModalActive,
    backButtonClicked,
    confirmButtonClicked,
    confirmingClosed,
    confirmingOpened,
    fileChanged,
    isAddingOpened,
    modalClosed,
    submitButtonClicked,
    downloadButtonClicked,
} from "./model";

import styles from "./styles.module.scss";

type ButtonClick = MouseEvent<HTMLButtonElement>;

interface ControlsParams {
    fileName: string;
    handleDownload: (event: ButtonClick, fileName: string) => void;
}

const Materials: FC = () => {
    const [isModalActive, isConfirming] = useUnit([
        $isModalActive,
        $isConfirming,
    ]);

    const modalRef = useRef<HTMLDivElement | null>(null);
    useClickOutside(modalRef, () => modalClosed(), { capture: false });
    useEscape(() => modalClosed());
    useLockedBody(isModalActive);

    if (!isModalActive) return null;

    return (
        <ModalLayout ref={modalRef}>
            <ModalHeader closeModal={() => modalClosed()}>
                Материалы
            </ModalHeader>
            <ModalContent>
                {isConfirming ? (
                    <Confirming />
                ) : (
                    <div>
                        <ErrorAlert />
                        <EmptyAlert />
                        <Files />
                        <Input />
                        <Controls />
                    </div>
                )}
            </ModalContent>
        </ModalLayout>
    );
};

export default Materials;

function Files() {
    const [fileNames, fileLoaders] = useUnit([$fileNames, $fileLoaders]);

    const handelDownload = (
        event: MouseEvent<HTMLButtonElement>,
        fileName: string
    ) => {
        event.stopPropagation();
        downloadButtonClicked(fileName);
    };

    return (
        <ul className={styles.list}>
            {fileNames.map((fileName) => (
                <li key={fileName}>
                    <button
                        className={styles.nameBtn}
                        onClick={(event) => handelDownload(event, fileName)}
                        disabled={fileLoaders.includes(fileName)}
                    >
                        {fileName}
                    </button>
                    <FileControls
                        fileName={fileName}
                        handleDownload={handelDownload}
                    />
                </li>
            ))}
        </ul>
    );
}

function FileControls({ fileName, handleDownload }: ControlsParams) {
    const [fileLoaders] = useUnit([$fileLoaders]);
    const isLoading = fileLoaders.includes(fileName);

    const handleDeleteClick = (event: ButtonClick, fileName: string) => {
        event.stopPropagation();
        confirmingOpened({ fileName });
    };

    return (
        <div className={styles.itemActions}>
            {isLoading ? (
                <Loader className={styles.fileLoader} />
            ) : (
                <button
                    className={styles.fileBtn}
                    onClick={(event) => handleDownload(event, fileName)}
                    disabled={isLoading}
                >
                    <svg
                        className={cn(styles.download)}
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M13.5 3H12H7C5.89543 3 5 3.89543 5 5V19C5 20.1046 5.89543 21 7 21H7.5M13.5 3L19 8.625M13.5 3V7.625C13.5 8.17728 13.9477 8.625 14.5 8.625H19M19 8.625V9.75V12V19C19 20.1046 18.1046 21 17 21H16.5"
                            stroke="#000000"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M12 12V20M12 20L9.5 17.5M12 20L14.5 17.5"
                            stroke="#000000"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </button>
            )}
            <button
                className={styles.fileBtn}
                onClick={(event) => handleDeleteClick(event, fileName)}
                disabled={isLoading}
            >
                <svg
                    className={styles.delete}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 50 50"
                >
                    <path d="M 21 2 C 19.354545 2 18 3.3545455 18 5 L 18 7 L 10.154297 7 A 1.0001 1.0001 0 0 0 9.984375 6.9863281 A 1.0001 1.0001 0 0 0 9.8398438 7 L 8 7 A 1.0001 1.0001 0 1 0 8 9 L 9 9 L 9 45 C 9 46.645455 10.354545 48 12 48 L 38 48 C 39.645455 48 41 46.645455 41 45 L 41 9 L 42 9 A 1.0001 1.0001 0 1 0 42 7 L 40.167969 7 A 1.0001 1.0001 0 0 0 39.841797 7 L 32 7 L 32 5 C 32 3.3545455 30.645455 2 29 2 L 21 2 z M 21 4 L 29 4 C 29.554545 4 30 4.4454545 30 5 L 30 7 L 20 7 L 20 5 C 20 4.4454545 20.445455 4 21 4 z M 11 9 L 18.832031 9 A 1.0001 1.0001 0 0 0 19.158203 9 L 30.832031 9 A 1.0001 1.0001 0 0 0 31.158203 9 L 39 9 L 39 45 C 39 45.554545 38.554545 46 38 46 L 12 46 C 11.445455 46 11 45.554545 11 45 L 11 9 z M 18.984375 13.986328 A 1.0001 1.0001 0 0 0 18 15 L 18 40 A 1.0001 1.0001 0 1 0 20 40 L 20 15 A 1.0001 1.0001 0 0 0 18.984375 13.986328 z M 24.984375 13.986328 A 1.0001 1.0001 0 0 0 24 15 L 24 40 A 1.0001 1.0001 0 1 0 26 40 L 26 15 A 1.0001 1.0001 0 0 0 24.984375 13.986328 z M 30.984375 13.986328 A 1.0001 1.0001 0 0 0 30 15 L 30 40 A 1.0001 1.0001 0 1 0 32 40 L 32 15 A 1.0001 1.0001 0 0 0 30.984375 13.986328 z" />
                </svg>
            </button>
        </div>
    );
}

function Input() {
    const [isAdding, file, isDisabled] = useUnit([
        $isAdding,
        $file,
        $isDisabled,
    ]);
    if (!isAdding) return null;
    return (
        <InputFile
            className={styles.input}
            file={file}
            onChange={fileChanged}
            disabled={isDisabled}
        />
    );
}

function Controls() {
    const [isAdding, isDisabled] = useUnit([$isAdding, $isDisabled]);
    const handleReturn = (event: ButtonClick) => {
        event.stopPropagation();
        backButtonClicked();
    };
    return (
        <div className={styles.controls}>
            {isAdding ? (
                <ActionButton
                    colorType="success"
                    onClick={() => submitButtonClicked()}
                    disabled={isDisabled}
                >
                    Сохранить
                </ActionButton>
            ) : (
                <ActionButton colorType="info" onClick={() => isAddingOpened()}>
                    Добавить
                </ActionButton>
            )}
            <ActionButton onClick={handleReturn} colorType="warning">
                Вернуться
                <img src={backIconSrc} alt="Back" />
            </ActionButton>
        </div>
    );
}

function Confirming() {
    const handleConfirm = (event: ButtonClick) => {
        event.stopPropagation();
        confirmButtonClicked();
    };
    const handleDecline = (event: ButtonClick) => {
        event.stopPropagation();
        confirmingClosed();
    };
    return (
        <Confirm
            title="Вы уверены, что хотите удалить запись?"
            handleConfirm={handleConfirm}
            handleDecline={handleDecline}
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

function EmptyAlert() {
    const [fileNames, isAdding] = useUnit([$fileNames, $isAdding]);
    if (fileNames.length < 1 && !isAdding) {
        return <Alert type={ALERT.INFO}>Список конспектов пуст</Alert>;
    }
    return null;
}
