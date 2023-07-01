import React from "react";
import { useGate, useUnit } from "effector-react";
import { useParams, useSearchParams } from "react-router-dom";
import SectionHeader from "../../components/SectionHeader";
import Employees from "./Employees";
import { getDivisionRoute } from "../../helpers/getDivisionRoute";
import NewEmployee from "./NewEmployee";
import { useDeboucedCallback } from "hooks/useDebouncedCallback";
import Search from "components/Search";
import { $search, employeesGate, searchChanged } from "./model/employeesModel";

import styles from "./styles.module.scss";

const EmployeesPage: React.FC = () => {
    const { divisionId = "" } = useParams();
    const division = getDivisionRoute(divisionId);
    const [searchParams] = useSearchParams();

    useGate(employeesGate, {
        depId: divisionId,
        search: searchParams.get("key") || "",
        page: searchParams.get("page") ? Number(searchParams.get("page")) : 1,
    });

    return (
        <div className={styles.page}>
            <section className={styles.section}>
                <SectionHeader
                    title="Работники"
                    subtitle={division?.name ?? "Подразделение"}
                />
                <div className={styles.wrapper}>
                    <EmployeeSearch />
                    <NewEmployee />
                </div>
                <Employees />
            </section>
        </div>
    );
};

export default EmployeesPage;

function EmployeeSearch() {
    const search = useUnit($search);
    const [searchParams, setSearchParams] = useSearchParams();

    const debouncedSearch = useDeboucedCallback((value: string) => {
        if (value) {
            searchParams.set("page", String(1));
            searchParams.set("key", value);
        } else {
            searchParams.delete("key");
        }
        setSearchParams(searchParams);
    }, 250);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        debouncedSearch(event.target.value);
        searchChanged(event.target.value);
    };

    return (
        <Search
            className={styles.search}
            value={search}
            handleChange={handleChange}
        />
    );
}
