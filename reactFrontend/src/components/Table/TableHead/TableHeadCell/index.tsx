import React, { ReactNode } from "react";

import cn from "classnames";

import SortButton, { SortOrder } from "components/SortButton";

import styles from "./styles.module.scss";

type Props = {
    children: ReactNode;
    className?: string;
    order?: SortOrder;
    onClick?: () => void;
};

const TableHeadCell: React.FC<Props> = ({
    children,
    className,
    order,
    onClick,
}) => {
    return (
        <th
            scope="col"
            className={cn(styles.headCell, order && styles.sort, className)}
            onClick={onClick}
        >
            {order ? (
                <div className={styles.wrapper}>
                    {children}
                    <SortButton order={order} />
                </div>
            ) : (
                <>{children}</>
            )}
        </th>
    );
};

export default TableHeadCell;
