import qs from 'qs';
import * as util from './lib';
import jStat from 'jStat';

export interface TableSetting {
  prefix?: string;
  suffix?: string;
  interval?: string;
  autoid?: string | boolean;
  merge?: string;
  mergetext?: string;
  mergedRows?: number[];
  [key: string]: any;
}

export interface Config {
  creator?: string;
  lastModifiedBy?: string;
  created?: string;
  modified?: string;
  lastPrinted?: string;
  params?: TableSetting;
  [key: string]: any;
}

export interface MergeRes {
  merge: string[];
  mergetext: string[];
}

export const handleMerge: (param: TableSetting) => MergeRes = ({ merge, mergetext, autoid }) => {
  merge = merge || [];
  mergetext = mergetext || [];

  let mergeType: string = util.getType(merge);
  switch (mergeType) {
    case 'string':
      merge = [merge];
      break;
    default:
      break;
  }

  // 先处理merge字段
  // merge字段定义 2-3,2-5,7-8
  let mergeArr = merge.map((item: string) => {
    let arr = item.split('-').sort();
    return arr.map(col => parseInt(col, 10) + (autoid ? 2 : 1));
  });

  switch (util.getType(mergetext)) {
    case 'undefined':
      mergetext = [''];
      break;
    case 'string':
      mergetext = [mergetext];
      break;
    default:
      break;
  }

  // 记录合并单元格
  let mergedRows = [];
  mergeArr.forEach(([start, end]) => {
    mergedRows = [...mergedRows, ...jStat.arange(start, end + 1)].sort();
  });

  mergeArr = mergeArr.sort((a, b) => a[0] - b[0]);

  return {
    mergetext,
    merge: mergeArr,
    mergedRows,
  };
};

const initQueryParam = params => {
  params.interval = params.interval || 5; //隔行背景色
  params.interval = Math.max(parseInt(params.interval, 10), 2);
  params.autoid = !params.autoid == '0'; // 填充第一列序号
  return params;
};

export const getParams = config => {
  let params = initQueryParam(config);
  return Object.assign(params, handleMerge(params));
};
