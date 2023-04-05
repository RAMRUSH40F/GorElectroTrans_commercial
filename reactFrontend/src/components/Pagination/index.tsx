import React from "react";
import ReactPaginate, { ReactPaginateProps } from "react-paginate";
import cn from "classnames";

import "./styles.scss";

const Pagination: React.FC<ReactPaginateProps> = ({ className, ...rest }) => {
    return (
        <ReactPaginate
            marginPagesDisplayed={2}
            pageRangeDisplayed={3}
            className={cn("pagination", className)}
            breakLabel="..."
            nextLabel={null}
            previousLabel={null}
            pageLinkClassName="pagination__link"
            breakLinkClassName="pagination__link"
            activeLinkClassName="pagination__link--active"
            {...rest}
        />
    );
};

export default Pagination;
