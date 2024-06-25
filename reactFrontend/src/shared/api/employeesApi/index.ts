import { deleteFx } from "./delete";
import { fetchFx } from "./fetch";
import { fetchByNameFx } from "./fetchByName";
import { postFx } from "./post";
import { putFx } from "./put";

const employeeApi = { fetchFx, fetchByNameFx, postFx, putFx, deleteFx };

export default employeeApi;
