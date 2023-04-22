import React from "react";
import { Link } from "react-router-dom";
import { ROOT_ROUTE } from "../../constants/routesPathnames";

import "./styles.scss";

const UnauthorizedPage: React.FC = () => {
    return (
        <div className="unauthorized-page">
            <h1 className="unauthorized-page__title">
                <p className="unauthorized-page__subtitle">У вас нет прав для доступа к данной странице</p>
                <p className="unauthorized-page__subtitle">403</p>
            </h1>
            <p className="unauthorized-page__text">
                Может вы хотите перейти {""}
                <Link to={ROOT_ROUTE.PATH} className="unauthorized-page__link">
                    на главную
                </Link>
                ?
            </p>
        </div>
    );
};

export default UnauthorizedPage;
