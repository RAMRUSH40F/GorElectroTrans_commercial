import React from "react";
import Search from "../../components/Search";
import SectionHeader from "../../components/SectionHeader";
import Plan from "./Plan";
import NewPlan from "./NewPlan";
import PlanReport from "./PlanReport";
import { useParams } from "react-router-dom";
import { getDivisionRoute } from "../../helpers/getDivisionRoute";
import CheckAccess from "../../components/CheckAccess";
import { ROLES } from "../../constants/roles";

import "./styles.scss";

const WorkPlanPage: React.FC = () => {
    const { divisionId = "" } = useParams();
    const division = getDivisionRoute(divisionId);

    return (
        <div className="plan-page">
            <section className="plan-page__info">
                <SectionHeader title="Рабочий план" subtitle={division?.name ?? "Подразделение"} />
                <div className="plan-page__wrapper">
                    <Search className="plan-page__search" />
                    <div className="plan-page__actions">
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

export default WorkPlanPage;
