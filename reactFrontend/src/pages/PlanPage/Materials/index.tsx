import React, { useState } from "react";
import ActionButton from "../../../components/buttons/ActionButton";
import backIconSrc from "../../../assets/img/back-icon.svg";
import InputFile from "../../../components/formElements/InputFile";
import PlanService from "../../../services/PlanService";
import { useParams } from "react-router-dom";
import { usePlansContext } from "../../../context/plansContext";
import { showNotion } from "../../../helpers/showNotion";
import { NOTION } from "../../../constants/notion";
import Confirm from "../../../components/Comfirm";
import { downloadFile } from "../../../helpers/downloadFile";
import { ALERT } from "../../../constants/alertTypes";
import Alert from "../../../components/Alert";

import "./styles.scss";

type Props = {
    lessonId: number;
    fileNames: string[];
    closeMaterialsEditing: (event: React.MouseEvent<HTMLButtonElement>) => void;
    setError: React.Dispatch<React.SetStateAction<string | null>>;
};

const Materials: React.FC<Props> = ({ closeMaterialsEditing, lessonId, fileNames, setError }) => {
    const [isAdding, setIsAdding] = useState(false);
    const [isConfirmin, setIsConfirming] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [fileToDelete, setFileToDelete] = useState<string | null>(null);
    const [isDisabled, setIsDisabled] = useState(false);

    const { divisionId = "" } = useParams();
    const { addFile, deleteFile } = usePlansContext();

    const handleAddFile = async () => {
        if (!file) {
            setIsAdding(false);
            return;
        }
        setIsDisabled(true);
        setError(null);

        const formData = new FormData();
        formData.append("file", file);

        try {
            await PlanService.postFile({ depId: divisionId, data: formData }, { params: { lessonId } });
            addFile(lessonId, file.name);
            showNotion(NOTION.SUCCESS, "Материалы успешно добавлены");
            setFile(null);
            setIsAdding(false);
        } catch (error) {
            const err = error as any;
            setError(err?.response?.data?.message ?? "Не удалось добавить запись");
            console.log(err);
        } finally {
            setIsDisabled(false);
        }
    };

    const handleDeleteFile = async () => {
        if (!fileToDelete) return;
        
        setIsConfirming(false);
        setIsDisabled(true);
        setError(null);

        try {
            await PlanService.deleteFile({ depId: divisionId, fileName: fileToDelete });
            deleteFile(lessonId, fileToDelete);
            showNotion(NOTION.SUCCESS, "Запись успешно удалена");
            setIsAdding(false);
        } catch (error) {
            console.log(error);
            const err = error as any;
            setError(err?.response?.data?.message ?? "Не удалось удалить запись");
        } finally {
            setIsDisabled(false);
        }
    };

    const handleDownLoadFile = async (fileName: string) => {
        setError(null);
        try {
            const response = await PlanService.fetchFile({ depId: divisionId, fileName });
            downloadFile(response.data, fileName);
        } catch (error) {
            console.log(error);
            const err = error as any;
            setError(err?.response?.data?.message ?? "Не удалось скачать запись");
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const filesList = event.target.files;
        const file = filesList ? filesList[0] : null;
        setFile(file);
    };

    const moveToConfirm = (fileName: string) => {
        setIsConfirming(true);
        setFileToDelete(fileName);
    };

    return (
        <>
            {isConfirmin ? (
                <Confirm
                    title="Вы уверены, что хотите удалить запись?"
                    handleConfirm={handleDeleteFile}
                    handleDecline={() => setIsConfirming(false)}
                />
            ) : (
                <div className="materials">
                    <>
                        {fileNames.length < 1 && !isAdding ? (
                            <Alert type={ALERT.INFO}>Список конспектов пуст</Alert>
                        ) : (
                            <>
                                <h5 className="materials__title">Конспекты:</h5>
                                <ul className="materials__list">
                                    {fileNames.map((fileName) => (
                                        <li className="materials__item" key={fileName}>
                                            <div className="materials__name">{fileName}</div>
                                            <div className="materials__item-actions">
                                                <button
                                                    className="materials__button"
                                                    onClick={() => handleDownLoadFile(fileName)}
                                                >
                                                    <svg
                                                        className="materials__icon materials__icon--download"
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
                                                <button
                                                    className="materials__button"
                                                    onClick={() => moveToConfirm(fileName)}
                                                    disabled={isDisabled}
                                                >
                                                    <svg
                                                        className="materials__icon materials__icon--delete"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 50 50"
                                                    >
                                                        <path d="M 21 2 C 19.354545 2 18 3.3545455 18 5 L 18 7 L 10.154297 7 A 1.0001 1.0001 0 0 0 9.984375 6.9863281 A 1.0001 1.0001 0 0 0 9.8398438 7 L 8 7 A 1.0001 1.0001 0 1 0 8 9 L 9 9 L 9 45 C 9 46.645455 10.354545 48 12 48 L 38 48 C 39.645455 48 41 46.645455 41 45 L 41 9 L 42 9 A 1.0001 1.0001 0 1 0 42 7 L 40.167969 7 A 1.0001 1.0001 0 0 0 39.841797 7 L 32 7 L 32 5 C 32 3.3545455 30.645455 2 29 2 L 21 2 z M 21 4 L 29 4 C 29.554545 4 30 4.4454545 30 5 L 30 7 L 20 7 L 20 5 C 20 4.4454545 20.445455 4 21 4 z M 11 9 L 18.832031 9 A 1.0001 1.0001 0 0 0 19.158203 9 L 30.832031 9 A 1.0001 1.0001 0 0 0 31.158203 9 L 39 9 L 39 45 C 39 45.554545 38.554545 46 38 46 L 12 46 C 11.445455 46 11 45.554545 11 45 L 11 9 z M 18.984375 13.986328 A 1.0001 1.0001 0 0 0 18 15 L 18 40 A 1.0001 1.0001 0 1 0 20 40 L 20 15 A 1.0001 1.0001 0 0 0 18.984375 13.986328 z M 24.984375 13.986328 A 1.0001 1.0001 0 0 0 24 15 L 24 40 A 1.0001 1.0001 0 1 0 26 40 L 26 15 A 1.0001 1.0001 0 0 0 24.984375 13.986328 z M 30.984375 13.986328 A 1.0001 1.0001 0 0 0 30 15 L 30 40 A 1.0001 1.0001 0 1 0 32 40 L 32 15 A 1.0001 1.0001 0 0 0 30.984375 13.986328 z" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </>
                        )}
                        {isAdding && <InputFile className="materials__input" file={file} onChange={handleFileChange} />}
                    </>

                    <div className="materials__actions">
                        {isAdding ? (
                            <ActionButton className="materials__action-button" colorType="success" onClick={handleAddFile} disabled={isDisabled}>
                                Сохранить
                            </ActionButton>
                        ) : (
                            <ActionButton className="materials__action-button" colorType="info" onClick={() => setIsAdding(true)}>
                                Добавить +
                            </ActionButton>
                        )}
                        <ActionButton
                            className="materials__action-button"
                            onClick={closeMaterialsEditing}
                            colorType="warning"
                        >
                            Вернуться
                            <img className="materials__back-icon" src={backIconSrc} alt="Back" />
                        </ActionButton>
                    </div>
                </div>
            )}
        </>
    );
};

export default Materials;
