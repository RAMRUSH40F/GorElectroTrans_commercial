import React from "react";
import { useLocation } from "react-router-dom";
import logoSrc from "assets/img/logo.svg";
import { LOGIN_ROUTE } from "components/Router/routesPathnames";
import Container from "components/Container";
import ActionButton from "components/ActionButton";
import { logoutFx } from "shared/auth";

import styles from "./styles.module.scss";

const Header: React.FC = () => {
    return (
        <header className={styles.header}>
            <Container>
                <div className={styles.wrapper}>
                    <img src={logoSrc} alt="Logo" />
                    <LogoutButton />
                </div>
            </Container>
        </header>
    );
};

export default Header;

function LogoutButton() {
    const location = useLocation();
    return (
        <>
            {location.pathname !== LOGIN_ROUTE.PATH && (
                <ActionButton
                    className={styles.loginBtn}
                    onClick={() => logoutFx()}
                    colorType="info"
                >
                    Выйти
                </ActionButton>
            )}
        </>
    );
}
