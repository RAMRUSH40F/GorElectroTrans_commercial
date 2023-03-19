import React from "react";

import "./styles.scss";

type Props = {
    children: React.ReactNode;
};

const PaginationItem: React.FC<Props> = ({ children }) => {
    return (
        <li className="pagination-item">
            <button className="pagination-item__button">{children}</button>
        </li>
    );
};

export default PaginationItem;
