import React from "react";

import "./styles.scss";

type Props = {
    children: React.ReactNode;
};

const ModalFooter: React.FC<Props> = ({ children }) => {
    return <footer className="modal-footer">{children}</footer>;
};

export default ModalFooter;
