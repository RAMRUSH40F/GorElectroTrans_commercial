import React from "react";

import styles from "./styles.module.scss";

type Props = {
    children: React.ReactNode;
};

const Container: React.FC<Props> = ({ children }) => {
    return <div className={styles.container}>{children}</div>;
};

export default Container;
