import React from "react";
import Search from "../../components/Search";
import SectionHeader from "../../components/SectionHeader";
import Plan from "./Plan";
import NewPlan from "./NewPlan";
import PlanReport from "./PlanReport";
import { useParams } from "react-router-dom";
import { getDivisionName } from "../../helpers/getDivisionName";

import "./styles.scss";

const WorkPlanPage: React.FC = () => {
    const { divisionId = "" } = useParams();
    const divisionName = getDivisionName(divisionId);

    return (
        <div className="plan-page">
            <section className="plan-page__info">
                <SectionHeader title="Рабочий план" subtitle={divisionName ?? "Подразделение"} />
                <div className="plan-page__wrapper">
                    <Search className="plan-page__search" />
                    <div className="plan-page__actions">
                        <PlanReport />
                        <NewPlan />
                    </div>
                </div>
                <Plan />
            </section>
        </div>
    );
};

export default WorkPlanPage;
