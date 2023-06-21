import React, { MouseEvent, useEffect } from "react";
import Table from "components/Table";
import TableBodyRow from "components/Table/TableBodyRow";
import TableBodyCell from "components/Table/TableBodyRow/TableBodyCell";
import TableHead from "components/Table/TableHead";
import TableHeadCell from "components/Table/TableHead/TableHeadCell";
import Pagination from "components/Pagination";
import { formatDate } from "helpers/formatDate";
import Alert, { ALERT } from "components/Alert";
import { useSearchParams } from "react-router-dom";
import Loader from "components/Loader";
import { useUnit } from "effector-react";
import EditPlan from "../EditPlan";
import { modalOpened } from "../EditPlan/model";
import Materials from "../Materials";
import { IPlan, PLAN_STATUS_VALUE } from "models/Plan";
import cn from "classnames";
import {
    $error,
    $isFetching,
    $isLoading,
    $page,
    $plans,
    $totalPages,
    pageChanged,
} from "../model";

import styles from "./styles.module.scss";

const Plan: React.FC = () => (
    <>
        <EditPlan />
        <Materials />
        <div>
            <ErrorAlert />
            <Loading />
            <EmptyAlert />
            <TableContent />
            <PaginationController />
        </div>
    </>
);

export default Plan;

function TableContent() {
    const [plans, isLoading, isFetching, error] = useUnit([
        $plans,
        $isLoading,
        $isFetching,
        $error,
    ]);
    if (isLoading || error || plans.length === 0) return null;

    const handleOpenEditing = (
        event: MouseEvent<HTMLTableRowElement>,
        plan: IPlan
    ) => {
        event.stopPropagation();
        modalOpened({ plan });
    };

    return (
        <div className={styles.wrapper}>
            <Table className={styles.table}>
                <TableHead>
                    <TableHeadCell>Номер занятия</TableHeadCell>
                    <TableHeadCell>Дата</TableHeadCell>
                    <TableHeadCell>Длительность занятия</TableHeadCell>
                    <TableHeadCell>Кол-во обучающихся</TableHeadCell>
                    <TableHeadCell className={styles.topicColumn}>
                        Тема занятия
                    </TableHeadCell>
                    <TableHeadCell>Преподаватель</TableHeadCell>
                    <TableHeadCell>Статус</TableHeadCell>
                </TableHead>
                <tbody className={cn(isFetching && styles.opacity)}>
                    {!error &&
                        plans.map((plan) => (
                            <TableBodyRow
                                className={cn(
                                    styles.row,
                                    plan.lessonContent.length < 1 &&
                                        styles.empty
                                )}
                                key={plan.id}
                                onClick={(event) =>
                                    handleOpenEditing(event, plan)
                                }
                            >
                                <TableBodyCell>{plan.id}</TableBodyCell>
                                <TableBodyCell className={styles.dateCell}>
                                    {formatDate(plan.date)}
                                </TableBodyCell>
                                <TableBodyCell>{plan.duration}</TableBodyCell>
                                <TableBodyCell>
                                    {plan.peoplePlanned}
                                </TableBodyCell>
                                <TableBodyCell>{plan.topic}</TableBodyCell>
                                <TableBodyCell className={styles.nameCell}>
                                    {plan.teacher}
                                </TableBodyCell>
                                <TableBodyCell>
                                    {plan.isHeld
                                        ? PLAN_STATUS_VALUE[1]
                                        : PLAN_STATUS_VALUE[0]}
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
    const [plans, isLoading, isFetching, error] = useUnit([
        $plans,
        $isLoading,
        $isFetching,
        $error,
    ]);
    if (!error && !isLoading && !isFetching && plans.length < 1) {
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
