import React from "react";
import cn from "classnames";

import styles from "./styles.module.scss";

type Props = {
    className?: string;
};

const Loader: React.FC<Props> = ({ className }) => {
    return (
        <div className={cn(styles.loader, className)}>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <span className="visually-hidden">Загрузка</span>
        </div>
    );
};

export default Loader;
