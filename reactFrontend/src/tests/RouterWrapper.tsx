import React from "react";
import { MemoryRouter } from "react-router";

export interface RouterWrapperProps {
    children: React.ReactNode;
    initialPath?: string;
}

const RouterWrapper: React.FC<RouterWrapperProps> = ({
    children,
    initialPath = "/",
}) => {
    return (
        <MemoryRouter initialEntries={[initialPath]}>{children}</MemoryRouter>
    );
};

export default RouterWrapper;
