import React, { useState } from "react";
import useClickOutside from "../../../../hooks/useClickOutside";
import useEscape from "../../../../hooks/useEscape";
import { IPlan } from "../../../../models/Plan";
import ModalLayout from "../../ModalLayout";
import ModalHeader from "../../ModalLayout/ModalHeader";
import Materials from "../../../../pages/PlanPage/Materials";
import PlanEditing from "../../../../pages/PlanPage/PlanEditing";
import { ALERT } from "../../../../constants/alertTypes";

import "./styles.scss";
import Alert from "../../../Alert";
import ModalContent from "../../ModalLayout/ModalContent";

type Props = {
    closeEditing: () => void;
    plan: IPlan;
};

const EditPlanModal: React.FC<Props> = ({ closeEditing, plan }) => {
    const modalRef = React.useRef<HTMLDivElement | null>(null);
    useClickOutside(modalRef, closeEditing, { capture: false });
    useEscape(closeEditing);

    const [error, setError] = useState<string | null>(null);
    const [isEditingMaterials, setIsEditingMaterials] = useState(false);

    const handleMoveToMaterials = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        setIsEditingMaterials((prev) => !prev);
    };

    return (
        <ModalLayout className="edit-plan-modal" ref={modalRef}>
            <ModalHeader closeModal={closeEditing}>Редактирование</ModalHeader>
            <ModalContent>
                {error && (
                    <Alert className="edit-plan-modal__alert" type={ALERT.ERROR}>
                        {error}
                    </Alert>
                )}
                {isEditingMaterials ? (
                    <Materials
                        fileNames={plan.lessonContent}
                        lessonId={plan.id}
                        closeMaterialsEditing={handleMoveToMaterials}
                        setError={setError}
                    />
                ) : (
                    <PlanEditing
                        closeEditing={closeEditing}
                        plan={plan}
                        openMaterialsEditing={handleMoveToMaterials}
                        setError={setError}
                    />
                )}
            </ModalContent>
        </ModalLayout>
    );
};

export default EditPlanModal;
