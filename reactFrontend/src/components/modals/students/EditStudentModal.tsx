import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { NOTION } from "../../../constants/notion";
import { useStudentsContext } from "../../../context/studentsContext";
import { showNotion } from "../../../helpers/showNotion";
import useClickOutside from "../../../hooks/useClickOutside";
import useEscape from "../../../hooks/useEscape";
import { IStudent, INewStudent } from "../../../models/Student";
import StudentsService from "../../../services/StudentService";
import Confirm from "../../Comfirm";
import StudentForm, { StudentFormState } from "../../forms/StudentForm";
import ModalLayout from "../ModalLayout";
import ModalContent from "../ModalLayout/ModalContent";
import ModalHeader from "../ModalLayout/ModalHeader";
import ModalMessage from "../ModalLayout/ModalMessage";

type Props = {
    closeModal: () => void;
    student: IStudent;
};

const EditStudentModal: React.FC<Props> = ({ closeModal, student }) => {
    const modalRef = React.useRef<HTMLDivElement | null>(null);
    useClickOutside(modalRef, closeModal);
    useEscape(closeModal);

    const { divisionId = "" } = useParams();

    const { departments, deleteStudent, updateStudents } = useStudentsContext();
    const [error, setError] = useState<string | null>(null);
    const [isConfirming, setIsConfirming] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);

    const handleSubmit = async (values: StudentFormState) => {
        setError(null);
        console.log(values);
        try {
            await StudentsService.put({ depId: divisionId, student: { ...values } });
            updateStudents({ ...values, fullName: student.fullName });
            showNotion(NOTION.SUCCESS, "Изменения успешно сохранены");
            closeModal();
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
            const response = await StudentsService.delete({ depId: divisionId, studentId: student.studentId });
            deleteStudent(student.studentId);
            showNotion(NOTION.SUCCESS, "Запись успешно удалена");
            closeModal();
        } catch (error) {
            console.log(error);
            const err = error as any;
            setError(err?.response?.data?.message ?? "Не удалось удалить запись");
        } finally {
            setIsDisabled(false);
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
            <ModalHeader closeModal={closeModal}>Редактирование</ModalHeader>
            {error && <ModalMessage>{error}</ModalMessage>}
            <ModalContent>
                {isConfirming ? (
                    <Confirm
                        title="Вы уверены, что хотите удалить студента?"
                        handleConfirm={handleDelete}
                        handleDecline={handleDecline}
                    />
                ) : (
                    <StudentForm
                        onSubmit={handleSubmit}
                        departments={departments}
                        student={student}
                        moveToConfrim={moveToConfirm}
                        isDisabled={isDisabled}
                        isEditing={true}
                    />
                )}
            </ModalContent>
        </ModalLayout>
    );
};

export default EditStudentModal;
