import { deleteFx } from "./delete";
import { fetchFx } from "./fetch";
import { postFx } from "./post";
import { putFx } from "./put";

const attendanceApi = {
    fetchFx,
    postFx,
    putFx,
    deleteFx,
};

export default attendanceApi;
