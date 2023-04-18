import React from "react";
import { Link } from "react-router-dom";
import { DivisionRoute } from "../../../../constants/divisionsRoutes";

import "./styles.scss";

type Props = {
    division: DivisionRoute;
};

const DivisionsItem: React.FC<Props> = ({ division }) => {
    return (
        <li className="divisions-item">
            <Link className="divisions-item__link" to={division.path}>
                <h5 className="divisions-item__title">{division.name}</h5>
            </Link>
        </li>
    );
};

export default DivisionsItem;
