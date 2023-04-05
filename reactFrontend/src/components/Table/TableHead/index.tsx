import React from "react";

import "./styles.scss";

type Props = {
    children: React.ReactNode;
};

const TableHead: React.FC<Props> = ({ children }) => {
    return (
        <thead className="table-head">
            <tr className="table-head__row">{children}</tr>
        </thead>
    );
};

export default TableHead;
