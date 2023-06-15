import React from "react";
import Router from "../Router";
import Loader from "../Loader";
import Alert from "../Alert";
import { ALERT } from "../../constants/alertTypes";
import { useGate, useUnit } from "effector-react";
import { $error, $isLoading, AuthGate } from "../../shared/auth";

import styles from "./styles.module.scss";

const App: React.FC = () => {
    const [isLoading, error] = useUnit([$isLoading, $error]);
    useGate(AuthGate);

    return (
        <>
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
