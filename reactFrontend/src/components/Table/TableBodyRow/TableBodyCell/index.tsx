import React from "react";

import cn from "classnames";

import styles from "./styles.module.scss";

type TableBodyCellProps = React.HTMLAttributes<HTMLTableCellElement>;

const TableBodyCell: React.FC<TableBodyCellProps> = ({
    className,
    ...props
}) => {
    return <td className={cn(styles.bodyCell, className)} {...props} />;
};

export default TableBodyCell;
