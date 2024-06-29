import { deleteFx } from "./delete";
import { fetchFx } from "./fetch";
import { fetchByNameFx } from "./fetchByName";
import { fetchTemplateFx } from "./fetchTemplate";
import { postFx } from "./post";
import { putFx } from "./put";
import { uploadEmployeesFx } from "./uploadEmployees";

const employeeApi = {
    fetchFx,
    fetchByNameFx,
    postFx,
    putFx,
    deleteFx,
    fetchTemplateFx,
    uploadEmployeesFx,
};

export default employeeApi;
