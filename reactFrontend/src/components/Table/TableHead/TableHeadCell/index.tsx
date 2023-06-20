import React from "react";
import cn from "classnames";

import styles from "./styles.module.scss";

type Props = {
    children: React.ReactNode;
    className?: string;
};

const TableHeadCell: React.FC<Props> = ({ children, className }) => {
    return (
        <th scope="col" className={cn(styles.headCell, className)}>
            {children}
        </th>
    );
};

export default TableHeadCell;
