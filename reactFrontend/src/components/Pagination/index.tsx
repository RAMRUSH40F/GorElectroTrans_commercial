import React from "react";

import cn from "classnames";
import ReactPaginate, { ReactPaginateProps } from "react-paginate";

import styles from "./styles.module.scss";

const Pagination: React.FC<ReactPaginateProps> = ({ className, ...rest }) => {
    return (
        <ReactPaginate
            marginPagesDisplayed={1}
            pageRangeDisplayed={2}
            className={cn(styles.pagination, className)}
            breakLabel="..."
            nextLabel={null}
            previousLabel={null}
            pageLinkClassName={styles.link}
            breakLinkClassName={styles.link}
            activeLinkClassName={styles.active}
            {...rest}
        />
    );
};

export default Pagination;
