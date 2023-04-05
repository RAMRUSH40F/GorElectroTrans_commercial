import React from "react";
import Search from "../../components/Search";
import SectionHeader from "../../components/SectionHeader";
import Departments from "./Departments";
import NewDepartment from "./NewDepartment";

import "./styles.scss";

const DepartmentsPage: React.FC = () => {
    return (
        <div className="departments-page">
            <section className="departments-page__info">
                <SectionHeader title="Отделы" subtitle="ОСП «Трамвайный парк №1»" />
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
