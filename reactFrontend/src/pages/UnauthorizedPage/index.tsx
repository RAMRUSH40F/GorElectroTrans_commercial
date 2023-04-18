import React from "react";

import "./styles.scss";

const UnauthorizedPage: React.FC = () => {
    return (
        <div className="unauthorized-page">
            <h1 className="unauthorized-page__title">
                <p className="unauthorized-page__text">У вас нет прав для доступа к данной странице</p>
                <p>403</p>
            </h1>
        </div>
    );
};

export default UnauthorizedPage;
