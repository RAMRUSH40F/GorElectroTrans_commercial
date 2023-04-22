import React from "react";
import ActionButton from "../../../components/buttons/ActionButton";
import AddEmployeeModal from "../../../components/modals/employess/AddEmployeeModal";
import useLockedBody from "../../../hooks/useLockedBody";
import cn from "classnames";

import "./styles.scss";

type Props = {
    className?: string;
};

const NewEmployee: React.FC<Props> = ({ className }) => {
    const [isAdding, setIsAdding] = React.useState(false);
    useLockedBody(isAdding);

    return (
        <>
            {isAdding && <AddEmployeeModal closeModal={() => setIsAdding(false)} />}
            <ActionButton className={cn("new-employee-btn", className)} colorType="info" onClick={() => setIsAdding(true)}>
                Добавить +
            </ActionButton>
        </>
    );
};

export default NewEmployee;
