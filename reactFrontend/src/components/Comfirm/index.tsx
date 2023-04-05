import React from "react";
import ActionButton from "../buttons/ActionButton";

import "./styles.scss";

type Props = {
    title: string;
    handleConfirm: (event: React.MouseEvent<HTMLButtonElement>) => void;
    handleDecline: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

const Confirm: React.FC<Props> = ({ title, handleConfirm, handleDecline }) => {
    return (
        <div className="confirm">
            <h4 className="confirm__title">{title}</h4>
            <p className="confirm__message">Отменить это действие будет невозможно.</p>
            <div className="confirm__actions">
                <ActionButton onClick={handleConfirm} type="button" colorType="warning">
                    Подтвердить
                </ActionButton>
                <ActionButton onClick={handleDecline} type="button" colorType="danger">
                    Отмена
                </ActionButton>
            </div>
        </div>
    );
};

export default Confirm;
