import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Alert from "../../../components/Alert";
import Loader from "../../../components/Loader";
import EditDepartmentModal from "../../../components/modals/departments/EditDepartmentModal";
import Table from "../../../components/Table";
import TableBodyRow from "../../../components/Table/TableBodyRow";
import TableBodyCell from "../../../components/Table/TableBodyRow/TableBodyCell";
import TableHead from "../../../components/Table/TableHead";
import TableHeadCell from "../../../components/Table/TableHead/TableHeadCell";
import { ALERT } from "../../../constants/alertTypes";
import { useDepartmentsContext } from "../../../context/departmentsContext";
import useLockedBody from "../../../hooks/useLockedBody";
import { IDepartment } from "../../../models/Department";
import DepartmentService from "../../../services/DepartmentService";

import "./styles.scss";

const Departments: React.FC = () => {
    const [editingDepartment, setEditingDepartment] = useState<IDepartment | null>(null);
    useLockedBody(!!editingDepartment);

    const { divisionId = "" } = useParams();

    const { departments, setDepartments } = useDepartmentsContext();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const cancelToken = axios.CancelToken.source();
        setError(null);

        const fetchDepartments = async () => {
            try {
                const response = await DepartmentService.fetch(divisionId, {
                    cancelToken: cancelToken.token,
                });
                console.log(response);
                setDepartments(response.data);
            } catch (error) {
                console.log(error);
                const err = error as any;
                setError(err?.response?.data?.message ?? "Не удалось получить данные с сервера");
            } finally {
                setIsLoading(false);
            }
        };

        fetchDepartments();

        return () => cancelToken.cancel();
    }, [divisionId, setDepartments]);

    const handleOpenEditing = (event: React.MouseEvent<HTMLTableRowElement>, department: IDepartment) => {
        event.stopPropagation();
        setEditingDepartment(department);
    };

    return (
        <div className="departments">
            {editingDepartment && (
                <EditDepartmentModal closeModal={() => setEditingDepartment(null)} department={editingDepartment} />
            )}
            {error && <Alert type={ALERT.ERROR}>{error}</Alert>}
            {isLoading && <Loader className="departments__loader" />}
            {!error && !isLoading && departments.length < 1 && (
                <Alert type={ALERT.INFO}>На текущий момент нет ни одной записи.</Alert>
            )}
            {!error && !isLoading && departments.length > 1 && (
                <div className="departments__table-wrapper">
                    <Table className="departments__table">
                        <TableHead>
                            <TableHeadCell>Номер отдела</TableHeadCell>
                            <TableHeadCell>Название отдела</TableHeadCell>
                        </TableHead>
                        <tbody>
                            {departments.map((dep) => (
                                <TableBodyRow key={dep.id} onClick={(event) => handleOpenEditing(event, dep)}>
                                    <TableBodyCell>{dep.id}</TableBodyCell>
                                    <TableBodyCell className="departments__table-dep-cell">{dep.name}</TableBodyCell>
                                </TableBodyRow>
                            ))}
                        </tbody>
                    </Table>
                </div>
            )}
        </div>
    );
};

export default Departments;
