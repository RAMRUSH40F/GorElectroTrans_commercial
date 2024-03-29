import React, { useState } from "react";
import { useParams } from "react-router-dom";
import useClickOutside from "../../../../hooks/useClickOutside";
import useEscape from "../../../../hooks/useEscape";
import { TDepartmentDto } from "../../../../models/Department";
import DepartmentService from "../../../../services/DepartmentService";
import DepartmentForm from "../../../forms/DepartmentForm";
import ModalLayout from "../../ModalLayout";
import ModalHeader from "../../ModalLayout/ModalHeader";
import { showNotion } from "../../../../helpers/showNotion";
import { NOTION } from "../../../../constants/notion";
import { useDepartmentsContext } from "../../../../context/departmentsContext";
import { ALERT } from "../../../../constants/alertTypes";
import ModalContent from "../../ModalLayout/ModalContent";
import Alert from "../../../Alert";
import { useUserContext } from "../../../../context/userContext";

import "./styles.scss";

type Props = {
    closeModal: () => void;
};

const AddDepartmentModal: React.FC<Props> = ({ closeModal }) => {
    const modalRef = React.useRef<HTMLDivElement | null>(null);
    useClickOutside(modalRef, closeModal);
    useEscape(closeModal);

    const { logout } = useUserContext();
    const { addDepartment } = useDepartmentsContext();
    const { divisionId = "" } = useParams();
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (values: TDepartmentDto) => {
        setError(null);
        try {
            const response = await DepartmentService.post({
                depId: divisionId,
                department: { name: values.name.trim() },
            });
            addDepartment(response.data);
            showNotion(NOTION.SUCCESS, "Отдел успешно добавлен");
            closeModal();
        } catch (error) {
            const err = error as any;
            if (err.response.status === 401) {
                logout();
            } else {
                setError(err?.response?.data?.message ?? "Не удалось добавить отдел");
            }
        }
    };

    return (
        <ModalLayout className="add-department-modal" ref={modalRef}>
            <ModalHeader closeModal={closeModal}>Добавление</ModalHeader>
            <ModalContent>
                {error && (
                    <Alert className="add-department-modal__alert" type={ALERT.ERROR}>
                        {error}
                    </Alert>
                )}
                <DepartmentForm clearError={() => setError(null)} onSubmit={handleSubmit} />
            </ModalContent>
        </ModalLayout>
    );
};

export default AddDepartmentModal;
