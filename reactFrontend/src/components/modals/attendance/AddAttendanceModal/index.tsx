import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { NOTION } from "../../../../constants/notion";
import { useAttendanceContext } from "../../../../context/attendanceContext";
import { showNotion } from "../../../../helpers/showNotion";
import useClickOutside from "../../../../hooks/useClickOutside";
import useEscape from "../../../../hooks/useEscape";
import AttendanceService from "../../../../services/AttendanceService";
import AttendanceForm, { AttendanceFormState } from "../../../forms/AttendanceForm";
import ModalLayout from "../../ModalLayout";
import ModalHeader from "../../ModalLayout/ModalHeader";
import { TAttendanceDto } from "../../../../models/Attendance";
import { ALERT } from "../../../../constants/alertTypes";
import Alert from "../../../Alert";
import ModalContent from "../../ModalLayout/ModalContent";
import { useUserContext } from "../../../../context/userContext";

import "./styles.scss";

type Props = {
    closeModal: () => void;
};

const AddAttendanceModal: React.FC<Props> = ({ closeModal }) => {
    const modalRef = React.useRef<HTMLDivElement | null>(null);
    useClickOutside(modalRef, closeModal);
    useEscape(closeModal);

    const { divisionId = "" } = useParams();

    const [error, setError] = useState<string | null>(null);
    const { addAttendance } = useAttendanceContext();
    const { logout } = useUserContext();

    const handleSubmit = async (values: AttendanceFormState) => {
        setError(null);

        const { lessonId, studentId, success } = values;

        const newAttendance: TAttendanceDto = {
            studentId,
            lessonId: parseInt(lessonId),
            success: parseInt(success.value),
        };

        try {
            const response = await AttendanceService.post({ depId: divisionId, attendanceResult: newAttendance });
            addAttendance(response.data);
            showNotion(NOTION.SUCCESS, "Запись успешно добавлена");
            closeModal();
        } catch (error) {
            const err = error as any;
            console.log(err);
            if (err.response.status === 401) {
                logout();
            } else {
                setError(err?.response?.data?.message ?? "Не удалось добавить посещаемость");
            }
        }
    };

    return (
        <ModalLayout className="add-attendance-modal" ref={modalRef}>
            <ModalHeader closeModal={closeModal}>Добавление</ModalHeader>
            <ModalContent>
                {error && (
                    <Alert className="add-attendance-modal__alert" type={ALERT.ERROR}>
                        {error}
                    </Alert>
                )}
                <AttendanceForm onSubmit={handleSubmit} />
            </ModalContent>
        </ModalLayout>
    );
};

export default AddAttendanceModal;
