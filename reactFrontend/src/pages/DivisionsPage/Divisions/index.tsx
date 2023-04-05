import React from "react";
import DivisionsItem from "./DivisionsItem";
import { DIVISIONS_ROUTES } from "../../../constants/divisionsRoutes";

import "./styles.scss";

const Divisions: React.FC = () => {
    return (
        <ul className="divisions">
            {DIVISIONS_ROUTES.map((division) => (
                <DivisionsItem key={division.id} division={division} />
            ))}
        </ul>
    );
};

export default Divisions;
