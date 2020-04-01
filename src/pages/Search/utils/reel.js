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
          reel: reel + '%',
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
    let keys = '湿度,定量,水分,水分差,湿强度,白度,不透明度,湿变形纵,湿变形横,透气度,L,a,b,干拉力横'.split(
      ','
    );
    keys.forEach(key => {
      item[key] = Number(item[key]);
    });
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
 *   @desc:     { 纸张过程检测 }
 */
export const getViewProcessCheckPaper = reel =>
  DEV
    ? mock(require('@/mock/874_c17de8b1c5.json'))
    : axios({
        url: '/874/c17de8b1c5.json',
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
    let keys = '吸水性正,吸水性反,表面强度正,表面吸油性正,表面吸油性反,油渗性正,油渗性反'.split(
      ','
    );
    keys.forEach(key => {
      item[key] = Number(item[key]);
    });

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
          reel: `%${reel}%`,
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
          reel: `%${reel}%`,
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
          reel: `%${reel}%`,
        },
      });
