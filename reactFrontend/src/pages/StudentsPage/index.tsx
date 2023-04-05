import React from "react";
import Search from "../../components/Search";
import SectionHeader from "../../components/SectionHeader";
import NewStudent from "./NewStudent";
import Students from "./Students";

import "./styles.scss";

const StudentsPage: React.FC = () => {
    return (
        <div className="students-page">
            <section className="students-page__info">
                <SectionHeader title="Студенты" subtitle="ОСП «Трамвайный парк №1»" />
                <div className="students-page__wrapper">
                    <Search />
                    <NewStudent />
                </div>
                <Students />
            </section>
        </div>
    );
};

export default StudentsPage;
