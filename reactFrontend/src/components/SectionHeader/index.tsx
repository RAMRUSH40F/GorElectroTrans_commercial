import React from "react";
import cn from "classnames";

import "./styles.scss";

type Props = {
    title: string;
    subtitle?: string;
    className?: string;
};

const SectionHeader: React.FC<Props> = ({ title, subtitle, className }) => {
    return (
        <header className={cn("page-heading", className)}>
            <h1 className="page-heading__title">{title}</h1>
            {subtitle && <p className="page-heading__subtitle">{subtitle}</p>}
        </header>
    );
};

export default SectionHeader;
