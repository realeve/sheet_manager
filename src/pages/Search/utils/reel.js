import { axios, mock } from '@/utils/axios';
import { DEV } from '@/utils/setting';
import * as R from 'ramda';

// http://cdn.cdyc.cbpm:100/504/c9e662a163?reel=6420015%
/**
 *   @database: { 质量信息系统 }
 *   @desc:     { 轴号信息追溯_机检信息查询 }
 */
export const getViewPaperQuality = async reel => {
  let res = DEV
    ? await mock(require('@/mock/504_c9e662a163.json'))
    : await axios({
        url: '/504/c9e662a163.json',
        params: {
          reel,
        },
      });
  res.data = res.data.map(item => {
    item['好品率'] = Number(item['好品率']);
    return item;
  });
  return res;
};

/**
 *   @database: { 质量信息系统 }
 *   @desc:     { 轴号信息追溯__物理站 }
 */
export const getViewPaperPsc = async reel => {
  let res = DEV
    ? await mock(require('@/mock/505_2daa2d7d79.json'))
    : await axios({
        url: '/505/2daa2d7d79.json',
        params: {
          reel,
        },
      });
  res.data = res.data.map(item => {
    item['湿度'] = Number(item['湿度']);
    item['定量'] = Number(item['定量']);
    item['水分'] = Number(item['水分']);
    item['水分差'] = Number(item['水分差']);
    return item;
  });
  return res;
};

/**
 *   @database: { 质量信息系统 }
 *   @desc:     { 轴号追溯_物理外观 }
 */
export const getViewPaperSurface = reel =>
  DEV
    ? mock(require('@/mock/506_3949376b46.json'))
    : axios({
        url: '/506/3949376b46.json',
        params: {
          reel,
        },
      });

/**
 *   @database: { 质量信息系统 }
 *   @desc:     { 轴号追溯_非常规 }
 */
export const getViewPaperParaAbnormal = async reel => {
  let res = DEV
    ? await mock(require('@/mock/507_6575fb1d28.json'))
    : await axios({
        url: '/507/6575fb1d28.json',
        params: {
          reel,
        },
      });

  res.data = res.data.map(item => {
    item['吸水性正'] = Number(item['吸水性正']);
    item['吸水性反'] = Number(item['吸水性反']);
    item['表面强度正'] = Number(item['表面强度正']);
    return item;
  });
  return res;
};

/**
 *   @database: { 质量信息系统 }
 *   @desc:     { 轴号追溯_人工校验 }
 */
export const getViewPaperValidate = reel =>
  DEV
    ? mock(require('@/mock/508_99b1cd2c29.json'))
    : axios({
        url: '/508/99b1cd2c29.json',
        params: {
          reel,
        },
      });

/**
 *   @database: { 质量信息系统 }
 *   @desc:     { 轴号追溯_机检在线抽查记录 }
 */
export const getPaperValidate = reel =>
  DEV
    ? mock(require('@/mock/509_270920daeb.json'))
    : axios({
        url: '/509/270920daeb.json',
        params: {
          reel,
        },
      });

/**
 *   @database: { 质量信息系统 }
 *   @desc:     { 轴号追溯_切纸机生产原始记录 }
 */
export const getViewPaperCutwaste = reel =>
  DEV
    ? mock(require('@/mock/510_e74f253d29.json'))
    : axios({
        url: '/510/e74f253d29.json',
        params: {
          reel,
        },
      });
