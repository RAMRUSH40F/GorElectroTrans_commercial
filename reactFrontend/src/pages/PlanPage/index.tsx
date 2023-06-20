import React from "react";
import Search from "../../components/Search";
import SectionHeader from "../../components/SectionHeader";
import Plan from "./Plan";
import NewPlan from "./NewPlan";
import PlanReport from "./PlanReport";
import { useParams, useSearchParams } from "react-router-dom";
import { getDivisionRoute } from "../../helpers/getDivisionRoute";
import CheckAccess from "../../components/CheckAccess";
import { ROLES } from "../../constants/roles";
import { useGate, useUnit } from "effector-react";
import { $search, planGate, searchChanged } from "./model";
import { useDeboucedCallback } from "hooks/useDebouncedCallback";

import styles from "./styles.module.scss";

const PlanPage: React.FC = () => {
    const { divisionId = "" } = useParams();
    const division = getDivisionRoute(divisionId);
    const [searchParams] = useSearchParams();

    useGate(planGate, {
        depId: divisionId,
        search: searchParams.get("key") || "",
        page: searchParams.get("page") ? Number(searchParams.get("page")) : 1,
    });

    return (
        <div className={styles.page}>
            <section className={styles.section}>
                <SectionHeader
                    title="Рабочий план"
                    subtitle={division?.name ?? "Подразделение"}
                />
                <div className={styles.wrapper}>
                    <PlanSearch />
                    <div className={styles.actions}>
                        <CheckAccess allowedRoles={[ROLES.ADMIN]}>
                            <PlanReport />
                        </CheckAccess>
                        <NewPlan />
                    </div>
                </div>
                <Plan />
            </section>
        </div>
    );
};

export default PlanPage;

function PlanSearch() {
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
