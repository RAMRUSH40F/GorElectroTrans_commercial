import React from "react";
import { useLocation } from "react-router-dom";
import logoSrc from "../../../../assets/img/logo.svg";
import { LOGIN_ROUTE } from "../../../../constants/routesPathnames";
import Container from "../../../Container";
import ActionButton from "../../../buttons/ActionButton";
import { logoutFx } from "../../../../models/auth";

import "./styles.scss";

const Header: React.FC = () => {
    return (
        <header className="header">
            <Container>
                <div className="header__wrapper">
                    <img className="header__logo" src={logoSrc} alt="Logo" />
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
                <ActionButton className="header__button" onClick={() => logoutFx()} colorType="info">
                    Выйти
                </ActionButton>
            )}
        </>
    );
}
