import React from "react";
import { Outlet } from "react-router-dom";
import Menu from "./Menu";

import "./styles.scss";

const MenuLayout: React.FC = () => {
    return (
        <div className="menu-layout">
            <Menu className="menu-layout__menu" />
            <Outlet />
        </div>
    );
};

export default MenuLayout;
