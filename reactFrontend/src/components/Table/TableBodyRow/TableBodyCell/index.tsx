import React from "react";
import cn from "classnames";

import "./styles.scss";

type Props = {
    children: React.ReactNode;
    onClick?: (event: React.MouseEvent) => void;
    className?: string;
};

const TableBodyCell: React.FC<Props> = ({ children, onClick, className }) => {
    return (
        <td className={cn("table-body-cell", className)} onClick={onClick}>
            {children}
        </td>
    );
};

export default TableBodyCell;
