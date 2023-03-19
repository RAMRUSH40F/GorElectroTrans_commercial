import React from "react";

import "./styles.scss";

type Props = {
    children: React.ReactNode;
    onClick?: (event: React.MouseEvent) => void;
};

const TableBodyCell: React.FC<Props> = ({ children, onClick }) => {
    return <td className="table-body-cell" onClick={onClick}>{children}</td>;
};

export default TableBodyCell;
