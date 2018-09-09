import * as lib from "../utils/math";
const R = require("ramda");

export const initState = props => {
    let {
        dataSrc,
        loading,
        subTitle
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
        subTitle,
        fieldList: [],
        operatorList: [0, 1, 2],
        groupList: [],
        dataSource: []
    }
}

export const updateState = (props, {
    fieldList,
    operatorList,
    groupList,
    loading,
    subTitle,
    dataSource
}) => {
    let nextState = initState(props);
    return Object.assign(nextState, {
        fieldList,
        operatorList,
        groupList,
        loading,
        subTitle,
        dataSource
    })
}