import React from "react";
import { useParams } from "react-router-dom";
import Search from "../../components/Search";
import SectionHeader from "../../components/SectionHeader";
import { getDivisionName } from "../../helpers/getDivisionName";
import Materials from "./Materials";
import NewMaterial from "./NewMaterial";

import "./styles.scss";

const MaterialsPage: React.FC = () => {
    const { divisionId = "" } = useParams();
    const divisionName = getDivisionName(divisionId);

    return (
        <div className="materials-page">
            <section className="materials-page__info">
                <SectionHeader title="Учебные материалы" subtitle={divisionName ?? 'Подразделение'} />
                <div className="materials-page__wrapper">
                    <Search />
                    <NewMaterial />
                </div>
                <Materials />
            </section>
        </div>
    );
};

export default MaterialsPage;
