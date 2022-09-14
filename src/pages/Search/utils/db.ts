import { axios, mock, IAxiosState } from '@/utils/axios';
import { DEV } from '@/utils/setting';
import * as R from 'ramda';
import moment from 'moment';
const cache = 1440;

/**
 *   @database: { MES_MAIN }
 *   @desc:     { 机台作业追溯,机台作业和MES系统合并数据 }
 */
// export const getVCbpcCartlist = async cart => {
//   if (DEV) {
//     return '@/mock/415_9bdb2caa53.json';
//   }
//   let res1 = await getViewCartfinder(cart);
//   let res2 = await axios({
//     url: '/415/9bdb2caa53.json',
//     params: {
//       cart,
//       cache: 10,
//     },
//   });
//   return mergeMesAntJTZY(res1, res2);
// };

// 2019-06-26 不再从机台作业系统取数据
export const getVCbpcCartlist = cart =>
  axios({
    url: '/415/9bdb2caa53.json',
    params: {
      cart,
      cache: 10,
    },
  });

let mergeMesAntJTZY = (res1, res2) => {
  if (res1.rows === 0) {
    return res2;
  }
  res1.data = [...res1.data, ...res2.data];
  return res1;
};

/** 冠字查车号 
*   @database: { MES_MAIN }
*   @desc:     { 冠字信息追溯 } 
    const { prod, alpha, start, end, alpha2, start2, end2 } = params;
 * step1:MES中冠字查车号，查到车号后请求作业系统生产信息合并输出
 * step2:MES中无冠字车号信息，从机台作业请求到车号，再请求MES车号信息 
*/
// export const getCartinfoByGZ = async params => {
//   if (DEV) {
//     return '@/mock/415_9bdb2caa53.json';
//   }
//   let cart = '';
//   // 先在MES中查询数据
//   let res2 = await axios({
//     url: '/436/9480add1f2.json',
//     params,
//     cache: 10,
//   });

//   if (res2.rows > 0) {
//     cart = R.last(res2.data)['CartNumber'];
//     let res1 = await getViewCartfinder(cart);
//     return mergeMesAntJTZY(res1, res2);
//   }

//   // MES中无数据，在机台作业中先查询
//   let res1 = await axios({
//     url: '/437/1a5ba9765d.json',
//     params,
//     cache: 10,
//   });
//   if (res1.rows === 0) {
//     return res1;
//   }
//   cart = R.last(res2.data)['CartNumber'];
//   let res3 = await axios({
//     url: '/415/9bdb2caa53.json',
//     params: {
//       cart,
//       cache: 10,
//     },
//   });
//   return mergeMesAntJTZY(res1, res3);
// };

// 不再从机台作业系统中查询数据
export const getCartinfoByGZ = params => {
  // 先在MES中查询数据
  return axios({
    url: DEV ? '@/mock/415_9bdb2caa53.json' : '/436/9480add1f2.json',
    params,
    cache: 10,
  });
};

/**
 *   @database: { 机台作业 }
 *   @desc:     { 机台作业生产信息查询 }
 */
export const getViewCartfinder = cart =>
  axios({
    url: DEV ? '@/mock/435_a11dfa47fb.json' : '/435/a11dfa47fb.json',
    params: {
      cart,
      cache: 10,
    },
  });

/**
 *   @database: { 质量信息系统 }
 *   @desc:     { 锁车原因查询 }
 */
export const getLockReason = cart =>
  axios({
    url: DEV ? '@/mock/408_fdb27181fc.json' : '/408/fdb27181fc.json',
    params: {
      cart,
      cache: 10,
    },
  });

/**
 *   @database: { 质量信息系统 }
 *   @desc:     { 车号追溯_印码同一天生产产品质量信息 }
 */
export const getMahoudata = cart =>
  axios({
    url: DEV ? '@/mock/409_7a696b8571.json' : '/409/7a696b8571',
    params: {
      cart,
      cache: 10,
    },
  });

