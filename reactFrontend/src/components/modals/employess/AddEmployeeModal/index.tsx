import React, { useEffect, useState } from "react";
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
import axios from "axios";
import DepartmentService from "../../../../services/DepartmentService";
import Loader from "../../../Loader";
import ModalContent from "../../ModalLayout/ModalContent";
import Alert from "../../../Alert";

import "./styles.scss";

type Props = {
    closeModal: () => void;
};

const AddEmployeeModal: React.FC<Props> = ({ closeModal }) => {
    const modalRef = React.useRef<HTMLDivElement | null>(null);
    useClickOutside(modalRef, closeModal);
    useEscape(closeModal);

    const { divisionId = "" } = useParams();
    const { departments, addEmployee, setDepartments } = useEmployeesContext();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [depError, setDepError] = useState<string | null>(null);

    useEffect(() => {
        setIsLoading(true);
        setDepError(null);
        setDepartments([]);

        const cancelToken = axios.CancelToken.source();

        const fetchDepartments = async () => {
            try {
                const response = await DepartmentService.fetch(divisionId, {
                    cancelToken: cancelToken.token,
                });
                setDepartments(response.data);
            } catch (error) {
                console.log(error);
                const err = error as any;
                setDepError(err?.response?.data?.message ?? "Не удалось получить данные с сервера");
            } finally {
                setIsLoading(false);
            }
        };
        fetchDepartments();

        return () => cancelToken.cancel();
    }, [divisionId, setDepartments]);

    const handleSubmit = async (values: EmployeeFormState) => {
        setError(null);
        console.log(values);
        const { fullName, studentId, subdepartment } = values;

        const newEmployee: IEmployee = {
            fullName: fullName.trim(),
            studentId,
            subdepartmentName: subdepartment.value,
        };

        try {
            const response = await EmployeeService.post({ depId: divisionId, employee: newEmployee });
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
        <ModalLayout className="add-employee-modal" ref={modalRef}>
            <ModalHeader closeModal={closeModal}>Добавление</ModalHeader>
            <ModalContent>
                {depError && (
                    <Alert className="add-employee-modal__alert" type={ALERT.ERROR}>
                        {depError}
                    </Alert>
                )}
                {!depError && (
                    <>
                        {error && (
                            <Alert className="add-employee-modal__alert" type={ALERT.ERROR}>
                                {error}
                            </Alert>
                        )}
                        {!isLoading && <EmployeeForm departments={departments} onSubmit={handleSubmit} />}
                    </>
                )}
                {isLoading && <Loader className="add-employee-modal__loader" />}
            </ModalContent>
        </ModalLayout>
    );
};

export default AddEmployeeModal;
