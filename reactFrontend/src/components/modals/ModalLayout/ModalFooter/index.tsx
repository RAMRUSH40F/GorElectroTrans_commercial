import React from "react";
import cn from "classnames";

import "./styles.scss";

type Props = {
    children: React.ReactNode;
    className?: string;
};

const ModalFooter: React.FC<Props> = ({ children, className }) => {
    return <footer className={cn("modal-footer", className)}>{children}</footer>;
};

export default ModalFooter;
