import { axios, mock } from '@/utils/axios';
import { DEV } from '@/utils/setting';
import * as R from 'ramda';
/**
 *   @database: { MES_MAIN }
 *   @desc:     { 机台作业追溯 }
 */
export const getVCbpcCartlist = cart =>
  DEV
    ? mock(require('@/mock/415_9bdb2caa53.json'))
    : axios({
        url: '/415/9bdb2caa53.json',
        params: {
          cart,
        },
      });
/**
 *   @database: { 质量信息系统 }
 *   @desc:     { 锁车原因查询 }
 */
export const getLockReason = cart =>
  DEV
    ? mock(require('@/mock/408_fdb27181fc.json'))
    : axios({
        url: '/408/fdb27181fc.json',
        params: {
          cart,
        },
      });

/**
 *   @database: { 质量信息系统 }
 *   @desc:     { 车号追溯_印码同一天生产产品质量信息 }
 */
export const getMahoudata = cart =>
  DEV
    ? mock(require('@/mock/409_7a696b8571.json'))
    : axios({
        url: '/409/7a696b8571',
        params: {
          cart,
        },
      });

/**
 *   @database: { 胶凹大张离线检测系统 }
 *   @desc:     { 凹印离线原始记录 }
 */
export const getViewScoreIntaglio = async cart => {
  let res = DEV
    ? await mock(require('@/mock/413_615bb8b273.json'))
    : await axios({
        url: '/413/615bb8b273.json',
        params: {
          cart,
        },
      });
  res.data = res.data.map(item => {
    item['墨色'] = Number(item['墨色']).toFixed(2);
    item['总分'] = Number(item['总分']).toFixed(2);
    return item;
  });
  return res;
};

/**
 *   @database: { 胶凹大张离线检测系统 }
 *   @desc:     { 胶印离线原始记录 }
 */
export const getViewScoreOffset = async cart => {
  let res = DEV
    ? await mock(require('@/mock/414_ff15f9dad5.json'))
    : await axios({
        url: '/414/ff15f9dad5.json',
        params: {
          cart,
        },
      });
  res.data = res.data.map(item => {
    item['墨色'] = Number(item['墨色']).toFixed(2);
    item['总分'] = Number(item['总分']).toFixed(2);
    return item;
  });
  return res;
};

/**
*   @database: { MES_MAIN }
*   @desc:     { 当天生产车号信息追溯 } 
    const { tstart, tend, mid } = params;
*/
export const getVCbpcCartlistByMachine = params =>
  DEV
    ? mock(require('@/mock/416_26a8faebbe.json'))
    : axios({
        url: '/416/26a8faebbe.json',
        params,
      });

/**
 *   @database: { MES_MAIN }
 *   @desc:     { 车号追溯_兑换记录 }
 */
export const getUdtPsExchange = cart =>
  DEV
    ? mock(require('@/mock/417_f1b906ddf9.json'))
    : axios({
        url: '/417/f1b906ddf9.json',
        params: {
          cart,
        },
      });

/**
 *   @database: { 号码三合一 }
 *   @desc:     { 号码缺陷类型分布 }
 */
export const getQaInspectSlaveCode = cart =>
  DEV
    ? mock(require('@/mock/418_35e72b945b.json'))
    : axios({
        url: '/418/35e72b945b.json',
        params: {
          cart,
        },
      });

/**
 *   @database: { 质量信息系统_图像库 }
 *   @desc:     { 码后特征缺陷图像读取 }
 */
// http://cdn.cdyc.cbpm:100/419/82d05d05ed?mahouid=74940&blob[]=ErrImage1&blob[]=ErrImage2&blob[]=ErrImage3&date_type=jpg
export const getImagedata = mahouid =>
  DEV
    ? mock(require('@/mock/419_82d05d05ed.json'))
    : axios({
        url: '/419/82d05d05ed.json',
        params: {
          mahouid,
          blob: ['ErrImage1', 'ErrImage2', 'ErrImage3'],
          date_type: 'jpg',
        },
      });

/**
 *   @database: { 质量信息系统 }
 *   @desc:     { 人工图像判废结果 }
 */
export const getViewPrintHechaImageCheck = async cart => {
  let res = DEV
    ? await mock(require('@/mock/420_ce6e8bb0ec.json'))
    : await axios({
        url: '/420/ce6e8bb0ec.json',
        params: {
          cart,
        },
      });
  let src = R.clone(res);
  src.header = res.header.slice(4);
  src.data[0] = R.props(src.header)(res.data[0]);
  return src;
};

/**
 *   @database: { 质量信息系统 }
 *   @desc:     { 码后核查质量信息查询 }
 */
export const getMahoudataLog = cart =>
  DEV
    ? mock(require('@/mock/421_5c62aa7417.json'))
    : axios({
        url: '/421/5c62aa7417.json',
        params: {
          cart,
        },
      });

/**
 *   @database: { 接口管理 }
 *   @desc:     { OCR信息查询 }
 */
export const getViewPrintOcr = async cart => {
  let res = await (DEV
    ? mock(require('@/mock/422_0361b10a4e.json'))
    : axios({
        url: '/422/0361b10a4e.json',
        params: {
          cart,
        },
      }));
  if (res.rows) {
    res.data[0]['小开作废率'] = Number(res.data[0]['小开作废率']).toFixed(3) + '‰';
  }
  return res;
};
/**
 *   @database: { 质量信息系统 }
 *   @desc:     { 印钞特抽信息 }
 */
export const getNoteaysdata = cart =>
  DEV
    ? mock(require('@/mock/423_31cffa2713.json'))
    : axios({
        url: '/423/31cffa2713.json',
        params: {
          cart,
        },
      });

/**
 *   @database: { 在线清数 }
 *   @desc:     { 在线清数记录 }
 */
export const getQmRectifyMaster = cart =>
  DEV
    ? mock(require('@/mock/424_871cf71675.json'))
    : axios({
        url: '/424/871cf71675.json',
        params: {
          cart,
        },
      });

/**
 *   @database: { 在线清数 }
 *   @desc:     { 胶凹工序大张废兑换记录 }
 */
export const getQmRectifyMasterChange = cart =>
  DEV
    ? mock(require('@/mock/425_2ffba3df49.json'))
    : axios({
        url: '/425/2ffba3df49.json',
        params: {
          cart,
        },
      });
