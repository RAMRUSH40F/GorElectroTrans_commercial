import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import logoSrc from "../../../../assets/img/logo.svg";
import { LOGIN_ROUTE } from "../../../../constants/routesPathnames";
import Container from "../../../Container";
import ActionButton from "../../../buttons/ActionButton";

import "./styles.scss";

const Header: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        navigate(LOGIN_ROUTE.PATH);
    };

    return (
        <header className="header">
            <Container>
                <div className="header__wrapper">
                    <img className="header__logo" src={logoSrc} alt="Logo" />
                    {location.pathname !== LOGIN_ROUTE.PATH && (
                        <ActionButton onClick={handleLogout} colorType="add">
                            Выйти
                        </ActionButton>
                    )}
                </div>
            </Container>
        </header>
    );
};

export default Header;
