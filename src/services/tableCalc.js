import * as lib from "../utils/lib";
import {
    uploadHost
} from "../utils/axios";
import styles from "../components/Table.less";
import * as setting from "../utils/setting";
const R = require("ramda");

export const initState = props => {
    let {
        dataSrc,
        loading
    } = props;
    let header = dataSrc.header || [];
    header = header.map((label, value) => ({
        label,
        value
    }));
    return {
        dataSrc: dataSrc || [],
        header,
        loading,
        fieldList: [],
        operatorList: [],
        groupList: []
    }
}

export const updateState = (props, {
    fieldList,
    operatorList,
    groupList
}) => {
    let nextState = initState(props);
    return Object.assign(nextState, {
        fieldList,
        operatorList,
        groupList
    })
}