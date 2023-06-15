import React from "react";
import { useSearchParams } from "react-router-dom";
import Alert from "../../../components/Alert";
import Loader from "../../../components/Loader";
import EditAttendanceModal from "../../../components/modals/attendance/EditAttendanceModal";
import Pagination from "../../../components/Pagination";
import Table from "../../../components/Table";
import TableBodyRow from "../../../components/Table/TableBodyRow";
import TableBodyCell from "../../../components/Table/TableBodyRow/TableBodyCell";
import TableHead from "../../../components/Table/TableHead";
import TableHeadCell from "../../../components/Table/TableHead/TableHeadCell";
import { ALERT } from "../../../constants/alertTypes";
import { ATTENDACE_RESULT_VALUE } from "../../../constants/attendanceResult";
import { formatDate } from "../../../helpers/formatDate";
import useLockedBody from "../../../hooks/useLockedBody";
import { useUnit } from "effector-react";
import {
    $attendances,
    $editingAttendance,
    $error,
    $isEditingModalActive,
    $isFetching,
    $isLoading,
    $page,
    $totalPages,
    editingModalClosed,
    editingModalOpened,
    pageChanged,
} from "../../../models/attendance";

import "./styles.scss";

const Attendance: React.FC = () => {
    return (
        <>
            <EditingModal />
            <div className="attendance">
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
    const [attendances, isLoading, isFetching, error] = useUnit([$attendances, $isLoading, $isFetching, $error]);
    if (isLoading || error || attendances.length === 0) return null;

    return (
        <div className="attendance__table-wrapper">
            <Table className="attendance__table">
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
                <tbody className={`attendance__table-body ${isFetching && "attendance__table-body--opacity"}`}>
                    {attendances.map((attendance) => (
                        <TableBodyRow
                            key={`${attendance.studentId}${attendance.lessonId}`}
                            onClick={() => editingModalOpened(attendance)}
                        >
                            <TableBodyCell>{attendance.lessonId}</TableBodyCell>
                            <TableBodyCell className="attendance__table-name-cell">{attendance.name}</TableBodyCell>
                            <TableBodyCell>{formatDate(attendance.date)}</TableBodyCell>
                            <TableBodyCell>{attendance.duration}</TableBodyCell>
                            <TableBodyCell>{ATTENDACE_RESULT_VALUE[attendance.success]}</TableBodyCell>
                            <TableBodyCell className="attendance__table-topic-cell">{attendance.topic}</TableBodyCell>
                            <TableBodyCell className="attendance__table-subdepartment-cell">
                                {attendance.subDepartment}
                            </TableBodyCell>
                            <TableBodyCell className="attendance__table-name-cell">{attendance.teacher}</TableBodyCell>
                        </TableBodyRow>
                    ))}
                </tbody>
            </Table>
        </div>
    );
}

function EditingModal() {
    const [isModalActive, editingAtendance] = useUnit([$isEditingModalActive, $editingAttendance]);
    useLockedBody(isModalActive);
    return (
        <>
            {isModalActive && editingAtendance && (
                <EditAttendanceModal closeEditing={() => editingModalClosed()} attendance={editingAtendance} />
            )}
        </>
    );
}

function EmptyAlert() {
    const [attendances, isLoading, error] = useUnit([$attendances, $isLoading, $error]);
    if (!error && !isLoading && attendances.length < 1) {
        return <Alert type={ALERT.INFO}>На текущий момент нет ни одной записи.</Alert>;
    }
    return null;
}

function ErrorAlert() {
    const error = useUnit($error);
    return error ? <Alert type={ALERT.ERROR}>{error}</Alert> : null;
}

function Loading() {
    const isLoading = useUnit($isLoading);
    return isLoading ? <Loader className="attendance__loader" /> : null;
}

function PaginationController() {
    const [page, totalPages] = useUnit([$page, $totalPages]);
    const [searchParams, setSearchParams] = useSearchParams();

    const handlePageChange = (selectedItem: { selected: number }) => {
        pageChanged(selectedItem.selected + 1);
        searchParams.set("page", String(selectedItem.selected + 1));
        setSearchParams(searchParams);
    };

    return totalPages > 1 ? (
        <Pagination
            className="attendance__pagination"
            pageCount={totalPages}
            onPageChange={handlePageChange}
            renderOnZeroPageCount={() => null}
            disableInitialCallback={true}
            forcePage={page - 1}
        />
    ) : null;
}
