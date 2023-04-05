import React from "react";

import "./styles.scss";

type Props = {
    children: React.ReactNode;
};

const ModalContent: React.FC<Props> = ({ children }) => {
    return <div className="modal-content">{children}</div>;
};

export default ModalContent;
