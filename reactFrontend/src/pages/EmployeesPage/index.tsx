import React from "react";
import { useParams } from "react-router-dom";
import SectionHeader from "../../components/SectionHeader";
import Employees from "./Employees";
import { getDivisionRoute } from "../../helpers/getDivisionRoute";
import NewEmployee from "./NewEmployee";

import "./styles.scss";

const EmployeesPage: React.FC = () => {
    const { divisionId = "" } = useParams();
    const division = getDivisionRoute(divisionId);

    return (
        <div className="employees-page">
            <section className="employees-page__info">
                <div className="employees-page__wrapper">
                    <SectionHeader title="Работники" subtitle={division?.name ?? "Подразделение"} />
                    <NewEmployee className="employees-page__button" />
                </div>
                <Employees />
            </section>
        </div>
    );
};

export default EmployeesPage;
