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
//     return mock(require('@/mock/415_9bdb2caa53.json'));
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
//     return mock(require('@/mock/415_9bdb2caa53.json'));
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
  if (DEV) {
    return mock(require('@/mock/415_9bdb2caa53.json'));
  }
  // 先在MES中查询数据
  return axios({
    url: '/436/9480add1f2.json',
    params,
    cache: 10,
  });
};

/**
 *   @database: { 机台作业 }
 *   @desc:     { 机台作业生产信息查询 }
 */
export const getViewCartfinder = cart =>
  DEV
    ? mock(require('@/mock/435_a11dfa47fb.json'))
    : axios({
        url: '/435/a11dfa47fb.json',
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
  DEV
    ? mock(require('@/mock/408_fdb27181fc.json'))
    : axios({
        url: '/408/fdb27181fc.json',
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
  DEV
    ? mock(require('@/mock/409_7a696b8571.json'))
    : axios({
        url: '/409/7a696b8571',
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
  let res = DEV
    ? await mock(require('@/mock/413_615bb8b273.json'))
    : await axios({
        url: '/413/615bb8b273.json',
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
  let res = DEV
    ? await mock(require('@/mock/414_ff15f9dad5.json'))
    : await axios({
        url: '/414/ff15f9dad5.json',
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
*   @database: { MES_MAIN }
*   @desc:     { 当天生产车号信息追溯 } 
    const { tstart, tend, mid } = params;
*/
export const getVCbpcCartlistByMachine = params =>
  DEV
    ? mock(require('@/mock/416_26a8faebbe.json'))
    : axios({
        url: '/416/26a8faebbe.array',
        params,
        cache,
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
          cache,
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
          cache,
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
          cache,
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
        url: '/1295/af44a68634.json',
        params: {
          cart,
          cache,
        },
      });
  let src = R.clone(res);
  src.header = res.header.slice(4);
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
          cache,
        },
      });

/**
 *   @database: { 接口管理 }
 *   @desc:     {  }
 */
export const getViewPrintTubu = cart =>
  DEV
    ? mock(require('@/mock/421_5c62aa7417.json'))
    : axios({
        url: '/985/c7929ede68.json',
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
  let res = await (DEV
    ? mock(require('@/mock/422_0361b10a4e.json'))
    : axios({
        url: '/422/0361b10a4e.json',
        params: {
          cart,
          cache,
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
          cache,
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
          cache,
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
          cache,
        },
      });

/**
 *   @database: { 全幅面 }
 *   @desc:     { 人工漏判小开列表 }
 */
export const getQfmWipJobsLeak = cart =>
  DEV
    ? mock(require('@/mock/426_1110c3beee.json'))
    : axios({
        url: '/426/1110c3beee.json',
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
  DEV
    ? mock(require('@/mock/427_83e210ff42.json'))
    : axios({
        url: '/427/83e210ff42.json',
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
  DEV
    ? mock(require('@/mock/428_9713336765.json'))
    : axios({
        url: '/428/9713336765.json',
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
  DEV
    ? mock(require('@/mock/429_f4bdde145a.json'))
    : axios({
        url: '/429/f4bdde145a.json',
        params: {
          cart,
          cache,
        },
      });

/**
 *   @database: { 号码三合一 }
 *   @desc:     { 号码三合一原始数据 }
 */
export const getWipJobsCodeSrc = cart =>
  DEV
    ? mock(require('@/mock/430_7a36766779.json'))
    : axios({
        url: '/430/7a36766779.json',
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
  DEV
    ? mock(require('@/mock/432_a3094edd8b.json'))
    : axios({
        url: '/432/a3094edd8b.json',
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
  DEV
    ? mock(require('@/mock/431_5527a0d74e.json'))
    : axios({
        url: '/431/5527a0d74e.json',
        params: {
          cart,
          cache,
        },
      });

/**
 *   @database: { 质量信息系统 }
 *   @desc:     { 工艺调整记录 }
 */
export const getProcAdjustLog = cart =>
  DEV
    ? mock(require('@/mock/433_6c3298675c.json'))
    : axios({
        url: '/433/6c3298675c.json',
        params: {
          cart,
        },
      });

/**
 *   @database: { 全幅面 }
 *   @desc:     { 印码大张未检数据查询 }
 */
export const getQfmWipJobsUncheck = cart =>
  DEV
    ? mock(require('@/mock/434_3c096724a7.json'))
    : axios({
        url: '/434/3c096724a7.json',
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
  DEV
    ? mock(require('@/mock/440_4b255e8000.json'))
    : axios({
        url: '/440/4b255e8000.json',
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
  DEV
    ? mock(require('@/mock/439_e6ccdf08a7.json'))
    : axios({
        url: '/439/e6ccdf08a7.json',
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
  DEV
    ? mock(require('@/mock/438_49a52af747.json'))
    : axios({
        url: '/438/49a52af747.json',
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
  DEV
    ? mock(require('@/mock/534_bc70063e23.json'))
    : axios({
        url: '/534/bc70063e23.json',
        params: {
          carts,
          cache,
        },
      });

/**
 *   @database: { 全幅面 }
 *   @desc:     { 产品主要缺陷类型分析 }
 */
export const getQfmWipJobsMain = cart =>
  DEV
    ? mock(require('@/mock/554_ccd89d81b5.json'))
    : axios({
        url: '/554/ccd89d81b5/array',
        params: {
          cart,
          cache,
          blob: 3,
        },
      });

/**
*   @database: { 检封装箱系统 }
*   @desc:     { 装箱记录查询 } 
    const { code, prod } = params;
*/
export const getViewCbpcBoxinfo = params =>
  DEV
    ? mock(require('@/mock/555_ca793921a2.json'))
    : axios({
        url: '/555/ca793921a2/array',
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
  DEV
    ? mock(require('@/mock/557_cb96552dc3.json'))
    : axios({
        url: '/557/cb96552dc3/array',
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
  DEV
    ? mock(require('@/mock/574_30efd1b25d.json'))
    : axios({
        url: '/574/30efd1b25d.json',
        params,
        cache,
      });

/**
 *   @database: { MES系统_生产环境 }
 *   @desc:     { 清分机兑换记录 }
 */
export const getVCbpcCfturnguard = cart =>
  DEV
    ? mock(require('@/mock/575_3094407e19.json'))
    : axios({
        url: '/575/3094407e19.json',
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
  (DEV
    ? mock(require('@/mock/578_14cf29cb53.json'))
    : axios({
        url: '/578/14cf29cb53.json',
        params: {
          cart,
          cache,
        },
      })
  ).then(res => {
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
