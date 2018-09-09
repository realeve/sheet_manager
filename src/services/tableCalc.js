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
    groupList
}) => {
    let nextState = initState(props);

    let state = Object.assign(nextState, {
        fieldList,
        operatorList,
        groupList
    })
    let dataSource = getDataSourceWithState(state);
    return Object.assign(state, {
        dataSource
    })
}

export const getDataSourceWithState = state => {
    let {
        dataSrc,
        groupList,
        fieldList,
        operatorList
    } = state;
    return lib.groupArr({
        dataSrc,
        groupFields: groupList,
        calFields: fieldList,
        operatorList
    });
}