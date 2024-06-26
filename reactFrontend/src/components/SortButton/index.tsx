import React from "react";

import cn from "classnames";

import styles from "./styles.module.scss";

export type SortOrder = "asc" | "desc" | "disabled";

interface Props {
    className?: string;
    order: SortOrder;
}

const SortButton: React.FC<Props> = ({ className, order }) => {
    return (
        <button className={cn(styles.sortBtn, className)}>
            <svg
                className={styles[order]}
                fill="#fff"
                viewBox="0 0 1024 850"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path d="M759.2 419.8L697.4 358 512 543.4 326.6 358l-61.8 61.8L512 667z" />
            </svg>
        </button>
    );
};

export default SortButton;
