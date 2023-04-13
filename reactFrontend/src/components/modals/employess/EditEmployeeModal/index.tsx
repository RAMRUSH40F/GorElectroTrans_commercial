import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { NOTION } from "../../../../constants/notion";
import { useEmployeesContext } from "../../../../context/employeesContext";
import { showNotion } from "../../../../helpers/showNotion";
import useClickOutside from "../../../../hooks/useClickOutside";
import useEscape from "../../../../hooks/useEscape";
import { IEmployee } from "../../../../models/Employee";
import Confirm from "../../../Comfirm";
import EmployeeForm, { EmployeeFormState } from "../../../forms/EmployeeForm";
import ModalLayout from "../../ModalLayout";
import ModalHeader from "../../ModalLayout/ModalHeader";
import EmployeeService from "../../../../services/EmployeeService";
import { ALERT } from "../../../../constants/alertTypes";
import ModalContent from "../../ModalLayout/ModalContent";

import "./styles.scss";
import Alert from "../../../Alert";
import DepartmentService from "../../../../services/DepartmentService";
import axios from "axios";
import Loader from "../../../Loader";

type Props = {
    closeModal: () => void;
    employee: IEmployee;
};

const EditEmployeeModal: React.FC<Props> = ({ closeModal, employee }) => {
    const modalRef = React.useRef<HTMLDivElement | null>(null);
    useClickOutside(modalRef, closeModal);
    useEscape(closeModal);

    const { divisionId = "" } = useParams();

    const { departments, deleteEmployee, updateEmployee, setDepartments } = useEmployeesContext();
    const [error, setError] = useState<string | null>(null);
    const [isConfirming, setIsConfirming] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
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
            fullName,
            studentId,
            subdepartmentName: subdepartment.value,
        };

        try {
            await EmployeeService.put({ depId: divisionId, employee: newEmployee });
            updateEmployee(newEmployee);
            showNotion(NOTION.SUCCESS, "Изменения успешно сохранены");
            closeModal();
        } catch (error) {
            console.log(error);
            const err = error as any;
            setError(err?.response?.data?.message ?? "Не удалось сохранить изменения");
        }
    };

    const handleDelete = async () => {
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

    return (
        <ModalLayout className="edit-employee-modal" ref={modalRef}>
            <ModalHeader closeModal={closeModal}>Редактирование</ModalHeader>
            <ModalContent>
                {isLoading && <Loader className="edit-employee-modal__loader" />}
                {depError ? (
                    <Alert className="edit-employee-modal__alert" type={ALERT.ERROR}>
                        {depError}
                    </Alert>
                ) : (
                    <>
                        {error && (
                            <Alert className="edit-employee-modal__alert" type={ALERT.ERROR}>
                                {error}
                            </Alert>
                        )}
                        {isConfirming ? (
                            <Confirm
                                title="Вы уверены, что хотите удалить работника?"
                                handleConfirm={handleDelete}
                                handleDecline={() => setIsConfirming(false)}
                            />
                        ) : (
                            <EmployeeForm
                                onSubmit={handleSubmit}
                                departments={departments}
                                employee={employee}
                                moveToConfrim={() => setIsConfirming(true)}
                                isDisabled={isDisabled}
                                isEditing={true}
                            />
                        )}
                    </>
                )}
            </ModalContent>
        </ModalLayout>
    );
};

export default EditEmployeeModal;
