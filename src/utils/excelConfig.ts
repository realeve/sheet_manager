import * as R from 'ramda';
import { getType } from './axios';
/**
 * @param prefix 前缀
 * @param suffix 后续
 * @param interval 间隔多少个单元格高亮背景
 * @param autoid 导出数据自动追加编号
 */
export interface BasicConfig {
  prefix?: string;
  suffix?: string;
  interval?: string | number;
  autoid?: string | boolean;
  [key: string]: any;
}

/**
 * @param prefix 前缀
 * @param suffix 后续
 * @param interval 间隔多少个单元格高亮背景
 * @param autoid 导出数据自动追加编号
 * @param merge 需要合并的单元格定义,如：2-3,2-5,7-8
 * @param mergetext 合并单元格对应的文本
 * @param mergedRows 自动计算的结果，有哪些列被合并
 * @param mergesize 合并列宽，默认为2
 */
export interface SrcConfig extends BasicConfig {
  merge?: string[] | string;
  mergetext?: string[] | string;
  mergesize?: string;
  [key: string]: any;
}

type mergeItem = number[];
/**
 * 将TableSetting转换为数据导出所需的格式
 */
export interface DstConfig extends BasicConfig, MergeRes {
  [key: string]: any;
}

export interface Config {
  creator?: string;
  lastModifiedBy?: string;
  created?: string;
  modified?: string;
  lastPrinted?: string;
  params: DstConfig;
  [key: string]: any;
}

export interface MergeRes {
  merge?: mergeItem[] | [];
  mergetext?: string[];
  mergedRows?: number[];
}
/**
 * 处理merge字段
 * @param config 默认配置项，定义为 TableSetting
 * @return mergetext string[]
 * @return merge [number,number] 单元格合并设置
 * @return mergedRows [number] 哪些行需要合并
 */
export const handleMerge: (config: SrcConfig) => MergeRes = config => {
  let { merge, mergetext, autoid, mergesize, mergev } = config;
  let mergeStrArr: string[] = [];

  switch (typeof merge) {
    case 'string':
      mergeStrArr = [merge];
      break;
    case 'undefined':
      mergeStrArr = [];
      break;
    default:
      mergeStrArr = merge;
      break;
  }

  let mergeArr: mergeItem[] = mergeStrArr.map((item: string) => {
    let arr = item
      .split('-')
      .map((col: string): number => Number(col) + 1 + (autoid ? 1 : 0))
      .sort((a, b) => a - b);
    if (arr.length === 1) {
      return [arr[0], arr[0] + (Number(mergesize) - 1)];
    }
    return arr;
  });
  let mergetextArr: string[] = [];
  switch (typeof mergetext) {
    case 'undefined':
      mergetextArr = [''];
      break;
    case 'string':
      mergetextArr = [mergetext];
      break;
    default:
      mergetextArr = mergetext;
      break;
  }

  // 记录合并单元格
  let mergedRows: number[] = [];
  mergeArr.forEach(([start, end]) => {
    mergedRows = [...mergedRows, ...R.range(start, end + 1)].sort();
  });

  mergeArr = mergeArr.sort((a, b) => a[0] - b[0]);

  // 纵向合并
  let mergeVConfig = getType(mergev) === 'undefined' ? [] : splitParam2Arr(mergev);

  return {
    mergetext: mergetextArr,
    merge: mergeArr,
    mergedRows,
    mergev: mergeVConfig,
  };
};

// 处理纵向列合并配置项;
export const splitParam2Arr = param => {
  let config = [];
  switch (getType(param)) {
    case 'string':
      if (param.includes(';')) {
        config = param.split(';');
      } else if (param.includes(',')) {
        config = param.split(',');
      } else if (param.includes('-')) {
        let [start, end] = param.split('-');
        config = R.range(Number(start), Number(end) + 1);
      } else {
        return [Number(param)];
      }
      break;
    case 'array':
      config = param;
      break;
    case 'number':
      return [param];
  }
  config = config.map(splitParam2Arr);
  config = R.flatten(config);
  config = config.map(item => Number(item)).sort((a, b) => a - b);
  return config;
};

/**
 * 初始化查询参数
 */
export const initQueryParam: (params: BasicConfig) => BasicConfig = params => {
  params.interval = params.interval || '5'; //隔行背景色
  params.interval = Math.max(Number(String(params.interval)), 2);
  params.autoid = !R.isNil(params.autoid) && params.autoid != '0'; // 填充第一列序号
  params.mergesize = params.mergesize || '2';
  return params;
};

/**
 * 根据配置项初始化文件导出所需参数
 * @params config 地址栏配置信息如prefix,suffix等
 * @returns TableSetting
 */
export const getParams: DstConfig | any = (config: SrcConfig) => {
  let params: BasicConfig = initQueryParam(config);
  let mergeParam: MergeRes = handleMerge(params);
  return Object.assign(params, mergeParam);
};
