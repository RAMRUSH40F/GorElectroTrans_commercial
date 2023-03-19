import React from "react";
import PaginationItem from "./PaginationItem";
import cn from "classnames";

import "./styles.scss";

type Props = {
    className?: string;
};

const Pagination: React.FC<Props> = ({ className }) => {
    return (
        <ul className={cn("pagination", className)}>
            <PaginationItem>1</PaginationItem>
            <PaginationItem>2</PaginationItem>
            <PaginationItem>3</PaginationItem>
            <PaginationItem>4</PaginationItem>
        </ul>
    );
};

export default Pagination;
