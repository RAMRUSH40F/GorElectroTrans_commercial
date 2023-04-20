import React from "react";
import Router from "./Router";
import { useUserContext } from "../context/userContext";

const App: React.FC = () => {
    const { isLoading } = useUserContext();
    return isLoading ? <p>Загрузка...</p> : <Router />;
};

export default App;
