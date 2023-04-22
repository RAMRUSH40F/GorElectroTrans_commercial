import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { NOTION } from "../../../../constants/notion";
import { useEmployeesContext } from "../../../../context/employeesContext";
import { showNotion } from "../../../../helpers/showNotion";
import useClickOutside from "../../../../hooks/useClickOutside";
import useEscape from "../../../../hooks/useEscape";
import EmployeeService from "../../../../services/EmployeeService";
import ModalLayout from "../../ModalLayout";
import ModalHeader from "../../ModalLayout/ModalHeader";
import EmployeeForm, { EmployeeFormState } from "../../../forms/EmployeeForm";
import { IEmployee } from "../../../../models/Employee";
import { ALERT } from "../../../../constants/alertTypes";
import Loader from "../../../Loader";
import ModalContent from "../../ModalLayout/ModalContent";
import Alert from "../../../Alert";
import { useFetchDepartmentsList } from "../../../../hooks/useFetchDepartmentsList";
import { useUserContext } from "../../../../context/userContext";

import "./styles.scss";

type Props = {
    closeModal: () => void;
};

const AddEmployeeModal: React.FC<Props> = ({ closeModal }) => {
    const modalRef = React.useRef<HTMLDivElement | null>(null);
    useClickOutside(modalRef, closeModal);
    useEscape(closeModal);

    const { divisionId = "" } = useParams();

    const { logout } = useUserContext();
    const { addEmployee } = useEmployeesContext();
    const [error, setError] = useState<string | null>(null);

    const { departments, error: depError, isLoading } = useFetchDepartmentsList(divisionId);

    const handleSubmit = async (values: EmployeeFormState) => {
        setError(null);
        const { fullName, studentId, subdepartment } = values;

        const newEmployee: IEmployee = {
            fullName: fullName.trim(),
            studentId,
            subdepartmentName: subdepartment.value,
        };

        try {
            const response = await EmployeeService.post({ depId: divisionId, employee: newEmployee });
            addEmployee(response.data);
            showNotion(NOTION.SUCCESS, "Изменения успешно сохранены");
            closeModal();
        } catch (error) {
            const err = error as any;
            console.log(err);
            if (err.response.status === 401) {
                logout();
            } else {
                setError(err?.response?.data?.message ?? "Не удалось добавить работника");
            }
        }
    };

    let contentToRender: React.ReactNode;

    if (isLoading) {
        contentToRender = <Loader className="add-employee-modal__loader" />;
    } else if (depError) {
        contentToRender = (
            <Alert className="add-employee-modal__alert" type={ALERT.ERROR}>
                {depError}
            </Alert>
        );
    } else if (error) {
        contentToRender = (
            <Alert className="add-employee-modal__alert" type={ALERT.ERROR}>
                {error}
            </Alert>
        );
    } else {
        contentToRender = <EmployeeForm departments={departments} onSubmit={handleSubmit} />;
    }

    return (
        <ModalLayout className="add-employee-modal" ref={modalRef}>
            <ModalHeader closeModal={closeModal}>Добавление</ModalHeader>
            <ModalContent>{contentToRender}</ModalContent>
        </ModalLayout>
    );
};

export default AddEmployeeModal;
