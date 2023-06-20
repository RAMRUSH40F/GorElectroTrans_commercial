import React from "react";
import { useParams } from "react-router-dom";
import SectionHeader from "components/SectionHeader";
import { getDivisionRoute } from "helpers/getDivisionRoute";
import Departments from "./Departments";
import NewDepartment from "./NewDepartment";
import { useGate } from "effector-react";
import { departmentsGate } from "./model";

import styles from "./styles.module.scss";

const DepartmentsPage: React.FC = () => {
    const { divisionId = "" } = useParams();
    const division = getDivisionRoute(divisionId);

    useGate(departmentsGate, divisionId);

    return (
        <div className={styles.page}>
            <section className={styles.section}>
                <div className={styles.wrapper}>
                    <SectionHeader
                        title="Отделы"
                        subtitle={division?.name ?? "Подразделение"}
                    />
                    <NewDepartment />
                </div>
                <Departments />
            </section>
        </div>
    );
};

export default DepartmentsPage;
