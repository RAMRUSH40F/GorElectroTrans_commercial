import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { NOTION } from "../../../constants/notion";
import { useStudentsContext } from "../../../context/studentsContext";
import { showNotion } from "../../../helpers/showNotion";
import useClickOutside from "../../../hooks/useClickOutside";
import useEscape from "../../../hooks/useEscape";
import { INewStudent } from "../../../models/Student";
import StudentsService from "../../../services/StudentService";
import StudentForm, { StudentFormState } from "../../forms/StudentForm";
import ModalLayout from "../ModalLayout";
import ModalContent from "../ModalLayout/ModalContent";
import ModalHeader from "../ModalLayout/ModalHeader";
import ModalMessage from "../ModalLayout/ModalMessage";

type Props = {
    closeModal: () => void;
};

const AddStudentModal: React.FC<Props> = ({ closeModal }) => {
    const modalRef = React.useRef<HTMLDivElement | null>(null);
    useClickOutside(modalRef, closeModal);
    useEscape(closeModal);

    const { divisionId = "" } = useParams();
    const { departments, addStudent } = useStudentsContext();
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (values: StudentFormState) => {
        console.log(values);

        const newStudent: INewStudent = {
            ...values,
            fullName: values.fullName?.length ? values.fullName : null,
        };
        console.log(newStudent);

        try {
            const response = await StudentsService.post({ depId: divisionId, student: newStudent });
            console.log(response);
            addStudent(response.data);
            showNotion(NOTION.SUCCESS, "Изменения успешно сохранены");
            closeModal();
        } catch (error) {
            console.log(error);
            const err = error as any;
            setError(err?.response?.data?.message ?? "Не удалось добавить запись");
        }
    };

    return (
        <ModalLayout ref={modalRef}>
            <ModalHeader closeModal={closeModal}>Добавление студента</ModalHeader>
            {error && <ModalMessage>{error}</ModalMessage>}
            <ModalContent>
                <StudentForm departments={departments} onSubmit={handleSubmit} />
            </ModalContent>
        </ModalLayout>
    );
};

export default AddStudentModal;
