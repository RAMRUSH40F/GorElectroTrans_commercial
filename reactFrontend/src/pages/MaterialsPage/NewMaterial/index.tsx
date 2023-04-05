import React from "react";
import ActionButton from "../../../components/buttons/ActionButton";
import AddMaterialModal from "../../../components/modals/AddMaterialModal";
import useLockedBody from "../../../hooks/useLockedBody";

import "./styles.scss";

const NewMaterial: React.FC = () => {
    const [isAdding, setIsAdding] = React.useState(false);

    useLockedBody(isAdding);

    const handleOpenEditing = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        setIsAdding(true);
    };

    return (
        <>
            {isAdding && <AddMaterialModal setIsActive={setIsAdding} />}
            <ActionButton className="new-material-btn" colorType="add" onClick={handleOpenEditing}>
                Добавить +
            </ActionButton>
        </>
    );
};

export default NewMaterial;
