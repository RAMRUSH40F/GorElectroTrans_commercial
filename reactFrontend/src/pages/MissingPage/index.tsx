import React from "react";
import { Link } from "react-router-dom";
import { ROOT_ROUTE } from "../../constants/routesPathnames";

import styles from "./styles.module.scss";

const MissingPage: React.FC = () => {
    return (
        <div className={styles.page}>
            <h1 className={styles.title}>
                <p>Страница не найдена</p>
                <p>404</p>
            </h1>
            <p className={styles.message}>
                Может вы хотите перейти {""}
                <Link to={ROOT_ROUTE.PATH}>на главную</Link>?
            </p>
        </div>
    );
};

export default MissingPage;
