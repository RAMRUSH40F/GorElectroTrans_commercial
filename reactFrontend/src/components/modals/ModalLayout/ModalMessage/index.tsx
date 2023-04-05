import React from "react";
import { ALERT } from "../../../../constants/alertTypes";
import Alert from "../../../Alert";

import "./styles.scss";

type Props = {
    children: React.ReactNode;
};

const ModalMessage: React.FC<Props> = ({ children }) => {
    return (
        <div className="modal-message">
            <Alert type={ALERT.ERROR}>{children}</Alert>
        </div>
    );
};

export default ModalMessage;
