import axios from "axios";

export const api = axios.create({
    baseURL: "http://82.146.38.158:8081",
});
