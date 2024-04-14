import React from "react";

import cn from "classnames";

import styles from "./styles.module.scss";

type Props = {
    children: React.ReactNode;
    className?: string;
};

const Table: React.FC<Props> = ({ children, className }) => {
    return <table className={cn(styles.table, className)}>{children}</table>;
};

export default Table;
