import React from "react";

import { Link } from "react-router-dom";

import SectionHeader from "../../components/SectionHeader";

import { DIVISIONS_ROUTES, DivisionRoute } from "./divisionsRoutes";

import styles from "./styles.module.scss";

const DivisionsPage: React.FC = () => {
    return (
        <div>
            <section>
                <SectionHeader
                    className={styles.header}
                    title="Подразделения"
                />
                <ul className={styles.divisions}>
                    {DIVISIONS_ROUTES.map((division) => (
                        <DivisionItem
                            key={division.allowedRole}
                            division={division}
                        />
                    ))}
                </ul>
            </section>
        </div>
    );
};

export default DivisionsPage;

function DivisionItem({ division }: { division: DivisionRoute }) {
    return (
        <li>
            <Link to={division.path}>
                <h5>{division.name}</h5>
            </Link>
        </li>
    );
}
