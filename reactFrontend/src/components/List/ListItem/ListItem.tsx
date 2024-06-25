import { FC, HTMLAttributes } from "react";

import cn from "classnames";

import styles from "./listItem.module.scss";

interface ListItemProps extends HTMLAttributes<HTMLLIElement> {
    selected?: boolean;
    disabled?: boolean;
}

export const ListItem: FC<ListItemProps> = ({
    className,
    selected,
    disabled,
    ...props
}) => {
    console.log(disabled);
    return (
        <li
            className={cn(
                styles.listItem,
                selected && styles.selected,
                disabled && styles.disabled,
                className,
            )}
            {...props}
        />
    );
};
