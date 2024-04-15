import React from "react";

import styles from "./styles.module.scss";

type Props = {
    children: React.ReactNode;
};

const TableHead: React.FC<Props> = ({ children }) => {
    return (
        <thead>
            <tr className={styles.headRow}>{children}</tr>
        </thead>
    );
};

export default TableHead;
