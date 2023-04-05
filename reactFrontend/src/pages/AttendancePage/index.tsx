import React from "react";
import { useParams } from "react-router-dom";
import Search from "../../components/Search";
import SectionHeader from "../../components/SectionHeader";
import { getDivisionName } from "../../helpers/getDivisionName";
import Attendance from "./Attendance";
import NewAttendance from "./NewAttendance";

import "./styles.scss";

const AttendancePage: React.FC = () => {
    const { divisionId = "" } = useParams();
    const divisionName = getDivisionName(divisionId);

    return (
        <div className="attendance-page">
            <section className="attendance-page__info">
                <SectionHeader title="Журнал посещаемости" subtitle={divisionName ?? "Подразделение"} />
                <div className="attendance-page__wrapper">
                    <Search className="attendance-page__search" />
                    <NewAttendance />
                </div>
                <Attendance />
            </section>
        </div>
    );
};

export default AttendancePage;
