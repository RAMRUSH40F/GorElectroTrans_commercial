import React from "react";
import Header from "./Header";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Container from "../../Container";
import { ToastContainer } from "react-toastify";

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
