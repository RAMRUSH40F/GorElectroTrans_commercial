import React from "react";
import useClickOutside from "../../hooks/useClickOutside";
import useEscape from "../../hooks/useEscape";
import ActionButton from "../buttons/ActionButton";
import DepartmentForm from "../forms/DepartmentForm";
import ModalLayout from "./ModalLayout";
import ModalContent from "./ModalLayout/ModalContent";
import ModalFooter from "./ModalLayout/ModalFooter";
import ModalHeader from "./ModalLayout/ModalHeader";

type Props = {
    setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
};

const AddDepartmentModal: React.FC<Props> = ({ setIsActive }) => {
    const modalRef = React.useRef<HTMLDivElement | null>(null);

    useClickOutside(modalRef, () => setIsActive(false));
    useEscape(() => setIsActive(false));

    return (
        <ModalLayout ref={modalRef}>
            <ModalHeader closeModal={() => setIsActive(false)}>Добавление студента</ModalHeader>
            <ModalContent>
                <DepartmentForm />
            </ModalContent>
            <ModalFooter>
                <ActionButton colorType="submit">Добавить</ActionButton>
            </ModalFooter>
        </ModalLayout>
    );
};

export default AddDepartmentModal;
