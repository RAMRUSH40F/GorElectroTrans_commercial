import React from "react";
import cn from "classnames";

import "./styles.scss";

type Props = {
    children: React.ReactNode;
    onClick: (event: React.MouseEvent<HTMLTableRowElement>) => void;
    className?: string;
};

const TableBodyRow: React.FC<Props> = ({ children, onClick, className }) => {
    return (
        <tr onClick={onClick} className={cn("table-body-row", className)}>
            {children}
        </tr>
    );
};

export default TableBodyRow;
