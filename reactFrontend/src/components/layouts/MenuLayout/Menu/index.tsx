import React from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import {
    ATTENDANCE_ROUTE,
    DEPARTMENTS_ROUTE,
    DIVISIONS_ROUTE,
    EMPLOYEES_ROUTE,
    WORK_PLAN_ROUTE,
} from "../../../../constants/routesPathnames";
import cn from "classnames";
import scheduleIconSrc from "../../../../assets/img/schedule-icon.svg";
import checklistIconSrc from "../../../../assets/img/checklist-icon.svg";
import buildingIconSrc from "../../../../assets/img/building-icon.svg";
import workerIconSrc from "../../../../assets/img/worker.svg";
import CheckAccess from "../../../CheckAccess";
import { ROLES } from "../../../../constants/roles";

import "./styles.scss";

type Props = {
    className?: string;
};

const Menu: React.FC<Props> = ({ className }) => {
    const location = useLocation();
    const { divisionId } = useParams();

    const [activeLink, setActiveLink] = React.useState(location.pathname);

    const links: { title: string; path: string; src: string }[] = [
        { title: "Рабочий план", path: `/${divisionId}/` + WORK_PLAN_ROUTE.NAME, src: scheduleIconSrc },
        { title: "Журнал посещаемости", path: `/${divisionId}/` + ATTENDANCE_ROUTE.NAME, src: checklistIconSrc },
        { title: "Работники", path: `/${divisionId}/` + EMPLOYEES_ROUTE.NAME, src: workerIconSrc },
        { title: "Отделы", path: `/${divisionId}/` + DEPARTMENTS_ROUTE.NAME, src: buildingIconSrc },
    ];

    return (
        <nav className={cn("menu", className)}>
            <ul className="menu__list">
                <CheckAccess allowedRoles={[ROLES.ADMIN]}>
                    <li className="menu__item">
                        <Link className="menu__link menu__link--back" to={DIVISIONS_ROUTE.PATH}>
                            <div className="menu__link-icons-wrapper">
                                <svg
                                    className="menu__link-arrow-icon"
                                    width="15"
                                    height="24"
                                    viewBox="0 0 15 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <rect
                                        width="3.78476"
                                        height="14.7259"
                                        rx="1.89238"
                                        transform="matrix(-0.809017 -0.587785 -0.587785 0.809017 14.0986 2.24609)"
                                        fill="#009CBC"
                                    />
                                    <rect
                                        x="2.38086"
                                        y="11.269"
                                        width="3.78476"
                                        height="14.7259"
                                        rx="1.89238"
                                        transform="rotate(-36 2.38086 11.269)"
                                        fill="#009CBC"
                                    />
                                    <mask
                                        id="mask0_292_419"
                                        maskUnits="userSpaceOnUse"
                                        x="1"
                                        y="0"
                                        width="13"
                                        height="16"
                                    >
                                        <rect
                                            width="3.78476"
                                            height="17.1162"
                                            rx="1.89238"
                                            transform="matrix(-0.809017 -0.587785 -0.587785 0.809017 14.0986 2.22461)"
                                            fill="#009CBC"
                                        />
                                    </mask>
                                    <g mask="url(#mask0_292_419)">
                                        <rect
                                            x="1.73975"
                                            y="10.3872"
                                            width="3.78476"
                                            height="15.8163"
                                            rx="1.89238"
                                            transform="rotate(-36 1.73975 10.3872)"
                                            fill="#009CBC"
                                        />
                                    </g>
                                </svg>
                                <svg
                                    className="menu__link-arrow-icon"
                                    width="15"
                                    height="24"
                                    viewBox="0 0 15 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <rect
                                        width="3.78476"
                                        height="14.7259"
                                        rx="1.89238"
                                        transform="matrix(-0.809017 -0.587785 -0.587785 0.809017 14.0986 2.24609)"
                                        fill="#009CBC"
                                    />
                                    <rect
                                        x="2.38086"
                                        y="11.269"
                                        width="3.78476"
                                        height="14.7259"
                                        rx="1.89238"
                                        transform="rotate(-36 2.38086 11.269)"
                                        fill="#009CBC"
                                    />
                                    <mask
                                        id="mask0_292_419"
                                        maskUnits="userSpaceOnUse"
                                        x="1"
                                        y="0"
                                        width="13"
                                        height="16"
                                    >
                                        <rect
                                            width="3.78476"
                                            height="17.1162"
                                            rx="1.89238"
                                            transform="matrix(-0.809017 -0.587785 -0.587785 0.809017 14.0986 2.22461)"
                                            fill="#009CBC"
                                        />
                                    </mask>
                                    <g mask="url(#mask0_292_419)">
                                        <rect
                                            x="1.73975"
                                            y="10.3872"
                                            width="3.78476"
                                            height="15.8163"
                                            rx="1.89238"
                                            transform="rotate(-36 1.73975 10.3872)"
                                            fill="#009CBC"
                                        />
                                    </g>
                                </svg>
                            </div>
                            Подразделения
                        </Link>
                    </li>
                </CheckAccess>
                {links.map((link) => (
                    <li className="menu__item" key={link.path} onClick={() => setActiveLink(link.path)}>
                        <Link
                            className={cn("menu__link", { "menu__link--active": activeLink === link.path })}
                            to={link.path}
                        >
                            <img className="menu__link-icon" src={link.src} alt="Students" />
                            {link.title}
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default Menu;
