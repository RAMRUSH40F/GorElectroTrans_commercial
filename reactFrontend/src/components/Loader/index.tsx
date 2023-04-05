import React from "react";
import cn from "classnames";

import "./styles.scss";

type Props = {
    className?: string;
};

const Loader: React.FC<Props> = ({ className }) => {
    return (
        <div className={cn("loader", className)}>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
    );
};

export default Loader;
