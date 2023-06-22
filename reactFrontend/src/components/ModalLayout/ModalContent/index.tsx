import React from "react";

import styles from "./styles.module.scss";

type Props = {
    children: React.ReactNode;
};

const ModalContent: React.FC<Props> = ({ children }) => {
    return <div className={styles.content}>{children}</div>;
};

export default ModalContent;
