import React from "react";
import ActionButton from "../buttons/ActionButton";

import styles from "./styles.module.scss";

type Props = {
    title: string;
    handleConfirm: (event: React.MouseEvent<HTMLButtonElement>) => void;
    handleDecline: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

const Confirm: React.FC<Props> = ({ title, handleConfirm, handleDecline }) => {
    return (
        <div>
            <div className={styles.wrapper}>
                <h4 className={styles.title}>{title}</h4>
                <p className={styles.message}>
                    Отменить это действие будет невозможно.
                </p>
            </div>
            <div className={styles.controls}>
                <ActionButton
                    onClick={handleConfirm}
                    type="button"
                    colorType="warning"
                >
                    Подтвердить
                </ActionButton>
                <ActionButton
                    onClick={handleDecline}
                    type="button"
                    colorType="danger"
                >
                    Отмена
                </ActionButton>
            </div>
        </div>
    );
};

export default Confirm;
