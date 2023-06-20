import React, { useState, useEffect, FC } from "react";
import Pagination from "../../../components/Pagination";
import Table from "../../../components/Table";
import TableBodyRow from "../../../components/Table/TableBodyRow";
import TableBodyCell from "../../../components/Table/TableBodyRow/TableBodyCell";
import TableHead from "../../../components/Table/TableHead";
import TableHeadCell from "../../../components/Table/TableHead/TableHeadCell";
import useLockedBody from "../../../hooks/useLockedBody";
import { IEmployee } from "../../../models/Employee";
import { useSearchParams } from "react-router-dom";
import Alert from "../../../components/Alert";
import { ALERT } from "../../../constants/alertTypes";
import Loader from "../../../components/Loader";
import EditEmployeeModal from "../../../components/modals/employess/EditEmployeeModal";
import { useUnit } from "effector-react";
import cn from "classnames";
import {
    $employees,
    $error,
    $isFetching,
    $isLoading,
    $page,
    $totalPages,
    pageChanged,
} from "../model";

import styles from "./styles.module.scss";

const Employees: FC = () => {
    const [editingEmployee, setEditingEmployee] = useState<IEmployee | null>(
        null
    );
    useLockedBody(!!editingEmployee);

    return (
        <div>
            {editingEmployee && (
                <EditEmployeeModal
                    closeModal={() => setEditingEmployee(null)}
                    employee={editingEmployee}
                />
            )}
            <ErrorAlert />
            <Loading />
            <EmptyAlert />
            <TableContent />
            <PaginationController />
        </div>
    );
};

export default Employees;

function TableContent() {
    const [employees, isLoading, isFetching, error] = useUnit([
        $employees,
        $isLoading,
        $isFetching,
        $error,
    ]);
    if (isLoading || error || employees.length === 0) return null;

    return (
        <div className={styles.wrapper}>
            <Table className={styles.table}>
                <TableHead>
                    <TableHeadCell>Табельный номер</TableHeadCell>
                    <TableHeadCell>ФИО</TableHeadCell>
                    <TableHeadCell>Отдел</TableHeadCell>
                </TableHead>
                <tbody className={cn(isFetching && styles.opacity)}>
                    {employees.map((employee) => (
                        <TableBodyRow
                            key={employee.studentId}
                            onClick={() => {}}
                        >
                            <TableBodyCell>{employee.studentId}</TableBodyCell>
                            <TableBodyCell className={styles.nameCell}>
                                {employee.fullName}
                            </TableBodyCell>
                            <TableBodyCell>
                                {employee.subdepartmentName}
                            </TableBodyCell>
                        </TableBodyRow>
                    ))}
                </tbody>
            </Table>
        </div>
    );
}

function PaginationController() {
    const [page, totalPages] = useUnit([$page, $totalPages]);
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        searchParams.set("page", String(page));
        setSearchParams(searchParams);
    }, [page, searchParams, setSearchParams]);

    return totalPages > 1 ? (
        <Pagination
            className={styles.pagination}
            pageCount={totalPages}
            onPageChange={(page) => pageChanged(page.selected + 1)}
            renderOnZeroPageCount={() => null}
            disableInitialCallback={true}
            forcePage={page - 1}
        />
    ) : null;
}

function EmptyAlert() {
    const [employees, isLoading, isFetching, error] = useUnit([
        $employees,
        $isLoading,
        $isFetching,
        $error,
    ]);
    if (!error && !isLoading && !isFetching && employees.length < 1) {
        return (
            <Alert type={ALERT.INFO}>
                На текущий момент нет ни одной записи.
            </Alert>
        );
    }
    return null;
}

function ErrorAlert() {
    const error = useUnit($error);
    return error ? <Alert type={ALERT.ERROR}>{error}</Alert> : null;
}

function Loading() {
    const isLoading = useUnit($isLoading);
    return isLoading ? <Loader className={styles.loader} /> : null;
}
