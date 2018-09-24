import {
    axios
} from "../../utils/axios";

const R = require("ramda");

export const fetchData = async({
        url,
        params
    }) =>
    await axios({
        url,
        params
    });