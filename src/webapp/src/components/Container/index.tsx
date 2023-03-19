import React from "react";

import "./styles.scss";

type Props = {
    children: React.ReactNode;
};

const Container: React.FC<Props> = ({ children }) => {
    return <div className="container">{children}</div>;
};

export default Container;
