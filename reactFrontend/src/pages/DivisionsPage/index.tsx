import React from "react";
import SectionHeader from "../../components/SectionHeader";
import Divisions from "./Divisions";

import "./styles.scss";

const DivisionsPage: React.FC = () => {
    return (
        <div className="divisions-page">
            <section className="divisions-page__content">
                <SectionHeader className="divisions-page__section-header" title="Подразделения" />
                <Divisions />
            </section>
        </div>
    );
};

export default DivisionsPage;