/**
 *   @database: { 胶凹大张离线检测系统 }
 *   @desc:     { 凹印离线原始记录 }
 */
export const getViewScoreIntaglio = async cart => {
  let res = await axios({
    url: DEV ? '@/mock/413_615bb8b273.json' : '/413/615bb8b273.json',
    params: {
      cart,
      cache,
    },
  });
  res.data = res.data.map(item => {
    ['墨色', '总分', '规矩', '防复印圈', '混色', '胶凹套印', '接线'].forEach(key => {
      item[key] = Number(item[key]).toFixed(2);
    });
    return item;
  });
  return res;
};

/**
 *   @database: { 胶凹大张离线检测系统 }
 *   @desc:     { 胶印离线原始记录 }
 */
export const getViewScoreOffset = async cart => {
  let res = await axios({
    url: DEV ? '@/mock/414_ff15f9dad5.json' : '/414/ff15f9dad5.json',
    params: {
      cart,
      cache,
    },
  });
  res.data = res.data.map(item => {
    ['墨色', '总分', '规矩', '防复印圈', '混色', '胶凹套印', '接线'].forEach(key => {
      item[key] = Number(item[key]).toFixed(2);
    });
    return item;
  });
  return res;
};

export const getIntaglioMain = async cart => {
  let res = await axios({
    url: DEV ? '@/mock/414_ff15f9dad5.json' : '/1417/5b181f76a4.json',
    params: {
      cart,
      cache,
    },
  });
  return res;
};

/**
 *   @database: { 凹印在线检测 }
 *   @desc:     { 凹印在线检测缺陷图像查询 }
 */
export const getViewErrorImage = async cart => {
  let res = await axios({
    url: DEV ? '@/mock/414_ff15f9dad5.json' : '/1418/33f0a44268.json',
    params: {
      cart,
      blob: 'img',
      blob_type: 'jpg',
      cache,
    },
  });
  let result = R.groupBy(item => item['缺陷描述'], res.data);
  return Object.entries(result).map(([title, data]) => ({
    title,
    data: data.map(item => {
      if (item.roi) {
        let { x1, x2, y1, y2 } = JSON.parse(item.roi);
        let scale = 256 / 180;
        let width = scale * Math.abs(x2 - x1) + 20,
          height = scale * Math.abs(y2 - y1) + 20;
        let left = scale * x1 - 10,
          top = scale * y1 - 10;
        item.roi = { width, height, left, top };
      }
      return item;
    }),
  }));
};

/**
 *   @database: { 凹印在线检测 }
 *   @desc:     { 印刷曲线图 }
 */
export const getViewPrintDetail: (cart: string) => Promise<IAxiosState> = cart =>
  axios({
    url: DEV ? '@/mock/1419_637e72b4be.json' : '/1419/637e72b4be.json',
    params: {
      cart,
    },
  });

/**
*   @database: { MES_MAIN }
*   @desc:     { 当天生产车号信息追溯 } 
    const { tstart, tend, mid } = params;
*/
export const getVCbpcCartlistByMachine = params =>
  axios({
    url: DEV ? '@/mock/416_26a8faebbe.json' : '/416/26a8faebbe.array',
    params,
    cache,
  });

/**
 *   @database: { MES_MAIN }
 *   @desc:     { 车号追溯_兑换记录 }
 */
export const getUdtPsExchange = cart =>
  axios({
    url: DEV ? '@/mock/417_f1b906ddf9.json' : '/417/f1b906ddf9.json',
    params: {
      cart,
      cache,
    },
  });

/**
 *   @database: { 号码三合一 }
 *   @desc:     { 号码缺陷类型分布 }
 */
export const getQaInspectSlaveCode = cart =>
  axios({
    url: DEV ? '@/mock/418_35e72b945b.json' : '/418/35e72b945b.json',
    params: {
      cart,
      cache,
    },
  });

