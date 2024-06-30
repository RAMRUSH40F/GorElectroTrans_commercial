import { deleteFx } from "./delete";
import { fetchFx } from "./fetch";
import { fetchPlanReportFx } from "./fetchReport";
import { postFx } from "./post";
import { putFx } from "./put";

const planApi = { fetchFx, postFx, putFx, deleteFx, fetchPlanReportFx };

export default planApi;
