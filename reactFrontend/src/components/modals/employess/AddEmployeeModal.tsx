import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { NOTION } from "../../../constants/notion";
import { useEmployeesContext } from "../../../context/employeesContext";
import { showNotion } from "../../../helpers/showNotion";
import useClickOutside from "../../../hooks/useClickOutside";
import useEscape from "../../../hooks/useEscape";
import EmployeeService from "../../../services/EmployeeService";
import ModalLayout from "../ModalLayout";
import ModalContent from "../ModalLayout/ModalContent";
import ModalHeader from "../ModalLayout/ModalHeader";
import ModalMessage from "../ModalLayout/ModalMessage";
import EmployeeForm, { EmployeeFormState } from "../../forms/EmployeeForm";

type Props = {
    closeModal: () => void;
};

const AddEmployeeModal: React.FC<Props> = ({ closeModal }) => {
    const modalRef = React.useRef<HTMLDivElement | null>(null);
    useClickOutside(modalRef, closeModal);
    useEscape(closeModal);

    const { divisionId = "" } = useParams();
    const { departments, addEmployee } = useEmployeesContext();
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (values: EmployeeFormState) => {
        setError(null);
        console.log(values);

        try {
            const response = await EmployeeService.post({
                depId: divisionId,
                employee: { ...values, fullName: values.fullName.trim() },
            });
            console.log(response);
            addEmployee(response.data);
            showNotion(NOTION.SUCCESS, "Изменения успешно сохранены");
            closeModal();
        } catch (error) {
            console.log(error);
            const err = error as any;
            setError(err?.response?.data?.message ?? "Не удалось добавить работника");
        }
    };

    return (
        <ModalLayout ref={modalRef}>
            <ModalHeader closeModal={closeModal}>Добавление работника</ModalHeader>
            {error && <ModalMessage>{error}</ModalMessage>}
            <ModalContent>
                <EmployeeForm departments={departments} onSubmit={handleSubmit} />
            </ModalContent>
        </ModalLayout>
    );
};

export default AddEmployeeModal;