/**
 *   @database: { 质量信息系统_图像库 }
 *   @desc:     { 码后特征缺陷图像读取 }
 */
// http://cdn.cdyc.cbpm:100/419/82d05d05ed?mahouid=74940&blob[]=ErrImage1&blob[]=ErrImage2&blob[]=ErrImage3&date_type=jpg
export const getImagedata = mahouid =>
  axios({
    url: DEV ? '@/mock/419_82d05d05ed.json' : '/419/82d05d05ed.json',
    params: {
      mahouid,
      blob: ['ErrImage1', 'ErrImage2', 'ErrImage3'],
      date_type: 'jpg',
      cache,
    },
  });

/**
 *   @database: { 质量信息系统 }
 *   @desc:     { 人工图像判废结果 }
 */
export const getViewPrintHechaImageCheck = async cart => {
  let res = await axios({
    url: DEV ? await '@/mock/420_ce6e8bb0ec.json' : '/1295/af44a68634.json',
    params: {
      cart,
      cache,
    },
  });
  let src = R.clone(res);
  src.header = res.header.slice(3);
  return src;
};

/**
 *   @database: { 质量信息系统 }
 *   @desc:     { 码后核查质量信息查询 }
 */
export const getMahoudataLog = cart =>
  axios({
    url: DEV ? '@/mock/421_5c62aa7417.json' : '/421/5c62aa7417.json',
    params: {
      cart,
      cache,
    },
  });

/**
 *   @database: { 接口管理 }
 *   @desc:     {  }
 */
export const getViewPrintTubu = cart =>
  axios({
    url: DEV ? '@/mock/421_5c62aa7417.json' : '/985/c7929ede68.json',
    params: {
      cart,
      cache,
    },
  });

/**
 *   @database: { 接口管理 }
 *   @desc:     { OCR信息查询 }
 */
