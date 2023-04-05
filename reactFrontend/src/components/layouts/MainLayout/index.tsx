import React from "react";
import Header from "./Header";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Container from "../../Container";

import "./styles.scss";

const MainLayout: React.FC = () => {
    return (
        <div className="main-layout">
            <Header />
            <main className="main-layout__content">
                <Container>
                    <Outlet />
                </Container>
            </main>
            <Footer />
        </div>
    );
};

export default MainLayout;
