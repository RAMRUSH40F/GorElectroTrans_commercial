import React, { MouseEvent, useEffect } from "react";

import cn from "classnames";
import { useUnit } from "effector-react";
import { useSearchParams } from "react-router-dom";
import { Tooltip } from "react-tooltip";

import Alert, { ALERT } from "components/Alert";
import Loader from "components/Loader";
import Pagination from "components/Pagination";
import Table from "components/Table";
import TableBodyRow from "components/Table/TableBodyRow";
import TableBodyCell from "components/Table/TableBodyRow/TableBodyCell";
import TableHead from "components/Table/TableHead";
import TableHeadCell from "components/Table/TableHead/TableHeadCell";

import { formatDate } from "helpers/formatDate";

import { IPlan, PLAN_STATUS_VALUE } from "models/Plan";

import EditPlan from "../EditPlan";
import { modalOpened } from "../EditPlan/model";
import Materials from "../Materials";
import {
    $error,
    $isFetching,
    $isLoading,
    $page,
    $plans,
    $sort,
    $totalPages,
    pageChanged,
    sortToggled,
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
    const [plans, isLoading, isFetching, error, sort] = useUnit([
        $plans,
        $isLoading,
        $isFetching,
        $error,
        $sort,
    ]);
    if (isLoading || error || plans.length === 0) return null;

    const handleOpenEditing = (
        event: MouseEvent<HTMLTableRowElement>,
        plan: IPlan,
    ) => {
        event.stopPropagation();
        modalOpened({ plan });
    };

    return (
        <div className={styles.wrapper}>
            <Table className={styles.table}>
                <TableHead>
                    <TableHeadCell className={styles.numberColumn}>
                        Номер занятия
                    </TableHeadCell>
                    <TableHeadCell
                        order={sort.date}
                        onClick={() => sortToggled("date")}
                    >
                        Дата
                    </TableHeadCell>
                    <TableHeadCell className={styles.durationColumn}>
                        Длительность занятия
                    </TableHeadCell>
                    <TableHeadCell className={styles.peopleColumn}>
                        Кол-во обучающихся
                    </TableHeadCell>
                    <TableHeadCell
                        className={styles.topicColumn}
                        order={sort.topic}
                        onClick={() => sortToggled("topic")}
                    >
                        Тема занятия
                    </TableHeadCell>
                    <TableHeadCell
                        order={sort.teacher}
                        onClick={() => sortToggled("teacher")}
                    >
                        Преподаватель
                    </TableHeadCell>
                    <TableHeadCell>Статус</TableHeadCell>
                </TableHead>
                <tbody className={cn(isFetching && styles.opacity)}>
                    {!error &&
                        plans.map((plan, index) => (
                            <TableBodyRow
                                className={cn(
                                    styles.row,
                                    plan.lessonContent.length < 1 &&
                                        styles.empty,
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
                                <TableBodyCell className={styles.topicCell}>
                                    {plan.topic}
                                </TableBodyCell>
                                <TableBodyCell className={styles.nameCell}>
                                    {plan.teacher}
                                </TableBodyCell>
                                <TableBodyCell
                                    className={cn(
                                        styles.statusCell,
                                        styles[plan.status.toLowerCase()],
                                    )}
                                    data-tooltip-id={`plan-status-tooltip-${index}`}
                                >
                                    {PLAN_STATUS_VALUE[plan.status]}
                                    {plan.comment && (
                                        <StatusTooltip
                                            comment={plan.comment}
                                            id={`plan-status-tooltip-${index}`}
                                        />
                                    )}
                                </TableBodyCell>
                            </TableBodyRow>
                        ))}
                </tbody>
            </Table>
        </div>
    );
}

function StatusTooltip({ comment, id }: { comment: string; id: string }) {
    return (
        <Tooltip
            id={id}
            className={styles.statusTooltip}
            content={comment}
            border={"1px solid #929292"}
            variant="light"
            opacity={1}
            place="left"
        />
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
