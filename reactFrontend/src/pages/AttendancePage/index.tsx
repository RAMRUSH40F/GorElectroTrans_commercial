import React from "react";
import { useParams, useSearchParams } from "react-router-dom";
import Search from "../../components/Search";
import SectionHeader from "../../components/SectionHeader";
import { getDivisionRoute } from "../../helpers/getDivisionRoute";
import Attendance from "./Attendance";
import { useGate, useUnit } from "effector-react";
import {
    $isAddingModalActive,
    $search,
    attendanceGate,
    addingModalClosed,
    addingModalOpened,
    searchChanged,
} from "../../models/attendance";
import { useDeboucedCallback } from "../../hooks/useDebouncedCallback";
import ActionButton from "../../components/buttons/ActionButton";
import useLockedBody from "../../hooks/useLockedBody";
import AddAttendanceModal from "../../components/modals/attendance/AddAttendanceModal";

import "./styles.scss";

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
        <div className="attendance-page">
            <section className="attendance-page__info">
                <SectionHeader title="Журнал посещаемости" subtitle={division?.name ?? "Подразделение"} />
                <div className="attendance-page__wrapper">
                    <AttendanceSearch />
                    <NewAttendance />
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

    return <Search className="attendance-page__search" value={search} handleChange={handleChange} />;
}

function NewAttendance() {
    const isModalActive = useUnit($isAddingModalActive);
    useLockedBody(isModalActive);
    return (
        <>
            {isModalActive && <AddAttendanceModal closeModal={() => addingModalClosed()} />}
            <ActionButton className="attendance-page__add-btn" colorType="info" onClick={() => addingModalOpened()}>
                Добавить +
            </ActionButton>
        </>
    );
}
