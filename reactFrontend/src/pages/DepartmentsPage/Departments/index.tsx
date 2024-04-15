import React from "react";

import cn from "classnames";
import { useUnit } from "effector-react";

import Alert, { ALERT } from "components/Alert";
import Loader from "components/Loader";
import Table from "components/Table";
import TableBodyRow from "components/Table/TableBodyRow";
import TableBodyCell from "components/Table/TableBodyRow/TableBodyCell";
import TableHead from "components/Table/TableHead";
import TableHeadCell from "components/Table/TableHead/TableHeadCell";

import EditDepartment from "../EditDepartment";
import { modalOpened } from "../EditDepartment/model";
import { $departments, $error, $isFetching, $isLoading } from "../model";

import styles from "./styles.module.scss";

const Departments: React.FC = () => {
    return (
        <>
            <EditDepartment />
            <div>
                <ErrorAlert />
                <Loading />
                <EmptyAlert />
                <TableContent />
            </div>
        </>
    );
};

export default Departments;

function TableContent() {
    const [departments, isLoading, isFetching, error] = useUnit([
        $departments,
        $isLoading,
        $isFetching,
        $error,
    ]);
    if (isLoading || error || departments.length === 0) return null;

    return (
        <div className={styles.tableWrapper}>
            <Table className={styles.table}>
                <TableHead>
                    <TableHeadCell>Номер отдела</TableHeadCell>
                    <TableHeadCell>Название отдела</TableHeadCell>
                </TableHead>
                <tbody className={cn(isFetching && styles.opacity)}>
                    {departments.map((dep) => (
                        <TableBodyRow
                            key={dep.id}
                            onClick={() => modalOpened(dep)}
                        >
                            <TableBodyCell>{dep.id}</TableBodyCell>
                            <TableBodyCell className={styles.depCell}>
                                {dep.name}
                            </TableBodyCell>
                        </TableBodyRow>
                    ))}
                </tbody>
            </Table>
        </div>
    );
}

function EmptyAlert() {
    const [departments, isLoading, isFetching, error] = useUnit([
        $departments,
        $isLoading,
        $isFetching,
        $error,
    ]);
    if (!error && !isLoading && !isFetching && departments.length < 1) {
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
