import jStat from 'jStat';
import * as lib from '../utils/lib';
const R = require('ramda');

export const dataOperator: Array<{ label: string; value: number }> = [
  {
    label: '计数',
    value: 0,
  },
  {
    label: '求和',
    value: 1,
  },
  {
    label: '平均值',
    value: 2,
  },
  {
    label: '最大值',
    value: 3,
  },
  {
    label: '最小值',
    value: 4,
  },
  {
    label: '中位数',
    value: 5,
  },
  {
    label: '标准方差',
    value: 6,
  },
  {
    label: '变异系数',
    value: 7,
  },
  {
    label: '众数',
    value: 8,
  },
];

const group = (array, f) => {
  let groups = {};
  array.forEach(o => {
    let group = JSON.stringify(f(o));
    groups[group] = groups[group] || [];
    groups[group].push(o);
  });
  return R.values(groups);
};

// 对数据做 数据库层面的  group 计算操作
export const groupBy = keys => arr => group(arr, R.pick(keys));

export const restoreDataSrc = dataSrc => {
  let _dataSrc = R.clone(dataSrc);
  let { data, header } = _dataSrc;
  data = R.map(item => {
    delete item['key'];
    let values = R.values(item);
    let obj = {};
    header.forEach((key, id) => {
      obj[key] = values[id]; //.trim();
    });
    return obj;
  })(data);
  return Object.assign(_dataSrc, {
    data,
  });
};

const getSrcHeaderName = (arr, header) =>
  R.compose(R.map(R.prop('label')), R.values, R.pick(arr))(header);

const getOperatorHeader: <T, U>(
  arr: Array<T>,
  operatorLabel: Array<{ label: string; value: U }>
) => Array<{
  fields: T;
  header: string;
  calcType: U;
}> = (arr, operatorLabel) => {
  let res = arr.map(fields =>
    operatorLabel.map(({ label, value }) => ({
      fields,
      header: `${fields}(${label})`,
      calcType: value,
    }))
  );
  return R.flatten(res);
};

export const groupArr = ({
  groupFields,
  calFields,
  dataSrc,
  operatorList,
  fieldHeader,
  groupHeader,
}) => {
  let { data, rows } = dataSrc;
  if (rows === 0) {
    return dataSrc;
  }
  let calFieldHeader = getSrcHeaderName(calFields, fieldHeader);
  let groupFieldsHeader = getSrcHeaderName(groupFields, groupHeader);

  let headerFields = R.concat(calFieldHeader, groupFieldsHeader);

  data = R.map(item => R.pick(headerFields)(item))(data);
  data = groupBy(calFieldHeader)(data);

  // 是否有计数操作
  let hasCountOperation = operatorList.includes(0);
  if (hasCountOperation) {
    operatorList = R.reject(R.equals(0))(operatorList);
  }

  let operatorLabel = R.map(id => dataOperator[id])(operatorList);

  let operatorHeader = getOperatorHeader(
    groupFieldsHeader.length > 0 ? groupFieldsHeader : calFieldHeader,
    operatorLabel
  );

  if (hasCountOperation) {
    operatorHeader.push({
      fields: groupFieldsHeader[0] || calFieldHeader[0],
      header: '计数',
      calcType: 0,
    });
  }

  let _header = R.clone(calFieldHeader);
  // 计算新的header信息
  operatorHeader.forEach(({ header }) => {
    _header.push(header);
  });

  let calData = data.map(item => handleDataItem(item, operatorHeader, calFieldHeader));
  calData = R.flatten(calData);
  rows = calData.length;

  // 将数据中的对象重新转换为数组
  calData = calData.map(item => _header.map(key => item[key]));
  calData = calData.sort((a, b) => a[0] - b[0]);
  return Object.assign({}, dataSrc, {
    data: calData,
    header: _header,
    rows,
    hash: Math.random() + '',
  });
};

const handleDataItem = (data, operator, calFields) => {
  let result = R.pick(calFields)(data[0]);
  let cachedColName = R.uniq(getCol(operator, 'fields'));
  let cache = {};
  cachedColName.forEach(col => {
    cache[col] = getCol(data, col);
  });
  operator.forEach(({ fields, header, calcType }) => {
    let cacheItem = cache[fields].map(item =>
      lib.isFloat(item) ? parseFloat(item) : Number(item)
    );

    let res = '';
    switch (calcType) {
      case 0:
        res = jStat.rows(cacheItem);
        break;
      case 1:
        res = jStat.sum(cacheItem);
        break;
      case 2:
        res = jStat.mean(cacheItem);
        res = parseFloat(res).toFixed(3);
        break;
      case 3:
        res = jStat.max(cacheItem);
        break;
      case 4:
        res = jStat.min(cacheItem);
        break;
      case 5:
        res = jStat.median(cacheItem);
        break;
      case 6:
        res = jStat.stdev(cacheItem).toFixed(3);
        break;
      case 7:
        res = jStat.coeffvar(cacheItem).toFixed(3);
        break;
      case 8:
      default:
        res = jStat.mode(cacheItem);
        if (res.length > 0) {
          res = '';
        }
        break;
    }
    result[header] = res;
  });
  return result;
};

let getCol = (data, col) => R.map(R.prop(col))(data);
// let getSum = data => R.reduce(R.add, 0)(data);
// let getCount = data => data.length;
// let getMax = data => R.reduce(R.max, data[0])(data);
// let getMin = data => R.reduce(R.min, data[0])(data);
// let getMean = data => R.mean(data);
// let getMedian = data => R.median(data)

export interface SPC {
  cl: number;
  lcl: number;
  ucl: number;
  sigma: number;
}
export type GetSPC = (arr: number[], ratio?: number) => SPC;

export const getSPC: GetSPC = (arr, ratio = 3) => {
  let cl: number = 0,
    ucl: number = 0,
    lcl: number = 0;

  let resCl: number = jStat.mean(arr);
  cl = parseFloat(parseFloat(String(resCl)).toFixed(3));
  let sigma: number = jStat.stdev(arr);
  lcl = cl - ratio * sigma;
  ucl = cl + ratio * sigma;
  return {
    cl,
    ucl: parseFloat(ucl.toFixed(3)),
    lcl: parseFloat(lcl.toFixed(3)),
    sigma,
  };
};
