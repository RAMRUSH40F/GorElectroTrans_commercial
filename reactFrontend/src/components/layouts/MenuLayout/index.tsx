import React from "react";

import { Outlet } from "react-router-dom";

import Menu from "./Menu";

import styles from "./styles.module.scss";

const MenuLayout: React.FC = () => {
    return (
        <div className={styles.layout}>
            <Menu className={styles.menu} />
            <Outlet />
        </div>
    );
};

export default MenuLayout;
