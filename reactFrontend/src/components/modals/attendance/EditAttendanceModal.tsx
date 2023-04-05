import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { NOTION } from "../../../constants/notion";
import { useAttendanceContext } from "../../../context/attendanceContext";
import { showNotion } from "../../../helpers/showNotion";
import useClickOutside from "../../../hooks/useClickOutside";
import useEscape from "../../../hooks/useEscape";
import { IAttendance } from "../../../models/Attendance";
import AttendanceService from "../../../services/AttendanceService";
import Confirm from "../../Comfirm";
import AttendanceForm, { AttendanceFormState } from "../../forms/AttendanceForm";
import ModalLayout from "../ModalLayout";
import ModalContent from "../ModalLayout/ModalContent";
import ModalHeader from "../ModalLayout/ModalHeader";
import ModalMessage from "../ModalLayout/ModalMessage";

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

    const [error, setError] = useState<string | null>(null);
    const { updateAttendance, deleteAttendance } = useAttendanceContext();
    const [isConfirming, setIsConfirming] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);

    const handleSubmit = async (values: AttendanceFormState) => {
        setError(null);

        console.log(values);

        try {
            await AttendanceService.put({
                depId: divisionId,
                attendanceResult: { lessonId, studentId, success: values.success },
            });
            updateAttendance({ lessonId, studentId, success: values.success });
            showNotion(NOTION.SUCCESS, "Изменения успешно сохранены");
            closeEditing();
        } catch (error) {
            console.log(error);
            const err = error as any;
            setError(err?.response?.data?.message ?? "Не удалось сохранить изменения");
        }
    };

    const handleDelete = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
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
            console.log(error);
            const err = error as any;
            setError(err?.response?.data?.message ?? "Не удалось удалить запись");
        }
    };

    const moveToConfirm = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        setIsConfirming(true);
    };

    const handleDecline = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        setIsConfirming(false);
    };

    return (
        <ModalLayout ref={modalRef}>
            <ModalHeader closeModal={closeEditing}>Редактирование</ModalHeader>
            {error && <ModalMessage>{error}</ModalMessage>}
            <ModalContent>
                {isConfirming ? (
                    <Confirm
                        title="Вы уверены, что хотите удалить запись?"
                        handleConfirm={handleDelete}
                        handleDecline={handleDecline}
                    />
                ) : (
                    <AttendanceForm
                        onSubmit={handleSubmit}
                        attendance={attendance}
                        moveToConfrim={moveToConfirm}
                        isDisabled={isDisabled}
                        isEditing={true}
                    />
                )}
            </ModalContent>
        </ModalLayout>
    );
};

export default EditAttendanceModal;
