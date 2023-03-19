import React from "react";

import "./styles.scss";

type Props = {
    children: React.ReactNode;
    onClick: (event: React.MouseEvent<HTMLTableRowElement>) => void;
};

const TableBodyRow: React.FC<Props> = ({ children, onClick }) => {
    return (
        <tr onClick={onClick} className="table-body-row">
            {children}
        </tr>
    );
};

export default TableBodyRow;
