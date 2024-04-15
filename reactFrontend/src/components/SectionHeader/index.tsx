import React from "react";

import cn from "classnames";

import styles from "./styles.module.scss";

type Props = {
    title: string;
    subtitle?: string;
    className?: string;
};

const SectionHeader: React.FC<Props> = ({ title, subtitle, className }) => {
    return (
        <header className={cn(styles.header, className)}>
            <h1>{title}</h1>
            {subtitle && <p>{subtitle}</p>}
        </header>
    );
};

export default SectionHeader;
