import React from "react";

import "./styles.scss";

const MissingPage: React.FC = () => {

    return (
        <div className="missing-page">
            <h1 className="missing-page__title">
                <p className="missing-page__subtitle">Страница не найдена</p>
                <p>404</p>
            </h1>
            {/* <p className="missing-page__text">
                Может вы хотите перейти{" "}
                <Link to="" className="missing-page__link">
                    на главную
                </Link>
                ?
            </p> */}
        </div>
    );
};

export default MissingPage;
