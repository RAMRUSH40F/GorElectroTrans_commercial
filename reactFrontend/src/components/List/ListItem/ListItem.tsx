import { FC, HTMLAttributes } from "react";

import cn from "classnames";

import styles from "./listItem.module.scss";

interface ListItemProps extends HTMLAttributes<HTMLLIElement> {
    selected?: boolean;
}

export const ListItem: FC<ListItemProps> = ({
    className,
    selected,
    ...props
}) => {
    return (
        <li
            className={cn(
                styles.listItem,
                selected && styles.selected,
                className,
            )}
            {...props}
        />
    );
};
