import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { NOTION } from "../../../../constants/notion";
import { useAttendanceContext } from "../../../../context/attendanceContext";
import { showNotion } from "../../../../helpers/showNotion";
import useClickOutside from "../../../../hooks/useClickOutside";
import useEscape from "../../../../hooks/useEscape";
import AttendanceService from "../../../../services/AttendanceService";
import Confirm from "../../../Comfirm";
import AttendanceForm, { AttendanceFormState } from "../../../forms/AttendanceForm";
import ModalLayout from "../../ModalLayout";
import ModalHeader from "../../ModalLayout/ModalHeader";
import { ALERT } from "../../../../constants/alertTypes";
import ModalContent from "../../ModalLayout/ModalContent";
import Alert from "../../../Alert";
import { useUserContext } from "../../../../context/userContext";
import { IAttendance } from "../../../../types/Attendance";

import "./styles.scss";

type Props = {
    closeEditing: () => void;
    attendance: IAttendance;
};

const EditAttendanceModal: React.FC<Props> = ({ closeEditing, attendance }) => {
    const modalRef = React.useRef<HTMLDivElement | null>(null);
    useClickOutside(modalRef, closeEditing);
    useEscape(closeEditing);

    const { lessonId, studentId } = attendance;
    const { divisionId = "" } = useParams();

    const { logout } = useUserContext();
    const [error, setError] = useState<string | null>(null);
    const { updateAttendance, deleteAttendance } = useAttendanceContext();
    const [isConfirming, setIsConfirming] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);

    const handleSubmit = async (values: AttendanceFormState) => {
        const { success } = values;
        setError(null);

        try {
            await AttendanceService.put({
                depId: divisionId,
                attendanceResult: { lessonId, studentId, success: parseInt(success.value) },
            });
            updateAttendance({ lessonId, studentId, success: parseInt(success.value) });
            showNotion(NOTION.SUCCESS, "Изменения успешно сохранены");
            closeEditing();
        } catch (error) {
            const err = error as any;
            if (err.response.status === 401) {
                logout();
            } else {
                setError(err?.response?.data?.message ?? "Не удалось сохранить изменения");
            }
        }
    };

    const handleDelete = async () => {
        setIsConfirming(false);
        setIsDisabled(true);
        setError(null);

        try {
            await AttendanceService.delete({
                depId: divisionId,
                attendanceCredentials: { lessonId, studentId },
            });
            deleteAttendance({ lessonId, studentId });
            showNotion(NOTION.SUCCESS, "Запись успешно удалена");
            closeEditing();
        } catch (error) {
            const err = error as any;
            if (err.response.status === 401) {
                logout();
            } else {
                setError(err?.response?.data?.message ?? "Не удалось удалить запись");
            }
        } finally {
            setIsDisabled(false);
        }
    };

    return (
        <ModalLayout className="edit-attendance-modal" ref={modalRef}>
            <ModalHeader closeModal={closeEditing}>Редактирование</ModalHeader>
            <ModalContent>
                {error && (
                    <Alert className="edit-attendance-modal__alert" type={ALERT.ERROR}>
                        {error}
                    </Alert>
                )}
                {isConfirming && (
                    <Confirm
                        title="Вы уверены, что хотите удалить запись?"
                        handleConfirm={handleDelete}
                        handleDecline={() => setIsConfirming(false)}
                    />
                )}
                {!isConfirming && (
                    <AttendanceForm
                        onSubmit={handleSubmit}
                        attendance={attendance}
                        moveToConfrim={() => {
                            setIsConfirming(true);
                            setError(null);
                        }}
                        isDisabled={isDisabled}
                        isEditing={true}
                        clearError={() => setError(null)}
                    />
                )}
            </ModalContent>
        </ModalLayout>
    );
};

export default EditAttendanceModal;
