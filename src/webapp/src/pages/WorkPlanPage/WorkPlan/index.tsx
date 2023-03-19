import React from "react";
import Table from "../../../components/Table";
import TableBodyRow from "../../../components/Table/TableBodyRow";
import TableBodyCell from "../../../components/Table/TableBodyRow/TableBodyCell";
import TableHead from "../../../components/Table/TableHead";
import TableHeadCell from "../../../components/Table/TableHead/TableHeadCell";
import Pagination from "../../../components/Pagination";
import EditWorkPlanModal from "../../../components/modals/EditWorkPlanModal";
import useLockedBody from "../../../hooks/useLockedBody";

import "./styles.scss";

const WorkPlan: React.FC = () => {
    const [isEditing, setIsEditing] = React.useState(false);
    useLockedBody(isEditing);

    const handleOpenEditing = (event: React.MouseEvent<HTMLTableRowElement>) => {
        event.stopPropagation();
        setIsEditing(true);
    };

    return (
        <div className="work-plan">
            {isEditing && <EditWorkPlanModal setIsActive={setIsEditing} />}
            <div className="work-plan__table-wrapper">
                <Table className="work-plan__table">
                    <TableHead>
                        <TableHeadCell>Номер занятия</TableHeadCell>
                        <TableHeadCell>Тема занятия</TableHeadCell>
                        <TableHeadCell>Длительность занятия</TableHeadCell>
                        <TableHeadCell>Кол-во обучающихся</TableHeadCell>
                        <TableHeadCell>Дата</TableHeadCell>
                        <TableHeadCell>Преподаватель</TableHeadCell>
                    </TableHead>
                    <tbody>
                        <TableBodyRow onClick={handleOpenEditing}>
                            <TableBodyCell>1</TableBodyCell>
                            <TableBodyCell>
                                «Демонтаж и ремонт тягового электродвигателя троллейбусов с увеличенным автономным ходом
                                производства»
                            </TableBodyCell>
                            <TableBodyCell>1</TableBodyCell>
                            <TableBodyCell>52</TableBodyCell>
                            <TableBodyCell>13.01.2023</TableBodyCell>
                            <TableBodyCell>Старший мастер цеха Петров А.А</TableBodyCell>
                        </TableBodyRow>
                        <TableBodyRow onClick={handleOpenEditing}>
                            <TableBodyCell>1</TableBodyCell>
                            <TableBodyCell>
                                «Демонтаж и ремонт тягового электродвигателя троллейбусов с увеличенным автономным ходом
                                производства»
                            </TableBodyCell>
                            <TableBodyCell>1</TableBodyCell>
                            <TableBodyCell>52</TableBodyCell>
                            <TableBodyCell>13.01.2023</TableBodyCell>
                            <TableBodyCell>Старший мастер цеха Петров А.А</TableBodyCell>
                        </TableBodyRow>
                        <TableBodyRow onClick={handleOpenEditing}>
                            <TableBodyCell>1</TableBodyCell>
                            <TableBodyCell>
                                «Демонтаж и ремонт тягового электродвигателя троллейбусов с увеличенным автономным ходом
                                производства»
                            </TableBodyCell>
                            <TableBodyCell>1</TableBodyCell>
                            <TableBodyCell>52</TableBodyCell>
                            <TableBodyCell>13.01.2023</TableBodyCell>
                            <TableBodyCell>Старший мастер цеха Петров А.А</TableBodyCell>
                        </TableBodyRow>
                        <TableBodyRow onClick={handleOpenEditing}>
                            <TableBodyCell>1</TableBodyCell>
                            <TableBodyCell>
                                «Демонтаж и ремонт тягового электродвигателя троллейбусов с увеличенным автономным ходом
                                производства»
                            </TableBodyCell>
                            <TableBodyCell>1</TableBodyCell>
                            <TableBodyCell>52</TableBodyCell>
                            <TableBodyCell>13.01.2023</TableBodyCell>
                            <TableBodyCell>Старший мастер цеха Петров А.А</TableBodyCell>
                        </TableBodyRow>
                        <TableBodyRow onClick={handleOpenEditing}>
                            <TableBodyCell>1</TableBodyCell>
                            <TableBodyCell>
                                «Демонтаж и ремонт тягового электродвигателя троллейбусов с увеличенным автономным ходом
                                производства»
                            </TableBodyCell>
                            <TableBodyCell>1</TableBodyCell>
                            <TableBodyCell>52</TableBodyCell>
                            <TableBodyCell>13.01.2023</TableBodyCell>
                            <TableBodyCell>Старший мастер цеха Петров А.А</TableBodyCell>
                        </TableBodyRow>
                        <TableBodyRow onClick={handleOpenEditing}>
                            <TableBodyCell>1</TableBodyCell>
                            <TableBodyCell>
                                «Демонтаж и ремонт тягового электродвигателя троллейбусов с увеличенным автономным ходом
                                производства»
                            </TableBodyCell>
                            <TableBodyCell>1</TableBodyCell>
                            <TableBodyCell>52</TableBodyCell>
                            <TableBodyCell>13.01.2023</TableBodyCell>
                            <TableBodyCell>Старший мастер цеха Петров А.А</TableBodyCell>
                        </TableBodyRow>
                        <TableBodyRow onClick={handleOpenEditing}>
                            <TableBodyCell>1</TableBodyCell>
                            <TableBodyCell>
                                «Демонтаж и ремонт тягового электродвигателя троллейбусов с увеличенным автономным ходом
                                производства»
                            </TableBodyCell>
                            <TableBodyCell>1</TableBodyCell>
                            <TableBodyCell>52</TableBodyCell>
                            <TableBodyCell>13.01.2023</TableBodyCell>
                            <TableBodyCell>Старший мастер цеха Петров А.А</TableBodyCell>
                        </TableBodyRow>
                        <TableBodyRow onClick={handleOpenEditing}>
                            <TableBodyCell>1</TableBodyCell>
                            <TableBodyCell>
                                «Демонтаж и ремонт тягового электродвигателя троллейбусов с увеличенным автономным ходом
                                производства»
                            </TableBodyCell>
                            <TableBodyCell>1</TableBodyCell>
                            <TableBodyCell>52</TableBodyCell>
                            <TableBodyCell>13.01.2023</TableBodyCell>
                            <TableBodyCell>Старший мастер цеха Петров А.А</TableBodyCell>
                        </TableBodyRow>
                        <TableBodyRow onClick={handleOpenEditing}>
                            <TableBodyCell>1</TableBodyCell>
                            <TableBodyCell>
                                «Демонтаж и ремонт тягового электродвигателя троллейбусов с увеличенным автономным ходом
                                производства»
                            </TableBodyCell>
                            <TableBodyCell>1</TableBodyCell>
                            <TableBodyCell>52</TableBodyCell>
                            <TableBodyCell>13.01.2023</TableBodyCell>
                            <TableBodyCell>Старший мастер цеха Петров А.А</TableBodyCell>
                        </TableBodyRow>
                        <TableBodyRow onClick={handleOpenEditing}>
                            <TableBodyCell>1</TableBodyCell>
                            <TableBodyCell>
                                «Демонтаж и ремонт тягового электродвигателя троллейбусов с увеличенным автономным ходом
                                производства»
                            </TableBodyCell>
                            <TableBodyCell>1</TableBodyCell>
                            <TableBodyCell>52</TableBodyCell>
                            <TableBodyCell>13.01.2023</TableBodyCell>
                            <TableBodyCell>Старший мастер цеха Петров А.А</TableBodyCell>
                        </TableBodyRow>
                        <TableBodyRow onClick={handleOpenEditing}>
                            <TableBodyCell>1</TableBodyCell>
                            <TableBodyCell>
                                «Демонтаж и ремонт тягового электродвигателя троллейбусов с увеличенным автономным ходом
                                производства»
                            </TableBodyCell>
                            <TableBodyCell>1</TableBodyCell>
                            <TableBodyCell>52</TableBodyCell>
                            <TableBodyCell>13.01.2023</TableBodyCell>
                            <TableBodyCell>Старший мастер цеха Петров А.А</TableBodyCell>
                        </TableBodyRow>
                        <TableBodyRow onClick={handleOpenEditing}>
                            <TableBodyCell>1</TableBodyCell>
                            <TableBodyCell>
                                «Демонтаж и ремонт тягового электродвигателя троллейбусов с увеличенным автономным ходом
                                производства»
                            </TableBodyCell>
                            <TableBodyCell>1</TableBodyCell>
                            <TableBodyCell>52</TableBodyCell>
                            <TableBodyCell>13.01.2023</TableBodyCell>
                            <TableBodyCell>Старший мастер цеха Петров А.А</TableBodyCell>
                        </TableBodyRow>
                        <TableBodyRow onClick={handleOpenEditing}>
                            <TableBodyCell>1</TableBodyCell>
                            <TableBodyCell>
                                «Демонтаж и ремонт тягового электродвигателя троллейбусов с увеличенным автономным ходом
                                производства»
                            </TableBodyCell>
                            <TableBodyCell>1</TableBodyCell>
                            <TableBodyCell>52</TableBodyCell>
                            <TableBodyCell>13.01.2023</TableBodyCell>
                            <TableBodyCell>Старший мастер цеха Петров А.А</TableBodyCell>
                        </TableBodyRow>
                    </tbody>
                </Table>
            </div>
            <Pagination className="work-plan__pagination" />
        </div>
    );
};

export default WorkPlan;
