import React from "react";
import { MemoryRouter } from "react-router";

interface Props {
    children: React.ReactNode;
    initialPath?: string;
}

const RenderRouterWrapper: React.FC<Props> = ({ children, initialPath = "/" }) => {
    return (
        <MemoryRouter initialEntries={[initialPath]}>{children}</MemoryRouter>
    );
};

export default RenderRouterWrapper;
