import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { NOTION } from "../../../constants/notion";
import { useAttendanceContext } from "../../../context/attendanceContext";
import { showNotion } from "../../../helpers/showNotion";
import useClickOutside from "../../../hooks/useClickOutside";
import useEscape from "../../../hooks/useEscape";
import AttendanceService from "../../../services/AttendanceService";
import AttendanceForm, { AttendanceFormState } from "../../forms/AttendanceForm";
import ModalLayout from "../ModalLayout";
import ModalContent from "../ModalLayout/ModalContent";
import ModalHeader from "../ModalLayout/ModalHeader";
import ModalMessage from "../ModalLayout/ModalMessage";

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

    const handleSubmit = async (values: AttendanceFormState) => {
        console.log(values);

        try {
            const response = await AttendanceService.post({
                depId: divisionId,
                attendanceResult: { ...values, lessonId: parseInt(values.lessonId) },
            });
            console.log(response);
            addAttendance(response.data);
            showNotion(NOTION.SUCCESS, "Запись успешно добавлена");
            closeModal();
        } catch (error) {
            console.log(error);
            const err = error as any;
            const message = err?.response?.data?.message ?? "Не удалось добавить посещаемость";
            setError(message);
        }
    };

    return (
        <ModalLayout ref={modalRef}>
            <ModalHeader closeModal={closeModal}>Добавление посещаемости</ModalHeader>
            {error && <ModalMessage>{error}</ModalMessage>}
            <ModalContent>
                <AttendanceForm onSubmit={handleSubmit} />
            </ModalContent>
        </ModalLayout>
    );
};

export default AddAttendanceModal;
