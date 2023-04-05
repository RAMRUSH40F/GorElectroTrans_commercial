import React from "react";
import EditAttendanceModal from "../../../components/modals/EditAttendanceModal";
import Pagination from "../../../components/Pagination";
import Table from "../../../components/Table";
import TableBodyRow from "../../../components/Table/TableBodyRow";
import TableBodyCell from "../../../components/Table/TableBodyRow/TableBodyCell";
import TableHead from "../../../components/Table/TableHead";
import TableHeadCell from "../../../components/Table/TableHead/TableHeadCell";
import useLockedBody from "../../../hooks/useLockedBody";

import "./styles.scss";

const Attendance: React.FC = () => {
    const [isEditing, setIsEditing] = React.useState(false);
    useLockedBody(isEditing);

    const handleOpenEditing = (event: React.MouseEvent<HTMLTableRowElement>) => {
        event.stopPropagation();
        setIsEditing(true);
    };

    return (
        <div className="attendance">
            {isEditing && <EditAttendanceModal setIsActive={setIsEditing} />}
            <div className="attendance__table-wrapper">
                <Table className="attendance__table">
                    <TableHead>
                        <TableHeadCell>Номер занятия</TableHeadCell>
                        <TableHeadCell>Фамилия И.О</TableHeadCell>
                        <TableHeadCell>Отдел</TableHeadCell>
                        <TableHeadCell>Дата</TableHeadCell>
                        <TableHeadCell>Зачет/Незачет</TableHeadCell>
                        <TableHeadCell>Тема занятия</TableHeadCell>
                        <TableHeadCell>Кол-во часов</TableHeadCell>
                    </TableHead>
                    <tbody>
                        <TableBodyRow onClick={handleOpenEditing}>
                            <TableBodyCell>1</TableBodyCell>
                            <TableBodyCell>Иванов И.В</TableBodyCell>
                            <TableBodyCell>Слесари</TableBodyCell>
                            <TableBodyCell>13.01.2023</TableBodyCell>
                            <TableBodyCell>Зачет</TableBodyCell>
                            <TableBodyCell>
                                «Демонтаж и ремонт тягового электродвигателя троллейбусов с увеличенным автономным ходом
                                производства»
                            </TableBodyCell>
                            <TableBodyCell>1.5</TableBodyCell>
                        </TableBodyRow>
                        <TableBodyRow onClick={handleOpenEditing}>
                            <TableBodyCell>1</TableBodyCell>
                            <TableBodyCell>Иванов И.В</TableBodyCell>
                            <TableBodyCell>Слесари</TableBodyCell>
                            <TableBodyCell>13.01.2023</TableBodyCell>
                            <TableBodyCell>Зачет</TableBodyCell>
                            <TableBodyCell>
                                «Демонтаж и ремонт тягового электродвигателя троллейбусов с увеличенным автономным ходом
                                производства»
                            </TableBodyCell>
                            <TableBodyCell>1.5</TableBodyCell>
                        </TableBodyRow>
                        <TableBodyRow onClick={handleOpenEditing}>
                            <TableBodyCell>1</TableBodyCell>
                            <TableBodyCell>Иванов И.В</TableBodyCell>
                            <TableBodyCell>Слесари</TableBodyCell>
                            <TableBodyCell>13.01.2023</TableBodyCell>
                            <TableBodyCell>Зачет</TableBodyCell>
                            <TableBodyCell>
                                «Демонтаж и ремонт тягового электродвигателя троллейбусов с увеличенным автономным ходом
                                производства»
                            </TableBodyCell>
                            <TableBodyCell>1.5</TableBodyCell>
                        </TableBodyRow>
                        <TableBodyRow onClick={handleOpenEditing}>
                            <TableBodyCell>1</TableBodyCell>
                            <TableBodyCell>Иванов И.В</TableBodyCell>
                            <TableBodyCell>Слесари</TableBodyCell>
                            <TableBodyCell>13.01.2023</TableBodyCell>
                            <TableBodyCell>Зачет</TableBodyCell>
                            <TableBodyCell>
                                «Демонтаж и ремонт тягового электродвигателя троллейбусов с увеличенным автономным ходом
                                производства»
                            </TableBodyCell>
                            <TableBodyCell>1.5</TableBodyCell>
                        </TableBodyRow>
                        <TableBodyRow onClick={handleOpenEditing}>
                            <TableBodyCell>1</TableBodyCell>
                            <TableBodyCell>Иванов И.В</TableBodyCell>
                            <TableBodyCell>Слесари</TableBodyCell>
                            <TableBodyCell>13.01.2023</TableBodyCell>
                            <TableBodyCell>Зачет</TableBodyCell>
                            <TableBodyCell>
                                «Демонтаж и ремонт тягового электродвигателя троллейбусов с увеличенным автономным ходом
                                производства»
                            </TableBodyCell>
                            <TableBodyCell>1.5</TableBodyCell>
                        </TableBodyRow>
                        <TableBodyRow onClick={handleOpenEditing}>
                            <TableBodyCell>1</TableBodyCell>
                            <TableBodyCell>Иванов И.В</TableBodyCell>
                            <TableBodyCell>Слесари</TableBodyCell>
                            <TableBodyCell>13.01.2023</TableBodyCell>
                            <TableBodyCell>Зачет</TableBodyCell>
                            <TableBodyCell>
                                «Демонтаж и ремонт тягового электродвигателя троллейбусов с увеличенным автономным ходом
                                производства»
                            </TableBodyCell>
                            <TableBodyCell>1.5</TableBodyCell>
                        </TableBodyRow>
                        <TableBodyRow onClick={handleOpenEditing}>
                            <TableBodyCell>1</TableBodyCell>
                            <TableBodyCell>Иванов И.В</TableBodyCell>
                            <TableBodyCell>Слесари</TableBodyCell>
                            <TableBodyCell>13.01.2023</TableBodyCell>
                            <TableBodyCell>Зачет</TableBodyCell>
                            <TableBodyCell>
                                «Демонтаж и ремонт тягового электродвигателя троллейбусов с увеличенным автономным ходом
                                производства»
                            </TableBodyCell>
                            <TableBodyCell>1.5</TableBodyCell>
                        </TableBodyRow>
                        <TableBodyRow onClick={handleOpenEditing}>
                            <TableBodyCell>1</TableBodyCell>
                            <TableBodyCell>Иванов И.В</TableBodyCell>
                            <TableBodyCell>Слесари</TableBodyCell>
                            <TableBodyCell>13.01.2023</TableBodyCell>
                            <TableBodyCell>Зачет</TableBodyCell>
                            <TableBodyCell>
                                «Демонтаж и ремонт тягового электродвигателя троллейбусов с увеличенным автономным ходом
                                производства»
                            </TableBodyCell>
                            <TableBodyCell>1.5</TableBodyCell>
                        </TableBodyRow>
                        <TableBodyRow onClick={handleOpenEditing}>
                            <TableBodyCell>1</TableBodyCell>
                            <TableBodyCell>Иванов И.В</TableBodyCell>
                            <TableBodyCell>Слесари</TableBodyCell>
                            <TableBodyCell>13.01.2023</TableBodyCell>
                            <TableBodyCell>Зачет</TableBodyCell>
                            <TableBodyCell>
                                «Демонтаж и ремонт тягового электродвигателя троллейбусов с увеличенным автономным ходом
                                производства»
                            </TableBodyCell>
                            <TableBodyCell>1.5</TableBodyCell>
                        </TableBodyRow>
                        <TableBodyRow onClick={handleOpenEditing}>
                            <TableBodyCell>1</TableBodyCell>
                            <TableBodyCell>Иванов И.В</TableBodyCell>
                            <TableBodyCell>Слесари</TableBodyCell>
                            <TableBodyCell>13.01.2023</TableBodyCell>
                            <TableBodyCell>Зачет</TableBodyCell>
                            <TableBodyCell>
                                «Демонтаж и ремонт тягового электродвигателя троллейбусов с увеличенным автономным ходом
                                производства»
                            </TableBodyCell>
                            <TableBodyCell>1.5</TableBodyCell>
                        </TableBodyRow>
                    </tbody>
                </Table>
            </div>
            <Pagination className="attendance__pagination" />
        </div>
    );
};

export default Attendance;
