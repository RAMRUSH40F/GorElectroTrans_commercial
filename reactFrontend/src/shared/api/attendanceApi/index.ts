import { deleteFx } from "./delete";
import { fetchFx } from "./fetch";
import { fetchReportFx } from "./fetchReport";
import { postFx } from "./post";
import { putFx } from "./put";

const attendanceApi = {
    fetchFx,
    postFx,
    putFx,
    deleteFx,
    fetchReportFx,
};

export default attendanceApi;
