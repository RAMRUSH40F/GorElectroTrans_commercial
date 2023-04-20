import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { NOTION } from "../../../../constants/notion";
import { useDepartmentsContext } from "../../../../context/departmentsContext";
import { showNotion } from "../../../../helpers/showNotion";
import useClickOutside from "../../../../hooks/useClickOutside";
import useEscape from "../../../../hooks/useEscape";
import { IDepartment, TNewDepartment } from "../../../../models/Department";
import DepartmentService from "../../../../services/DepartmentService";
import Confirm from "../../../Comfirm";
import DepartmentForm from "../../../forms/DepartmentForm";
import ModalLayout from "../../ModalLayout";
import ModalHeader from "../../ModalLayout/ModalHeader";
import { ALERT } from "../../../../constants/alertTypes";
import Alert from "../../../Alert";
import ModalContent from "../../ModalLayout/ModalContent";

import "./styles.scss";

type Props = {
    closeModal: () => void;
    department: IDepartment;
};

const EditDepartmentModal: React.FC<Props> = ({ closeModal, department }) => {
    const modalRef = React.useRef<HTMLDivElement | null>(null);
    useClickOutside(modalRef, closeModal);
    useEscape(closeModal);

    const { divisionId = "" } = useParams();

    const { deleteDepartment, updateDepartment } = useDepartmentsContext();
    const [error, setError] = useState<string | null>(null);
    const [isConfirming, setIsConfirming] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);

    const handleSubmit = async (values: TNewDepartment) => {
        setError(null);
        console.log(values);

        const newDepartment: IDepartment = {
            id: department.id,
            name: values.name.trim(),
        };

        try {
            await DepartmentService.put({ depId: divisionId, department: newDepartment });
            updateDepartment(newDepartment);
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
            await DepartmentService.delete({ depId: divisionId, departmentId: department.id });
            deleteDepartment(department.id);
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
        <ModalLayout className="edit-department-modal" ref={modalRef}>
            <ModalHeader closeModal={closeModal}>Редактирование</ModalHeader>
            <ModalContent>
                {error && (
                    <Alert className="edit-department-modal__alert" type={ALERT.ERROR}>
                        {error}
                    </Alert>
                )}
                {isConfirming ? (
                    <Confirm
                        title="Вы уверены, что хотите удалить отдел?"
                        handleConfirm={handleDelete}
                        handleDecline={() => setIsConfirming(false)}
                    />
                ) : (
                    <DepartmentForm
                        onSubmit={handleSubmit}
                        department={department}
                        moveToConfrim={() => setIsConfirming(true)}
                        isDisabled={isDisabled}
                    />
                )}
            </ModalContent>
        </ModalLayout>
    );
};

export default EditDepartmentModal;
