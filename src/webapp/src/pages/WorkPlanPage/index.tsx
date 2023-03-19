import React from "react";
import Search from "../../components/Search";
import SectionHeader from "../../components/SectionHeader";
import WorkPlan from "./WorkPlan";
import NewWorkPlan from "./NewWorkPlan";
import WorkPlanReport from "./WorkPlanReport";

import "./styles.scss";

const WorkPlanPage: React.FC = () => {
    return (
        <div className="work-plan-page">
            <section className="work-plan-page__info">
                <SectionHeader title="Рабочий план" subtitle="ОСП «Трамвайный парк №1»" />
                <div className="work-plan-page__wrapper">
                    <Search className="work-plan-page__search" />
                    <div className="work-plan-page__actions">
                        <WorkPlanReport />
                        <NewWorkPlan />
                    </div>
                </div>
                <WorkPlan />
            </section>
        </div>
    );
};

export default WorkPlanPage;
