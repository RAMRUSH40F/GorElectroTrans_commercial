import React, { HTMLAttributes } from "react";

import cn from "classnames";

import styles from "./list.module.scss";

export const List = ({
    className,
    ...props
}: HTMLAttributes<HTMLUListElement>) => {
    return <ul className={cn(styles.list, className)} {...props} />;
};
