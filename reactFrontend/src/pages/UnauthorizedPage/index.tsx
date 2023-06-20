import React from "react";
import { Link } from "react-router-dom";
import { ROOT_ROUTE } from "components/Router/routesPathnames";

import styles from "./styles.module.scss";

const UnauthorizedPage: React.FC = () => {
    return (
        <div className={styles.page}>
            <h1 className={styles.title}>
                <p>У вас нет прав для доступа к данной странице</p>
                <p>403</p>
            </h1>
            <p className={styles.message}>
                Может вы хотите перейти {""}
                <Link to={ROOT_ROUTE.PATH}>на главную</Link>?
            </p>
        </div>
    );
};

export default UnauthorizedPage;
