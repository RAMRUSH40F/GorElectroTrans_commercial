import React from "react";
import { useParams } from "react-router-dom";
import Search from "../../components/Search";
import SectionHeader from "../../components/SectionHeader";
import { getDivisionName } from "../../helpers/getDivisionName";
import Departments from "./Departments";
import NewDepartment from "./NewDepartment";

import "./styles.scss";

const DepartmentsPage: React.FC = () => {
    const { divisionId = "" } = useParams();
    const divisionName = getDivisionName(divisionId);

    return (
        <div className="departments-page">
            <section className="departments-page__info">
                <SectionHeader title="Отделы" subtitle={divisionName ?? "Подразделение"} />
                <div className="departments-page__wrapper">
                    <Search />
                    <NewDepartment />
                </div>
                <Departments />
            </section>
        </div>
    );
};

export default DepartmentsPage;
