import React, { useState, useEffect, FC } from "react";
import EditStudentModal from "../../../components/modals/students/EditStudentModal";
import Pagination from "../../../components/Pagination";
import Table from "../../../components/Table";
import TableBodyRow from "../../../components/Table/TableBodyRow";
import TableBodyCell from "../../../components/Table/TableBodyRow/TableBodyCell";
import TableHead from "../../../components/Table/TableHead";
import TableHeadCell from "../../../components/Table/TableHead/TableHeadCell";
import useLockedBody from "../../../hooks/useLockedBody";
import { IStudent } from "../../../models/Student";
import StudentsService from "../../../services/StudentService";
import axios from "axios";
import { useParams, useSearchParams } from "react-router-dom";
import { useStudentsContext } from "../../../context/studentsContext";
import Alert from "../../../components/Alert";
import { ALERT } from "../../../constants/alertTypes";
import Loader from "../../../components/Loader";

import "./styles.scss";

const LIMIT = 20;

const StudentsComponent: FC = () => {
    const [editingStudent, setEditingStudent] = useState<IStudent | null>(null);
    useLockedBody(!!editingStudent);

    const { divisionId = "" } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();

    const { students, setStudents } = useStudentsContext();
    const [isLoading, setIsLoading] = useState(true);
    const [isFetching, setIsFetching] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [page, setPage] = useState<number>(searchParams.get("page") ? Number(searchParams.get("page")) : 1);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        const cancelToken = axios.CancelToken.source();
        setIsFetching(true);
        setError(null);

        console.log(page);

        const fetchStudents = async () => {
            try {
                const response = await StudentsService.fetch(divisionId, {
                    params: {
                        page,
                        size: LIMIT,
                    },
                    cancelToken: cancelToken.token,
                });
                console.log(response);
                const totalStudents = response.headers["students_count"];
                const totalPages = totalStudents ? Math.ceil(totalStudents / LIMIT) : 1;
                setStudents(response.data);
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
    }, [page, setStudents, divisionId]);

    const handleOpenEditing = (event: React.MouseEvent<HTMLTableRowElement>, student: IStudent) => {
        event.stopPropagation();
        setEditingStudent(student);
    };

    const handlePageChange = (selectedItem: { selected: number }) => {
        setPage(selectedItem.selected + 1);
        searchParams.set("page", String(selectedItem.selected + 1));
        setSearchParams(searchParams);
    };

    return (
        <div className="students">
            {editingStudent && <EditStudentModal closeModal={() => setEditingStudent(null)} student={editingStudent} />}
            {error && <Alert type={ALERT.ERROR}>{error}</Alert>}
            {isLoading && <Loader className="students__loader" />}
            {!error && !isLoading && students.length < 1 && (
                <Alert type={ALERT.INFO}>На текущий момент нет ни одной записи.</Alert>
            )}
            {!error && !isLoading && students.length > 1 && (
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
                                    students.map((student) => (
                                        <TableBodyRow
                                            key={student.studentId}
                                            onClick={(event) => handleOpenEditing(event, student)}
                                        >
                                            <TableBodyCell>{student.studentId}</TableBodyCell>
                                            <TableBodyCell>{student.fullName}</TableBodyCell>
                                            <TableBodyCell>{student.subdepartmentName}</TableBodyCell>
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

export default StudentsComponent;
