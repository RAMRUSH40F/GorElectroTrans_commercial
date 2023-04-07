import React, { useState, useEffect, FC } from "react";
import Pagination from "../../../components/Pagination";
import Table from "../../../components/Table";
import TableBodyRow from "../../../components/Table/TableBodyRow";
import TableBodyCell from "../../../components/Table/TableBodyRow/TableBodyCell";
import TableHead from "../../../components/Table/TableHead";
import TableHeadCell from "../../../components/Table/TableHead/TableHeadCell";
import useLockedBody from "../../../hooks/useLockedBody";
import { IEmployee } from "../../../models/Employee";
import EmployeeService from "../../../services/EmployeeService";
import axios from "axios";
import { useParams, useSearchParams } from "react-router-dom";
import { useEmployeesContext } from "../../../context/employeesContext";
import Alert from "../../../components/Alert";
import { ALERT } from "../../../constants/alertTypes";
import Loader from "../../../components/Loader";

import "./styles.scss";
import EditEmployeeModal from "../../../components/modals/employess/EditEmployeeModal";

const LIMIT = 20;

const Employees: FC = () => {
    const [editingEmployee, setEditingEmployee] = useState<IEmployee | null>(null);
    useLockedBody(!!editingEmployee);

    const { divisionId = "" } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();

    const { employees, setEmployees } = useEmployeesContext();
    const [isLoading, setIsLoading] = useState(true);
    const [isFetching, setIsFetching] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [page, setPage] = useState<number>(searchParams.get("page") ? Number(searchParams.get("page")) : 1);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        const cancelToken = axios.CancelToken.source();
        setIsFetching(true);
        setError(null);

        const fetchStudents = async () => {
            try {
                const response = await EmployeeService.fetch(divisionId, {
                    params: {
                        page,
                        size: LIMIT,
                    },
                    cancelToken: cancelToken.token,
                });
                console.log(response);
                const totalEmployees = response.headers["students_count"];
                const totalPages = totalEmployees ? Math.ceil(totalEmployees / LIMIT) : 1;
                setEmployees(response.data);
                setTotalPages(totalPages);
            } catch (error) {
                console.log(error);
                const err = error as any;
                setError(err?.response?.data?.message ?? "Не удалось получить данные с сервера");
            } finally {
                setIsLoading(false);
                setIsFetching(false);
            }
        };
        fetchStudents();

        return () => cancelToken.cancel();
    }, [page, setEmployees, divisionId]);

    const handleOpenEditing = (event: React.MouseEvent<HTMLTableRowElement>, employee: IEmployee) => {
        event.stopPropagation();
        setEditingEmployee(employee);
    };

    const handlePageChange = (selectedItem: { selected: number }) => {
        setPage(selectedItem.selected + 1);
        searchParams.set("page", String(selectedItem.selected + 1));
        setSearchParams(searchParams);
    };

    return (
        <div className="students">
            {editingEmployee && (
                <EditEmployeeModal closeModal={() => setEditingEmployee(null)} employee={editingEmployee} />
            )}
            {error && <Alert type={ALERT.ERROR}>{error}</Alert>}
            {isLoading && <Loader className="students__loader" />}
            {!error && !isLoading && employees.length < 1 && (
                <Alert type={ALERT.INFO}>На текущий момент нет ни одной записи.</Alert>
            )}
            {!error && !isLoading && employees.length > 0 && (
                <>
                    <div className="students__table-wrapper">
                        <Table className="students__table">
                            <TableHead>
                                <TableHeadCell>Табельный номер</TableHeadCell>
                                <TableHeadCell>Фамилия И.О</TableHeadCell>
                                <TableHeadCell>Отдел</TableHeadCell>
                            </TableHead>
                            <tbody className={`students__table-body ${isFetching && "students__table-body--opacity"}`}>
                                {!error &&
                                    !isLoading &&
                                    employees.map((employee) => (
                                        <TableBodyRow
                                            key={employee.studentId}
                                            onClick={(event) => handleOpenEditing(event, employee)}
                                        >
                                            <TableBodyCell>{employee.studentId}</TableBodyCell>
                                            <TableBodyCell>{employee.fullName}</TableBodyCell>
                                            <TableBodyCell>{employee.subdepartmentName}</TableBodyCell>
                                        </TableBodyRow>
                                    ))}
                            </tbody>
                        </Table>
                    </div>
                    {totalPages > 1 && (
                        <Pagination
                            className="students__pagination"
                            pageCount={totalPages}
                            onPageChange={handlePageChange}
                            renderOnZeroPageCount={() => null}
                            initialPage={Number(page) - 1}
                        />
                    )}
                </>
            )}
        </div>
    );
};

export default Employees;