import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { NOTION } from "../../../constants/notion";
import { showNotion } from "../../../helpers/showNotion";
import useClickOutside from "../../../hooks/useClickOutside";
import useEscape from "../../../hooks/useEscape";
import { IMaterial } from "../../../models/Material";
import MaterialService from "../../../services/MaterialService";
import Confirm from "../../Comfirm";
import MaterialForm, { MaterialsFormState } from "../../forms/MaterialForm";
import ModalLayout from "../ModalLayout";
import ModalContent from "../ModalLayout/ModalContent";
import ModalHeader from "../ModalLayout/ModalHeader";
import ModalMessage from "../ModalLayout/ModalMessage";
import { useMaterialsContext } from "../../../context/materialsContext";

type Props = {
    closeModal: () => void;
    material: IMaterial;
};

const EditMaterialModal: React.FC<Props> = ({ closeModal, material }) => {
    const modalRef = React.useRef<HTMLDivElement | null>(null);
    useClickOutside(modalRef, closeModal);
    useEscape(closeModal);

    const { divisionId = "" } = useParams();

    const { deleteMaterial } = useMaterialsContext();
    const [error, setError] = useState<string | null>(null);
    const [isConfirming, setIsConfirming] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);

    const handleSubmit = async (values: MaterialsFormState) => {
        console.log(values);
    };

    const handleDelete = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        setIsConfirming(false);
        setIsDisabled(true);
        setError(null);

        try {
            const response = await MaterialService.delete({ depId: divisionId, fileName: material.fileName });
            console.log(response);
            deleteMaterial(material.fileName);
            showNotion(NOTION.SUCCESS, "Запись успешно удалена");
            closeModal();
        } catch (error) {
            console.log(error);
            const err = error as any;
            setError(err?.message ?? "Не удалось удалить запись");
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
                        title="Вы уверены, что хотите удалить запись?"
                        handleConfirm={handleDelete}
                        handleDecline={handleDecline}
                    />
                ) : (
                    <MaterialForm
                        onSubmit={handleSubmit}
                        material={material}
                        moveToConfrim={moveToConfirm}
                        isDisabled={isDisabled}
                        isEditing={true}
                    />
                )}
            </ModalContent>
        </ModalLayout>
    );
};

export default EditMaterialModal;
