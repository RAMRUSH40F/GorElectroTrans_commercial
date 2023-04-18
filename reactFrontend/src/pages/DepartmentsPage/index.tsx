import React from "react";
import { useParams } from "react-router-dom";
import SectionHeader from "../../components/SectionHeader";
import { getDivisionRoute } from "../../helpers/getDivisionRoute";
import Departments from "./Departments";
import NewDepartment from "./NewDepartment";

import "./styles.scss";

const DepartmentsPage: React.FC = () => {
    const { divisionId = "" } = useParams();
    const division = getDivisionRoute(divisionId);

    return (
        <div className="departments-page">
            <section className="departments-page__info">
                <div className="departments-page__wrapper">
                    <SectionHeader title="Отделы" subtitle={division?.name ?? "Подразделение"} />
                    <NewDepartment className="departments-page__button" />
                </div>
                <Departments />
            </section>
        </div>
    );
};

export default DepartmentsPage;
