import React from "react";
import Search from "../../components/Search";
import SectionHeader from "../../components/SectionHeader";
import Attendance from "./Attendance";
import NewAttendance from "./NewAttendance";

import "./styles.scss";

const AttendancePage: React.FC = () => {
    return (
        <div className="attendance-page">
            <section className="attendance-page__info">
                <SectionHeader title="Журнал посещаемости" subtitle="ОСП «Трамвайный парк №1»" />
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