export const getViewPrintOcr = async cart => {
  let res = await axios({
    url: DEV ? '@/mock/422_0361b10a4e.json' : '/422/0361b10a4e.json',
    params: {
      cart,
      cache,
    },
  });
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
  axios({
    url: DEV ? '@/mock/423_31cffa2713.json' : '/423/31cffa2713.json',
    params: {
      cart,
      cache,
    },
  });

/**
 *   @database: { 在线清数 }
 *   @desc:     { 在线清数记录 }
 */
export const getQmRectifyMaster = cart =>
  axios({
    url: DEV ? '@/mock/424_871cf71675.json' : '/424/871cf71675.json',
    params: {
      cart,
      cache,
    },
  });

/**
 *   @database: { 在线清数 }
 *   @desc:     { 胶凹工序大张废兑换记录 }
 */
export const getQmRectifyMasterChange = cart =>
  axios({
    url: DEV ? '@/mock/425_2ffba3df49.json' : '/425/2ffba3df49.json',
    params: {
      cart,
      cache,
    },
  });

/**
 *   @database: { 全幅面 }
 *   @desc:     { 人工漏判小开列表 }
 */
export const getQfmWipJobsLeak = cart =>
  axios({
    url: DEV ? '@/mock/426_1110c3beee.json' : '/426/1110c3beee.json',
    params: {
      cart,
      cache,
    },
  });

/**
 *   @database: { 全幅面 }
 *   @desc:     { 印码大张废列表 }
 */
export const getQfmWipJobsCodeFake = cart =>
  axios({
    url: DEV ? '@/mock/427_83e210ff42.json' : '/427/83e210ff42.json',
    params: {
      cart,
      cache,
    },
  });

/**
 *   @database: { 全幅面 }
 *   @desc:     { 码后机检原始数据 }
 */
export const getQfmWipJobsMahouSrc = cart =>
  axios({
    url: DEV ? '@/mock/428_9713336765.json' : '/428/9713336765.json',
    params: {
      cart,
      cache,
    },
  });

/**
 *   @database: { 全幅面 }
 *   @desc:     { OCR原始数据 }
 */
export const getOcrContrastResult = cart =>
  axios({
    url: DEV ? '@/mock/429_f4bdde145a.json' : '/429/f4bdde145a.json',
    params: {
      cart,
      cache,
    },
  });

/**
 *   @database: { 在线清数 }
 *   @desc:     { 指定工序识码结果 }
 */
export const getQmRectifySlave = (params: { year: string; rectifym_id: string }) =>
  axios({
    url: DEV ? '@/mock/1422_cccb1ea479.json' : '/1422/cccb1ea479.json',
    params,
  });

/**
 *   @database: { 号码三合一 }
 *   @desc:     { 号码三合一原始数据 }
 */
export const getWipJobsCodeSrc = cart =>
  axios({
    url: DEV ? '@/mock/430_7a36766779.json' : '/430/7a36766779.json',
    params: {
      cart,
      cache,
    },
  });

/**
 *   @database: { 小张核查 }
 *   @desc:     { 印码识码信息查询 }
 */
export const getWipJobsRectifyCode = cart =>
  axios({
    url: DEV ? '@/mock/432_a3094edd8b.json' : '/432/a3094edd8b.json',
    params: {
      cart,
      cache,
    },
  });

/**
 *   @database: { 小张核查 }
 *   @desc:     { 丝印识码信息查询 }
 */
export const getMahouCodeinfo = cart =>
  axios({
    url: DEV ? '@/mock/1258.json' : '/1258/cf83f9b813.json',
    params: {
      cart,
    },
  });

/**
 *   @database: { 小张核查 }
 *   @desc:     { 丝印原始记录 }
 */
export const getQfmWipJobsSilk = cart =>
  axios({
    url: DEV ? '@/mock/431_5527a0d74e.json' : '/431/5527a0d74e.json',
    params: {
      cart,
      cache,
    },
  });

/**
 *   @database: { 质量信息系统 }
 *   @desc:     { 工艺调整记录 }
 */
export const getProcAdjustLog = async cart => {
  let list1 = await axios({
    url: DEV ? '@/mock/433_6c3298675c.json' : '/433/6c3298675c.json',
    params: {
      cart,
    },
  });
  // MES系统 工艺调整
  let list2 = await axios({
    url: '/1366/9de6c64672.json',
    params: {
      cart,
    },
  });
  if (list1.rows == 0) {
    return list2;
  }
  list1.data = [...list1.data, ...list2.data];
  list1.rows = list1.data.length;
  return list1;
};

/**
 *   @database: { 全幅面 }
 *   @desc:     { 印码大张未检数据查询 }
 */
export const getQfmWipJobsUncheck = cart =>
  axios({
    url: DEV ? '@/mock/434_3c096724a7.json' : '/434/3c096724a7.json',
    params: {
      cart,
      cache,
    },
  });

/**
 *   @database: { 号码三合一 }
 *   @desc:     { 号码实废图像信息查询 }
 */
export const getWipJobsCodeImage = cart =>
  axios({
    url: DEV ? '@/mock/440_4b255e8000.json' : '/440/4b255e8000.json',
    params: {
      cart,
      cache,
      blob: 'image',
    },
  });

/**
 *   @database: { 小张核查 }
 *   @desc:     { 丝印实废图像信息查询 }
 */
export const getWipJobsSilkImage = cart =>
  axios({
    url: DEV ? '@/mock/439_e6ccdf08a7.json' : '/439/e6ccdf08a7.json',
    params: {
      cart,
      cache,
      blob: 'image',
    },
  });

/**
 *   @database: { 全幅面 }
 *   @desc:     { 票面实废图像信息查询 }
 */
export const getQfmWipJobsHechaImage = cart =>
  axios({
    url: DEV ? '@/mock/438_49a52af747.json' : '/438/49a52af747.json',
    params: {
      cart,
      blob: 'image',
      cache,
    },
  });

/**
 *   @database: { 全幅面 }
 *   @desc:     { 指定大万实废分布 }
 */
export const getQfmWipJobsByCarts = carts =>
  axios({
    url: DEV ? '@/mock/534_bc70063e23.json' : '/534/bc70063e23.json',
    params: {
      carts,
      cache,
    },
  });

/**
 *   @database: { 全幅面 }
 *   @desc:     { 产品主要缺陷类型分析 }
 */
export const getQfmWipJobsMain = cart => {
  let faketypeurl = ['45', '75', '25'].includes(cart.slice(2, 4))
    ? '/1598/b58865a522.array'
    : '/554/ccd89d81b5/array';
  return axios({
    url: DEV ? '@/mock/554_ccd89d81b5.json' : faketypeurl,
    params: {
      cart,
      cache,
      blob: 3,
    },
  });
};

/**
*   @database: { 检封装箱系统 }
*   @desc:     { 装箱记录查询 } 
    const { code, prod } = params;
*/
export const getViewCbpcBoxinfo = params =>
  axios({
    url: DEV ? '@/mock/555_ca793921a2.json' : '/555/ca793921a2/array',
    params: {
      ...params,
      cache,
    },
  });

/**
*   @database: { 检封装箱系统 }
*   @desc:     { 箱号信息追溯 } 
    const { prod, code } = params;
*/
export const getViewCbpcPackage = params =>
  axios({
    url: DEV ? '@/mock/557_cb96552dc3.json' : '/557/cb96552dc3/array',
    params: {
      ...params,
      cache,
      blob: 9,
      blob_type: 'jpg',
    },
  });

/**
*   @database: { 二维码系统 }
*   @desc:     { 成品库出入记录 } 
    const { prod, code, codenum } = params;
*/
export const getBXq = params =>
  axios({
    url: DEV ? '@/mock/574_30efd1b25d.json' : '/574/30efd1b25d.json',
    params,
    cache,
  });

/**
 *   @database: { MES系统_生产环境 }
 *   @desc:     { 清分机兑换记录 }
 */
export const getVCbpcCfturnguard = cart =>
  axios({
    url: DEV ? '@/mock/575_3094407e19.json' : '/575/3094407e19.json',
    params: {
      cart,
      cache,
    },
  });

/**
 *   @database: { MES系统_生产环境 }
 *   @desc:     { 指定大万过数记录 }
 */
export const getShushujiCount: (cart: string) => Promise<IAxiosState> = cart =>
  axios({
    url: DEV ? '@/mock/1268_5839c5a70f.json' : '/1268/5839c5a70f.json',
    params: {
      cart,
    },
  });

/**
 *   @database: { MES系统_生产环境 }
 *   @desc:     { 产品流转原始记录 }
 */
export const getProdLog = cart =>
  axios({
    url: DEV ? '@/mock/578_14cf29cb53.json' : '/578/14cf29cb53.json',
    params: {
      cart,
      cache,
    },
  }).then(res => {
    res.header = '交接时间,间隔,工序,业务类型,部门,付出,接收,产量'.split(',');
    let lastDateName = '';
    res.data = res.data.map((item, idx) => {
      item['序号'] = idx + 1;
      item['交接时间'] = item['交接时间'].replace('.000', '');

      if (idx) {
        let minutes = moment(item['交接时间']).diff(
          moment(res.data[idx - 1]['交接时间']),
          'minutes'
        );
        let days = Math.floor(minutes / 60 / 24);
        let hours = Math.floor((minutes % 1440) / 60);
        days = days > 0 ? days + '天' : '';
        hours = hours > 0 ? hours + '小时' : '';
        item['间隔'] = days + hours + (minutes % 60) + '分';
      } else {
        item['间隔'] = '开始';
      }
      return item;
    });

    res.data = res.data.map((item, idx) => {
      let prevDate = item['交接时间'].split(' ')[0];
      item['交接时间'] = item['交接时间'].replace(lastDateName, '');
      lastDateName = prevDate;
      return item;
    });

    return res;
  });
