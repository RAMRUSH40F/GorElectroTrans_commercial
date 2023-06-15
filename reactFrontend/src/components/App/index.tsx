import React from "react";
import Router from "../Router";
import Loader from "../Loader";
import Alert from "../Alert";
import { ALERT } from "../../constants/alertTypes";
import { useUnit } from "effector-react";
import { $error, $isLoading, AuthGate } from "../../models/auth";

import styles from "./styles.module.scss";

const App: React.FC = () => {
    const [isLoading, error] = useUnit([$isLoading, $error]);

    return (
        <>
            <AuthGate />
            {isLoading || error ? (
                <div className={styles.page}>
                    {isLoading && <Loader />}
                    <ErrorAlert />
                </div>
            ) : (
                <Router />
            )}
        </>
    );
};

export default App;

function ErrorAlert() {
    const error = useUnit($error);
    if (error) {
        return (
            <Alert className={styles.alert} type={ALERT.ERROR}>
                {error}
            </Alert>
        );
    }
    return null;
}
