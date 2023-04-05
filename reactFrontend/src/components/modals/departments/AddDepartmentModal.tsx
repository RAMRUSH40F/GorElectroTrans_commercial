import React, { useState } from "react";
import { useParams } from "react-router-dom";
import useClickOutside from "../../../hooks/useClickOutside";
import useEscape from "../../../hooks/useEscape";
import { TNewDepartment } from "../../../models/Department";
import DepartmentService from "../../../services/DepartmentService";
import DepartmentForm from "../../forms/DepartmentForm";
import ModalLayout from "../ModalLayout";
import ModalContent from "../ModalLayout/ModalContent";
import ModalHeader from "../ModalLayout/ModalHeader";
import ModalMessage from "../ModalLayout/ModalMessage";
import { showNotion } from "../../../helpers/showNotion";
import { NOTION } from "../../../constants/notion";
import { useDepartmentsContext } from "../../../context/departmentsContext";

type Props = {
    closeModal: () => void;
};

const AddDepartmentModal: React.FC<Props> = ({ closeModal }) => {
    const modalRef = React.useRef<HTMLDivElement | null>(null);
    useClickOutside(modalRef, closeModal);
    useEscape(closeModal);

    const { addDepartment } = useDepartmentsContext();
    const { divisionId = "" } = useParams();
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (values: TNewDepartment) => {
        console.log(values);

        try {
            const response = await DepartmentService.post({ depId: divisionId, department: { ...values } });
            console.log(response);
            addDepartment(response.data);
            showNotion(NOTION.SUCCESS, "Запись успешно добавлена");
            closeModal();
        } catch (error) {
            console.log(error);
            const err = error as any;
            setError(err?.response?.data?.message ?? "Не удалось добавить запись");
        }
    };

    return (
        <ModalLayout ref={modalRef}>
            <ModalHeader closeModal={closeModal}>Добавление отдела</ModalHeader>
            {error && <ModalMessage>{error}</ModalMessage>}
            <ModalContent>
                <DepartmentForm onSubmit={handleSubmit} />
            </ModalContent>
        </ModalLayout>
    );
};

export default AddDepartmentModal;
