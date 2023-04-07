import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import Alert from "../../../components/Alert";
import Loader from "../../../components/Loader";
import EditMaterialModal from "../../../components/modals/materials/EditMaterialModal";
import Pagination from "../../../components/Pagination";
import Table from "../../../components/Table";
import TableBodyRow from "../../../components/Table/TableBodyRow";
import TableBodyCell from "../../../components/Table/TableBodyRow/TableBodyCell";
import TableHead from "../../../components/Table/TableHead";
import TableHeadCell from "../../../components/Table/TableHead/TableHeadCell";
import { ALERT } from "../../../constants/alertTypes";
import { useMaterialsContext } from "../../../context/materialsContext";
import { downloadFile } from "../../../helpers/downloadFile";
import { formatDate } from "../../../helpers/formatDate";
import useLockedBody from "../../../hooks/useLockedBody";
import { IMaterial } from "../../../models/Material";
import MaterialService from "../../../services/MaterialService";
import downloadFileIconSrc from "../../../assets/img/download-file-icon.svg";

import "./styles.scss";

const LIMIT = 20;

const Materials: React.FC = () => {
    const [editingMaterial, setEditingMaterial] = React.useState<IMaterial | null>(null);
    useLockedBody(!!editingMaterial);

    const { divisionId = "" } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();

    const { materials, setMaterials } = useMaterialsContext();
    const [isLoading, setIsLoading] = useState(true);
    const [isFetching, setIsFetching] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [page, setPage] = useState<number>(searchParams.get("page") ? Number(searchParams.get("page")) : 1);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        const cancelToken = axios.CancelToken.source();
        setIsFetching(true);
        setError(null);

        const fetchMaterials = async () => {
            try {
                const response = await MaterialService.fetch(divisionId, {
                    params: {
                        page,
                        size: LIMIT,
                    },
                    cancelToken: cancelToken.token,
                });
                console.log(response);
                const materials: IMaterial[] = response.data.map(({ lessonId, date, topic, fileName }) => ({
                    lessonId,
                    date,
                    topic,
                    fileName,
                }));
                console.log(materials);
                const totalMaterials = response.headers["content_count"];
                const totalPages = totalMaterials ? Math.ceil(totalMaterials / LIMIT) : 1;
                setMaterials(materials);
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

        fetchMaterials();

        return () => cancelToken.cancel();
    }, [page, setMaterials, divisionId]);

    const handleOpenEditing = (event: React.MouseEvent<HTMLTableRowElement>, material: IMaterial) => {
        event.stopPropagation();
        setEditingMaterial(material);
    };

    const handleDownLoadMaterials = async (event: React.MouseEvent, fileName: string) => {
        event.stopPropagation();
        try {
            const response = await MaterialService.fetchFile({ depId: divisionId, fileName });
            console.log(response);
            downloadFile(response.data, fileName);
        } catch (error) {
            console.log(error);
        }
    };

    const handlePageChange = (selectedItem: { selected: number }) => {
        setPage(selectedItem.selected);
        searchParams.set("page", String(selectedItem.selected + 1));
        setSearchParams(searchParams);
    };

    return (
        <div className="materials">
            {!!editingMaterial && (
                <EditMaterialModal material={editingMaterial} closeModal={() => setEditingMaterial(null)} />
            )}
            {error && <Alert type={ALERT.ERROR}>{error}</Alert>}
            {isLoading && <Loader className="materials__loader" />}
            {!error && !isLoading && materials.length < 1 && (
                <Alert type={ALERT.INFO}>На текущий момент нет ни одной записи.</Alert>
            )}
            {!error && !isLoading && materials.length > 0 && (
                <>
                    <div className="materials__table-wrapper">
                        <Table className="materials__table">
                            <TableHead>
                                <TableHeadCell>Номер занятия</TableHeadCell>
                                <TableHeadCell>Дата проведения</TableHeadCell>
                                <TableHeadCell>Тема занятия</TableHeadCell>
                                <TableHeadCell>Материалы</TableHeadCell>
                            </TableHead>
                            <tbody
                                className={`materials__table-body ${isFetching && "materials__table-body--opacity"}`}
                            >
                                {materials.map((material) => (
                                    <TableBodyRow
                                        key={material.fileName}
                                        onClick={(event) => handleOpenEditing(event, material)}
                                    >
                                        <TableBodyCell>{material.lessonId}</TableBodyCell>
                                        <TableBodyCell>{formatDate(material.date)}</TableBodyCell>
                                        <TableBodyCell className="materials__table-topic-cell">
                                            {material.topic}
                                        </TableBodyCell>
                                        <TableBodyCell
                                            className="materials__table-file-cell"
                                            onClick={(event) => handleDownLoadMaterials(event, material.fileName)}
                                        >
                                            <div className="materials__download-wrapper">
                                                <span className="materials__table-filename">{material.fileName}</span>
                                                <img
                                                    className="materials__table-download-icon"
                                                    src={downloadFileIconSrc}
                                                    alt="Download"
                                                />
                                            </div>
                                        </TableBodyCell>
                                    </TableBodyRow>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                    {totalPages > 1 && (
                        <Pagination
                            className="materials__pagination"
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

export default Materials;
