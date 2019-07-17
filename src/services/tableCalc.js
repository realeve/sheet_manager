import * as lib from '../utils/math';
import * as util from '../utils/lib';
import * as setting from '../utils/setting';
const R = require('ramda');

export const initState = (props, loadSetting = true) => {
  let { dataSrc, loading, subTitle } = props;

  let header = dataSrc.header || [];
  header = header.map((label, value) => ({
    label,
    value,
  }));

  let tblData = lib.restoreDataSrc(dataSrc) || [];
  let calHeaders = getHeaders(tblData);
  let fieldSetting = loadCalcSetting(tblData);
  if (!fieldSetting) {
    fieldSetting = {
      fieldList: [],
      operatorList: [0, 1, 2],
      groupList: [],
    };
  }

  return {
    ...calHeaders,
    dataSrc,
    tblData,
    header,
    loading,
    subTitle,
    ...fieldSetting,
    dataSource: [],
  };
};

const getHeaders = dataSrc => {
  let { header, data } = dataSrc;
  if (header.length === 0) {
    return [];
  }
  if (data.length === 0) {
    return header;
  }
  let regData = data[0];
  let fieldHeader = [];
  let groupHeader = [];
  header.forEach(item => {
    let headerItem = regData[item] || '';
    if (headerItem.length === 0) {
      fieldHeader.push(item);
      groupHeader.push(item);
      return;
    }
    if (util.isNumOrFloat(headerItem) && !util.isDateTime(headerItem)) {
      groupHeader.push(item);
    } else {
      fieldHeader.push(item);
    }
  });
  fieldHeader = fieldHeader.map((label, value) => ({
    label,
    value,
  }));
  groupHeader = groupHeader.map((label, value) => ({
    label,
    value,
  }));
  return {
    fieldHeader,
    groupHeader,
  };
};

export const updateState = (props, { fieldList, operatorList, groupList }) => {
  let nextState = initState(props, false);

  let state = Object.assign(nextState, {
    fieldList,
    operatorList,
    groupList,
  });
  let dataSource = getDataSourceWithState(state);
  return Object.assign(state, {
    dataSource,
  });
};

const loadCalcSetting = ({ api_id }) => {
  if (R.isNil(api_id)) {
    return false;
  }

  let key = setting.lsKeys.calSetting + api_id;
  let data = window.localStorage.getItem(key);
  if (R.isNil(data)) {
    return false;
  }
  return JSON.parse(data);
};

export const getDataSourceWithState = state => {
  let { tblData, groupList, fieldList, operatorList, fieldHeader, groupHeader } = state;

  return lib.groupArr({
    dataSrc: tblData,
    groupFields: groupList,
    calFields: fieldList,
    operatorList,
    fieldHeader,
    groupHeader,
  });
};
