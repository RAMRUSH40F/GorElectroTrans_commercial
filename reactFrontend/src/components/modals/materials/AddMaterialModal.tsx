import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { NOTION } from "../../../constants/notion";
import { showNotion } from "../../../helpers/showNotion";
import useClickOutside from "../../../hooks/useClickOutside";
import useEscape from "../../../hooks/useEscape";
import MaterialService from "../../../services/MaterialService";
import MaterialForm, { MaterialsFormState } from "../../forms/MaterialForm";
import ModalLayout from "../ModalLayout";
import ModalContent from "../ModalLayout/ModalContent";
import ModalHeader from "../ModalLayout/ModalHeader";
import ModalMessage from "../ModalLayout/ModalMessage";
import { IMaterial } from "../../../models/Material";
import { useMaterialsContext } from "../../../context/materialsContext";

type Props = {
    closeModal: () => void;
};

const AddMaterialModal: React.FC<Props> = ({ closeModal }) => {
    const modalRef = React.useRef<HTMLDivElement | null>(null);
    useClickOutside(modalRef, closeModal);
    useEscape(closeModal);

    const { divisionId = "" } = useParams();

    const { addMaterial } = useMaterialsContext();
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (values: MaterialsFormState) => {
        console.log(values);
        const { file, lessonId } = values;

        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await MaterialService.post(
                { depId: divisionId, data: formData },
                {
                    params: {
                        lessonId,
                    },
                }
            );
            console.log(response);
            const newMaterial: IMaterial = {
                date: response.data.date,
                fileName: response.data.fileName,
                lessonId: response.data.lessonId,
                topic: response.data.topic,
            };
            addMaterial(newMaterial);
            showNotion(NOTION.SUCCESS, "Конспект успешно добавлен");
            closeModal();
        } catch (error) {
            console.log(error);
            const err = error as any;
            setError(err?.response?.data?.message ?? "Не удалось добавить коспект");
        }
    };

    return (
        <ModalLayout ref={modalRef}>
            <ModalHeader closeModal={closeModal}>Добавление записи</ModalHeader>
            {error && <ModalMessage>{error}</ModalMessage>}
            <ModalContent>
                <MaterialForm onSubmit={handleSubmit} />
            </ModalContent>
        </ModalLayout>
    );
};

export default AddMaterialModal;
