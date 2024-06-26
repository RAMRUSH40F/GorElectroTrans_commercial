import React from "react";

import { useGate, useUnit } from "effector-react";
import { useParams, useSearchParams } from "react-router-dom";

import Search from "components/Search";
import SectionHeader from "components/SectionHeader";

import { useDeboucedCallback } from "hooks/useDebouncedCallback";

import { getDivisionRoute } from "helpers/getDivisionRoute";

import Attendance from "./Attendance";
import AttendanceReport from "./AttendanceReport";
import NewAttendance from "./NewAttendance";
import { $search, attendanceGate, searchChanged } from "./model";

import styles from "./styles.module.scss";

const AttendancePage: React.FC = () => {
    const { divisionId = "" } = useParams();
    const division = getDivisionRoute(divisionId);
    const [searchParams] = useSearchParams();

    useGate(attendanceGate, {
        depId: divisionId,
        search: searchParams.get("key") || "",
        page: searchParams.get("page") ? Number(searchParams.get("page")) : 1,
    });

    return (
        <div className={styles.page}>
            <section className={styles.section}>
                <SectionHeader
                    title="Журнал посещаемости"
                    subtitle={division?.name ?? "Подразделение"}
                />
                <div className={styles.wrapper}>
                    <AttendanceSearch />
                    <div className={styles.actions}>
                        <AttendanceReport />
                        <NewAttendance />
                    </div>
                </div>
                <Attendance />
            </section>
        </div>
    );
};

export default AttendancePage;

function AttendanceSearch() {
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
