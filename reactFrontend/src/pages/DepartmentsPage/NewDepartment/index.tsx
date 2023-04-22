import React from "react";
import ActionButton from "../../../components/buttons/ActionButton";
import AddDepartmentModal from "../../../components/modals/departments/AddDepartmentModal";
import useLockedBody from "../../../hooks/useLockedBody";
import cn from "classnames";

import "./styles.scss";

type Props = {
    className?: string;
};

const NewDepartment: React.FC<Props> = ({ className }) => {
    const [isAdding, setIsAdding] = React.useState(false);
    useLockedBody(isAdding);

    return (
        <>
            {isAdding && <AddDepartmentModal closeModal={() => setIsAdding(false)} />}
            <ActionButton
                className={cn("new-department-btn", className)}
                colorType="info"
                onClick={() => setIsAdding(true)}
            >
                Добавить +
            </ActionButton>
        </>
    );
};

export default NewDepartment;
