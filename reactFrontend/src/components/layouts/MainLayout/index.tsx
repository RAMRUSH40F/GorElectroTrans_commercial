import React from "react";

import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import Container from "../../Container";

import Footer from "./Footer";
import Header from "./Header";

import styles from "./styles.module.scss";

const MainLayout: React.FC = () => {
    return (
        <div className={styles.layout}>
            <ToastContainer />
            <Header />
            <main>
                <Container>
                    <Outlet />
                </Container>
            </main>
            <Footer />
        </div>
    );
};

export default MainLayout;
