import * as lib from "../utils/math";
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
        dataSrc: lib.restoreDataSrc(dataSrc) || [],
        header,
        loading,
        fieldList: [],
        operatorList: [0, 1, 2],
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