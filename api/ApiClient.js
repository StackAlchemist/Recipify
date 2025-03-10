const { default: axios } = require("axios");
const { ApiRoutes } = require("./ApiRoutes");
export const API = axios.create({
    baseURL: ApiRoutes.BASE_URL
})