import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Search from "../../components/Search";
import SectionHeader from "../../components/SectionHeader";
import { useEmployeesContext } from "../../context/employeesContext";
import { getDivisionName } from "../../helpers/getDivisionName";
import DepartmentService from "../../services/DepartmentService";
import NewEmployee from "./NewEmployee";
import Employees from "./Employees";

import "./styles.scss";

const EmployeesPage: React.FC = () => {
    const { divisionId = "" } = useParams();
    const divisionName = getDivisionName(divisionId);

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { setDepartments } = useEmployeesContext();

    useEffect(() => {
        const cancelToken = axios.CancelToken.source();
        const fetchDepartments = async () => {
            setIsLoading(true);
            setError(null);
            setDepartments([]);
            try {
                const response = await DepartmentService.fetch(divisionId, {
                    cancelToken: cancelToken.token,
                });
                setDepartments(response.data);
            } catch (error) {
                console.log(error);
                const err = error as any;
                setError(err?.message ?? "Something went wrong");
            } finally {
                setIsLoading(false);
            }
        };
        fetchDepartments();

        return () => cancelToken.cancel();
    }, [divisionId, setDepartments]);

    return (
        <div className="employees-page">
            <section className="employees-page__info">
                <SectionHeader title="Работники" subtitle={divisionName ?? "Подразделение"} />
                <div className="employees-page__wrapper">
                    <Search />
                    <NewEmployee />
                </div>
                <Employees />
            </section>
        </div>
    );
};

export default EmployeesPage;
