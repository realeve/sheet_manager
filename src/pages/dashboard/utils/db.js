import React from 'react';
import { axios, mock } from '@/utils/axios';
import { DEV } from '@/utils/setting';
import * as R from 'ramda';

// http://cdn.cdyc.cbpm:100/500/f98ac39f1f?blob[]=image_1&blob[]=image_2&blob[]=image_3&blob_type=jpg&cache=0.25
/**
 *   @database: { 质量信息系统 }
 *   @desc:     { 印码机检实时数据 }
 */
export const getViewPrintOnlineQuality = async () => {
  let res = DEV
    ? await mock(require('@/mock/500_f98ac39f1f.json'))
    : await axios({
        url: '/500/f98ac39f1f.json',
      });
  res.data = R.sortBy(R.prop('good_rate'))(res.data);

  return res;
};

/**
 *   @database: { 质量信息系统 }
 *   @desc:     { 实时监测-近期未检情况 }
 */
export const getOnlineinfo = cart =>
  DEV
    ? mock(require('@/mock/501_ff0feed532.json'))
    : axios({
        url: '/501/ff0feed532.json',
        params: {
          cart,
        },
      });

/**
 *   @database: { 接口管理 }
 *   @desc:     { 实时监测-同一工作日生产其它产品 }
 */
export const getOnlineinfoByMachine = async art => {
  let res = DEV
    ? await mock(require('@/mock/502_b4c5a73656.json'))
    : await axios({
        url: '/502/b4c5a73656.json',
        params: {
          art,
        },
      });
  let data = R.clone(res.data);

  res.data2 = data.map((item, idx) => {
    item['好品率'] = Number(item.GoodRate);
    res.data[idx].GoodRate = Number(item.GoodRate);
    item['车号'] = (
      <a href={`/search/#${item['CartNumber']}`} alt={item['CartNumber']} target="_blank">
        {item['CartNumber']}
      </a>
    );
    item['开位'] = item['FormatPos1'];
    item['缺陷条数'] = item['ErrCount1'];
    return item;
  });

  res.header2 = ['车号', '好品率', '开位', '缺陷条数'];
  return res;
};

/**
 *   @database: { 质量信息系统_图像库 }
 *   @desc:     { 码后缺陷图像查询 }
 */
// http://cdn.cdyc.cbpm:100/503/a8dd1e5c75/array?mahou_id=78240&blob[]=0&blob[]=1&blob[]=2&blob_type=jpg
export const getImagedata = mahou_id =>
  DEV
    ? mock(require('@/mock/503_a8dd1e5c75'))
    : axios({
        url: '/503/a8dd1e5c75/array',
        params: {
          mahou_id,
        },
      });
