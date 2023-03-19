import React from "react";
import EditStudentModal from "../../../components/modals/EditStudentModal";
import Pagination from "../../../components/Pagination";
import Table from "../../../components/Table";
import TableBodyRow from "../../../components/Table/TableBodyRow";
import TableBodyCell from "../../../components/Table/TableBodyRow/TableBodyCell";
import TableHead from "../../../components/Table/TableHead";
import TableHeadCell from "../../../components/Table/TableHead/TableHeadCell";
import useLockedBody from "../../../hooks/useLockedBody";

import "./styles.scss";

const Students: React.FC = () => {
    const [isEditing, setIsEditing] = React.useState(false);
    useLockedBody(isEditing);

    const handleOpenEditing = (event: React.MouseEvent<HTMLTableRowElement>) => {
        event.stopPropagation();
        setIsEditing(true);
    };

    return (
        <div className="students">
            {isEditing && <EditStudentModal setIsActive={setIsEditing} />}
            <div className="students__table-wrapper">
                <Table className="students__table">
                    <TableHead>
                        <TableHeadCell>Табельный номер</TableHeadCell>
                        <TableHeadCell>Фамилия И.О</TableHeadCell>
                        <TableHeadCell>Отдел</TableHeadCell>
                    </TableHead>
                    <tbody>
                        <TableBodyRow onClick={handleOpenEditing}>
                            <TableBodyCell>0254252</TableBodyCell>
                            <TableBodyCell>Иванов А.И</TableBodyCell>
                            <TableBodyCell>Водитель</TableBodyCell>
                        </TableBodyRow>
                        <TableBodyRow onClick={handleOpenEditing}>
                            <TableBodyCell>0254252</TableBodyCell>
                            <TableBodyCell>Иванов А.И</TableBodyCell>
                            <TableBodyCell>Водитель</TableBodyCell>
                        </TableBodyRow>
                        <TableBodyRow onClick={handleOpenEditing}>
                            <TableBodyCell>0254252</TableBodyCell>
                            <TableBodyCell>Иванов А.И</TableBodyCell>
                            <TableBodyCell>Водитель</TableBodyCell>
                        </TableBodyRow>
                        <TableBodyRow onClick={handleOpenEditing}>
                            <TableBodyCell>0254252</TableBodyCell>
                            <TableBodyCell>Иванов А.И</TableBodyCell>
                            <TableBodyCell>Водитель</TableBodyCell>
                        </TableBodyRow>
                        <TableBodyRow onClick={handleOpenEditing}>
                            <TableBodyCell>0254252</TableBodyCell>
                            <TableBodyCell>Иванов А.И</TableBodyCell>
                            <TableBodyCell>Водитель</TableBodyCell>
                        </TableBodyRow>
                        <TableBodyRow onClick={handleOpenEditing}>
                            <TableBodyCell>0254252</TableBodyCell>
                            <TableBodyCell>Иванов А.И</TableBodyCell>
                            <TableBodyCell>Водитель</TableBodyCell>
                        </TableBodyRow>
                        <TableBodyRow onClick={handleOpenEditing}>
                            <TableBodyCell>0254252</TableBodyCell>
                            <TableBodyCell>Иванов А.И</TableBodyCell>
                            <TableBodyCell>Водитель</TableBodyCell>
                        </TableBodyRow>
                        <TableBodyRow onClick={handleOpenEditing}>
                            <TableBodyCell>0254252</TableBodyCell>
                            <TableBodyCell>Иванов А.И</TableBodyCell>
                            <TableBodyCell>Водитель</TableBodyCell>
                        </TableBodyRow>
                        <TableBodyRow onClick={handleOpenEditing}>
                            <TableBodyCell>0254252</TableBodyCell>
                            <TableBodyCell>Иванов А.И</TableBodyCell>
                            <TableBodyCell>Водитель</TableBodyCell>
                        </TableBodyRow>
                        <TableBodyRow onClick={handleOpenEditing}>
                            <TableBodyCell>0254252</TableBodyCell>
                            <TableBodyCell>Иванов А.И</TableBodyCell>
                            <TableBodyCell>Водитель</TableBodyCell>
                        </TableBodyRow>
                        <TableBodyRow onClick={handleOpenEditing}>
                            <TableBodyCell>0254252</TableBodyCell>
                            <TableBodyCell>Иванов А.И</TableBodyCell>
                            <TableBodyCell>Водитель</TableBodyCell>
                        </TableBodyRow>
                        <TableBodyRow onClick={handleOpenEditing}>
                            <TableBodyCell>0254252</TableBodyCell>
                            <TableBodyCell>Иванов А.И</TableBodyCell>
                            <TableBodyCell>Водитель</TableBodyCell>
                        </TableBodyRow>
                    </tbody>
                </Table>
            </div>
            <Pagination className="students__pagination" />
        </div>
    );
};

export default Students;
