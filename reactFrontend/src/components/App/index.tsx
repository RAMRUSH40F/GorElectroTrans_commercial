import React from "react";
import Router from "../Router";
import { useUserContext } from "../../context/userContext";
import Loader from "../Loader";
import Alert from "../Alert";
import { ALERT } from "../../constants/alertTypes";

import styles from "./styles.module.scss";

const App: React.FC = () => {
    const { isLoading, error } = useUserContext();
    return (
        <>
            {isLoading || error ? (
                <div className={styles.page}>
                    {isLoading && <Loader />}
                    {error && (
                        <Alert className={styles.alert} type={ALERT.ERROR}>
                            {error}
                        </Alert>
                    )}
                </div>
            ) : (
                <Router />
            )}
        </>
    );
};

export default App;
