import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { NOTION } from "../../../constants/notion";
import { useEmployeesContext } from "../../../context/employeesContext";
import { showNotion } from "../../../helpers/showNotion";
import useClickOutside from "../../../hooks/useClickOutside";
import useEscape from "../../../hooks/useEscape";
import { IEmployee } from "../../../models/Employee";
import Confirm from "../../Comfirm";
import EmployeeForm, { EmployeeFormState } from "../../forms/EmployeeForm";
import ModalLayout from "../ModalLayout";
import ModalContent from "../ModalLayout/ModalContent";
import ModalHeader from "../ModalLayout/ModalHeader";
import ModalMessage from "../ModalLayout/ModalMessage";
import EmployeeService from "../../../services/EmployeeService";

type Props = {
    closeModal: () => void;
    employee: IEmployee;
};

const EditEmployeeModal: React.FC<Props> = ({ closeModal, employee }) => {
    const modalRef = React.useRef<HTMLDivElement | null>(null);
    useClickOutside(modalRef, closeModal);
    useEscape(closeModal);

    const { divisionId = "" } = useParams();

    const { departments, deleteEmployee, updateEmployee } = useEmployeesContext();
    const [error, setError] = useState<string | null>(null);
    const [isConfirming, setIsConfirming] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);

    const handleSubmit = async (values: EmployeeFormState) => {
        setError(null);
        console.log(values);
        try {
            await EmployeeService.put({ depId: divisionId, employee: values });
            updateEmployee({ ...values, fullName: employee.fullName });
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
            await EmployeeService.delete({ depId: divisionId, studentId: employee.studentId });
            deleteEmployee(employee.studentId);
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
                        title="Вы уверены, что хотите удалить работника?"
                        handleConfirm={handleDelete}
                        handleDecline={handleDecline}
                    />
                ) : (
                    <EmployeeForm
                        onSubmit={handleSubmit}
                        departments={departments}
                        employee={employee}
                        moveToConfrim={moveToConfirm}
                        isDisabled={isDisabled}
                        isEditing={true}
                    />
                )}
            </ModalContent>
        </ModalLayout>
    );
};

export default EditEmployeeModal;
