import React from "react";
import EditDepartmentModal from "../../../components/modals/EditDepartmentModal";
import Pagination from "../../../components/Pagination";
import Table from "../../../components/Table";
import TableBodyRow from "../../../components/Table/TableBodyRow";
import TableBodyCell from "../../../components/Table/TableBodyRow/TableBodyCell";
import TableHead from "../../../components/Table/TableHead";
import TableHeadCell from "../../../components/Table/TableHead/TableHeadCell";
import useLockedBody from "../../../hooks/useLockedBody";

import "./styles.scss";

const Departments: React.FC = () => {
    const [isEditing, setIsEditing] = React.useState(false);
    useLockedBody(isEditing);

    const handleOpenEditing = (event: React.MouseEvent<HTMLTableRowElement>) => {
        event.stopPropagation();
        setIsEditing(true);
    };

    return (
        <div className="departments">
            {isEditing && <EditDepartmentModal setIsActive={setIsEditing} />}
            <div className="departments__table-wrapper">
                <Table className="departments__table">
                    <TableHead>
                        <TableHeadCell>Номер отдела</TableHeadCell>
                        <TableHeadCell>Название отдела</TableHeadCell>
                    </TableHead>
                    <tbody>
                        <TableBodyRow onClick={handleOpenEditing}>
                            <TableBodyCell>1</TableBodyCell>
                            <TableBodyCell>Слесари</TableBodyCell>
                        </TableBodyRow>
                        <TableBodyRow onClick={handleOpenEditing}>
                            <TableBodyCell>2</TableBodyCell>
                            <TableBodyCell>Водители</TableBodyCell>
                        </TableBodyRow>
                        <TableBodyRow onClick={handleOpenEditing}>
                            <TableBodyCell>3</TableBodyCell>
                            <TableBodyCell>Монтажники</TableBodyCell>
                        </TableBodyRow>
                        <TableBodyRow onClick={handleOpenEditing}>
                            <TableBodyCell>3</TableBodyCell>
                            <TableBodyCell>Монтажники</TableBodyCell>
                        </TableBodyRow>
                        <TableBodyRow onClick={handleOpenEditing}>
                            <TableBodyCell>1</TableBodyCell>
                            <TableBodyCell>Слесари</TableBodyCell>
                        </TableBodyRow>
                        <TableBodyRow onClick={handleOpenEditing}>
                            <TableBodyCell>2</TableBodyCell>
                            <TableBodyCell>Водители</TableBodyCell>
                        </TableBodyRow>
                        <TableBodyRow onClick={handleOpenEditing}>
                            <TableBodyCell>3</TableBodyCell>
                            <TableBodyCell>Монтажники</TableBodyCell>
                        </TableBodyRow>
                        <TableBodyRow onClick={handleOpenEditing}>
                            <TableBodyCell>3</TableBodyCell>
                            <TableBodyCell>Монтажники</TableBodyCell>
                        </TableBodyRow>
                        <TableBodyRow onClick={handleOpenEditing}>
                            <TableBodyCell>1</TableBodyCell>
                            <TableBodyCell>Слесари</TableBodyCell>
                        </TableBodyRow>
                        <TableBodyRow onClick={handleOpenEditing}>
                            <TableBodyCell>2</TableBodyCell>
                            <TableBodyCell>Водители</TableBodyCell>
                        </TableBodyRow>
                        <TableBodyRow onClick={handleOpenEditing}>
                            <TableBodyCell>3</TableBodyCell>
                            <TableBodyCell>Монтажники</TableBodyCell>
                        </TableBodyRow>
                        <TableBodyRow onClick={handleOpenEditing}>
                            <TableBodyCell>3</TableBodyCell>
                            <TableBodyCell>Монтажники</TableBodyCell>
                        </TableBodyRow>
                    </tbody>
                </Table>
            </div>
            <Pagination className="departments__pagination" />
        </div>
    );
};

export default Departments;
