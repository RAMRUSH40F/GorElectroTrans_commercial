import React from "react";
import cn from "classnames";

import styles from "./styles.module.scss";

type Props = {
    children: React.ReactNode;
    onClick: (event: React.MouseEvent<HTMLTableRowElement>) => void;
    className?: string;
};

const TableBodyRow: React.FC<Props> = ({ children, onClick, className }) => {
    return (
        <tr onClick={onClick} className={cn(styles.bodyRow, className)}>
            {children}
        </tr>
    );
};

export default TableBodyRow;
