import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Alert, { ALERT } from "components/Alert";
import Loader from "components/Loader";
import Pagination from "components/Pagination";
import Table from "components/Table";
import TableBodyRow from "components/Table/TableBodyRow";
import TableBodyCell from "components/Table/TableBodyRow/TableBodyCell";
import TableHead from "components/Table/TableHead";
import TableHeadCell from "components/Table/TableHead/TableHeadCell";
import { ATTENDACE_RESULT_VALUE } from "constants/attendanceResult";
import { formatDate } from "helpers/formatDate";
import { useUnit } from "effector-react";
import { modalOpened } from "../EditAttendance/model";
import EditAttendance from "../EditAttendance";
import cn from "classnames";
import {
    $attendances,
    $error,
    $isFetching,
    $isLoading,
    $page,
    $totalPages,
    pageChanged,
} from "../model";

import styles from "./styles.module.scss";

const Attendance: React.FC = () => {
    return (
        <>
            <EditAttendance />
            <div>
                <ErrorAlert />
                <EmptyAlert />
                <Loading />
                <TableContent />
                <PaginationController />
            </div>
        </>
    );
};

export default Attendance;

function TableContent() {
    const [attendances, isLoading, isFetching, error] = useUnit([
        $attendances,
        $isLoading,
        $isFetching,
        $error,
    ]);
    if (isLoading || error || attendances.length === 0) return null;

    return (
        <div className={styles.tableWrapper}>
            <Table className={styles.table}>
                <TableHead>
                    <TableHeadCell>Номер занятия</TableHeadCell>
                    <TableHeadCell>ФИО</TableHeadCell>
                    <TableHeadCell>Дата</TableHeadCell>
                    <TableHeadCell>Кол-во часов</TableHeadCell>
                    <TableHeadCell>Зачет/Незачет</TableHeadCell>
                    <TableHeadCell>Тема занятия</TableHeadCell>
                    <TableHeadCell>Отдел</TableHeadCell>
                    <TableHeadCell>Преподаватель</TableHeadCell>
                </TableHead>
                <tbody className={cn(isFetching && styles.opacity)}>
                    {attendances.map((attendance) => (
                        <TableBodyRow
                            key={`${attendance.studentId}${attendance.lessonId}`}
                            onClick={() => modalOpened(attendance)}
                        >
                            <TableBodyCell>{attendance.lessonId}</TableBodyCell>
                            <TableBodyCell className={styles.nameCell}>
                                {attendance.name}
                            </TableBodyCell>
                            <TableBodyCell>
                                {formatDate(attendance.date)}
                            </TableBodyCell>
                            <TableBodyCell>{attendance.duration}</TableBodyCell>
                            <TableBodyCell>
                                {ATTENDACE_RESULT_VALUE[attendance.success]}
                            </TableBodyCell>
                            <TableBodyCell className={styles.topicCell}>
                                {attendance.topic}
                            </TableBodyCell>
                            <TableBodyCell className={styles.subdepartmentCell}>
                                {attendance.subDepartment}
                            </TableBodyCell>
                            <TableBodyCell className={styles.nameCell}>
                                {attendance.teacher}
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
    const [attendances, isLoading, isFetching, error] = useUnit([
        $attendances,
        $isLoading,
        $isFetching,
        $error,
    ]);
    if (!error && !isLoading && !isFetching && attendances.length < 1) {
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
