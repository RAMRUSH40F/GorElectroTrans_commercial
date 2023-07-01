import { useEffect, FC } from "react";
import Pagination from "components/Pagination";
import Table from "components/Table";
import TableBodyRow from "components/Table/TableBodyRow";
import TableBodyCell from "components/Table/TableBodyRow/TableBodyCell";
import TableHead from "components/Table/TableHead";
import TableHeadCell from "components/Table/TableHead/TableHeadCell";
import { useSearchParams } from "react-router-dom";
import Alert, { ALERT } from "components/Alert";
import Loader from "components/Loader";
import EditEmployee from "../EditEmployee";
import { useUnit } from "effector-react";
import { modalOpened } from "../EditEmployee/model";
import cn from "classnames";
import {
    $employees,
    $error,
    $isFetching,
    $isLoading,
    $page,
    $sort,
    $totalPages,
    pageChanged,
    sortToggled,
} from "../model";

import styles from "./styles.module.scss";

const Employees: FC = () => {
    return (
        <>
            <EditEmployee />
            <div>
                <ErrorAlert />
                <Loading />
                <EmptyAlert />
                <TableContent />
                <PaginationController />
            </div>
        </>
    );
};

export default Employees;

function TableContent() {
    const [employees, isLoading, isFetching, error, sort] = useUnit([
        $employees,
        $isLoading,
        $isFetching,
        $error,
        $sort,
    ]);

    if (isLoading || error || employees.length === 0) return null;

    return (
        <div className={styles.wrapper}>
            <Table className={styles.table}>
                <TableHead>
                    <TableHeadCell>Табельный номер</TableHeadCell>
                    <TableHeadCell
                        order={sort.name}
                        onClick={() => sortToggled("name")}
                    >
                        ФИО
                    </TableHeadCell>
                    <TableHeadCell
                        order={sort.subdepartment}
                        onClick={() => sortToggled("subdepartment")}
                    >
                        Отдел
                    </TableHeadCell>
                </TableHead>
                <tbody className={cn(isFetching && styles.opacity)}>
                    {employees.map((employee) => (
                        <TableBodyRow
                            key={employee.studentId}
                            onClick={() => modalOpened(employee)}
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
