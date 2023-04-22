import React from "react";
import { Link } from "react-router-dom";
import { ROOT_ROUTE } from "../../constants/routesPathnames";

import "./styles.scss";

const MissingPage: React.FC = () => {
    return (
        <div className="missing-page">
            <h1 className="missing-page__title">
                <p className="missing-page__subtitle">Страница не найдена</p>
                <p className="missing-page__subtitle">404</p>
            </h1>
            <p className="missing-page__text">
                Может вы хотите перейти {""}
                <Link to={ROOT_ROUTE.PATH} className="missing-page__link">
                    на главную
                </Link>
                ?
            </p>
        </div>
    );
};

export default MissingPage;
