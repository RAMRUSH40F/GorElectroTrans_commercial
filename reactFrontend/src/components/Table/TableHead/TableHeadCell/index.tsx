import React from "react";

import "./styles.scss";

type Props = {
    children: React.ReactNode;
};

const TableHeadCell: React.FC<Props> = ({ children }) => {
    return (
        <th scope="col" className="table-head-cell">
            {children}
        </th>
    );
};

export default TableHeadCell;
