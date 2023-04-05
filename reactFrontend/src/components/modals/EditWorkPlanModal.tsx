import React from "react";
import useClickOutside from "../../hooks/useClickOutside";
import useEscape from "../../hooks/useEscape";
import ActionButton from "../buttons/ActionButton";
import WorkPlanForm from "../forms/WorkPlanForm";
import ModalLayout from "./ModalLayout";
import ModalContent from "./ModalLayout/ModalContent";
import ModalFooter from "./ModalLayout/ModalFooter";
import ModalHeader from "./ModalLayout/ModalHeader";

type Props = {
    setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
};

const EditWorkPlanModal: React.FC<Props> = ({ setIsActive }) => {
    const modalRef = React.useRef<HTMLDivElement | null>(null);

    useClickOutside(modalRef, () => setIsActive(false));
    useEscape(() => setIsActive(false));

    return (
        <ModalLayout ref={modalRef}>
            <ModalHeader closeModal={() => setIsActive(false)}>Редактирование</ModalHeader>
            <ModalContent>
                <WorkPlanForm />
            </ModalContent>
            <ModalFooter>
                <ActionButton colorType="submit">Сохранить</ActionButton>
                <ActionButton colorType="delete">Удалить</ActionButton>
            </ModalFooter>
        </ModalLayout>
    );
};

export default EditWorkPlanModal;
