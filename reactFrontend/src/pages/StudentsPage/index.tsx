import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Search from "../../components/Search";
import SectionHeader from "../../components/SectionHeader";
import { useStudentsContext } from "../../context/studentsContext";
import { getDivisionName } from "../../helpers/getDivisionName";
import DepartmentService from "../../services/DepartmentService";
import NewStudent from "./NewStudent";
import StudentsComponent from "./StudentsComponent";

import "./styles.scss";

const StudentsPage: React.FC = () => {
    const { divisionId = "" } = useParams();
    const divisionName = getDivisionName(divisionId);

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { setDepartments } = useStudentsContext();

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
        <div className="students-page">
            <section className="students-page__info">
                <SectionHeader title="Студенты" subtitle={divisionName ?? "Подразделение"} />
                <div className="students-page__wrapper">
                    <Search />
                    <NewStudent />
                </div>
                <StudentsComponent />
            </section>
        </div>
    );
};

export default StudentsPage;
