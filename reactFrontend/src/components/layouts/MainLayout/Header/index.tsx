import React from "react";
import { useLocation } from "react-router-dom";
import logoSrc from "../../../../assets/img/logo.svg";
import { LOGIN_ROUTE } from "../../../../constants/routesPathnames";
import Container from "../../../Container";
import ActionButton from "../../../buttons/ActionButton";
import UserService from "../../../../services/UserService";
import { useUserContext } from "../../../../context/userContext";
import { showNotion } from "../../../../helpers/showNotion";
import { NOTION } from "../../../../constants/notion";

import "./styles.scss";

const Header: React.FC = () => {
    const location = useLocation();
    const { logout } = useUserContext();

    const handleLogout = async () => {
        try {
            await UserService.logout();
            localStorage.removeItem("accessToken");
            logout();
        } catch (error) {
            showNotion(NOTION.ERROR, "Произошла техническая ошибка");
        }
    };

    return (
        <header className="header">
            <Container>
                <div className="header__wrapper">
                    <img className="header__logo" src={logoSrc} alt="Logo" />
                    {location.pathname !== LOGIN_ROUTE.PATH && (
                        <ActionButton className="header__button" onClick={handleLogout} colorType="info">
                            Выйти
                        </ActionButton>
                    )}
                </div>
            </Container>
        </header>
    );
};

export default Header;
