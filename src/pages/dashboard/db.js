import { axios, mock } from '@/utils/axios';
import { DEV } from '@/utils/setting';
import * as R from 'ramda';

// http://cdn.cdyc.cbpm:100/500/f98ac39f1f?blob[]=image_1&blob[]=image_2&blob[]=image_3&blob_type=jpg&cache=0.25
/**
 *   @database: { 质量信息系统 }
 *   @desc:     { 印码机检实时数据 }
 */
export const getViewPrintOnlineQuality = () =>
  DEV
    ? mock(require('@/mock/500_f98ac39f1f.json'))
    : axios({
        url: '/500/f98ac39f1f.json',
      });

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
export const getOnlineinfo = art => DEV ? mock(require(
  '@/mock/502_b4c5a73656.json')) : axios({
  url: '/502/b4c5a73656.json',
  params: {
    art
  },
});


/**
 *   @database: { 质量信息系统_图像库 }
 *   @desc:     { 码后缺陷图像查询 } 
 */
// http://cdn.cdyc.cbpm:100/503/a8dd1e5c75/array?mahou_id=78240&blob[]=0&blob[]=1&blob[]=2&blob_type=jpg
export const getImagedata = mahou_id => DEV ? mock(require(
  '@/mock/503_a8dd1e5c75/array')) : axios({
  url: '/503/a8dd1e5c75/array',
  params: {
    mahou_id
  },
});