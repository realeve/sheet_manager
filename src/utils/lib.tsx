import moment from 'moment';
import http from 'axios';
import { uploadHost, DEV } from './setting';
import qs from 'qs';
import dateRanges from './ranges';
// import router from 'umi/router';
import router from './router';
import { notification } from 'antd';
import userTool from './users';
import { Dispatch } from 'react-redux';
import * as axios from './axios';
const R = require('ramda');

export const getType = axios.getType;
export { searchUrl, imgUrl, systemName, host as apiHost } from './setting';

// export const searchUrl: string = setting.searchUrl;
// export const imgUrl: string = setting.imgUrl;
// export const systemName: string = setting.systemName;

// export const apiHost: string = setting.host;

/**
 * cart:车号
 * reel:轴号
 * reel_cart:纸张上下5千车号
 * reel_patch:纸张批次号
 * pallet:纸张拍号
 * plate:印版
 */
interface Rules {
  cart: RegExp;
  reel: RegExp;
  reel_cart: RegExp;
  reel_patch: RegExp;
  pallet: RegExp;
  plate: RegExp;
  phone: RegExp;
  url: RegExp;
  [key: string]: RegExp;
}
export const rules: Rules = {
  cart: /^[0-9]\d{3}[A-Za-z]\d{3}(|[a-bA-B])$|^BP\d{2}[A-Z]\d{3}$/, // 车号
  // reel: /^[1-9]\d{6}(|[A-Ca-c])$|[A-Z]\d{11}[A-Z]/, //^[1-9]\d{4}[A-Ca-c]$|
  reel: /^[0-9]\d{6}([A-Ca-c]|)$|[A-Z]\d{11}([A-Z]|)|^\d{3}[A-Z]\d{5}(|[A-Z])$/, // 轴号 //^[1-9]\d{4}[A-Ca-c]$|
  reel_cart: /^[0-9]\d{3}[A-Za-z]\d{3}([A-B]|[a-b])$/,
  reel_patch: /^\d{5}([A-Z|a-z])\d$/, //2020 6T 2
  pallet: /^\d{2}(0[1-9]|1[0-2])\d{2}(1|2)\d{6}$/,
  plate: /^[A-Z|a-z]{2}\d{6}$|^[A-Z|a-z]{2}\d{8}$|^\d{8}$|^\d{6}$/,
  phone: /^\d{8}$|^\d{11}$/,
  url: /^http(s|):\/\//,
};

interface CartReelReg {
  (str: string | number): boolean;
}

export const isCartOrReel: CartReelReg = str => {
  return rules.cart.test(String(str).trim()) || rules.reel.test(String(str).trim());
};

export const isCart: CartReelReg = str => rules.cart.test(String(str).trim());
export const isReel: CartReelReg = str => rules.reel.test(String(str).trim());
export const isPlate: CartReelReg = str => rules.plate.test(String(str).trim());

export const isUrl = str => rules.url.test(String(str).trim());

// 车号/冠号/轴号的起始2位
export const mayBeCartOrReel: CartReelReg = str => {
  let _str = String(str).trim();
  return _str.length === 1 ? /\d/.test(_str) : /^(\d{2}|[A-Z]\d)$/.test(_str.slice(0, 2));
};

export const isDateTime: CartReelReg = str =>
  /^\d{4}(-|\/|)[0-1]\d(-|\/|)[0-3]\d$|^\d{4}(-|\/|)[0-1]\d(-|\/|)[0-3]\d [0-2][0-9]:[0-5][0-9](:[0-5][0-9])$|^[0-2][0-9]:[0-5][0-9](:[0-5][0-9])$/.test(
    String(str).trim()
  );

export const isDate: CartReelReg = str =>
  /^\d{4}(-|\/|)[0-1]\d(-|\/|)[0-3]\d$|^\d{4}(-|\/|)[0-1]\d(-|\/|)[0-3]\d$/.test(
    String(str).trim()
  );
export const isTime: CartReelReg = str =>
  /^\d{4}(-|\/|)[0-1]\d(-|\/|)[0-3]\d [0-2][0-9]:[0-5][0-9](:[0-5][0-9])|^[0-2][0-9]:[0-5][0-9](:[0-5][0-9])(|.\d)/.test(
    String(str).trim()
  );

export const isMonth: CartReelReg = str => /^[1-9]\d{3}(|\-|\/)[0-1]\d$/.test(String(str).trim());

// 数字
export const isNumOrFloat: CartReelReg = str =>
  /^(-|\+|)\d+(\.)\d+$|^(-|\+|)\d+$/.test(String(str));

// 整数
export const isInt: CartReelReg = str => /^(-|\+|)?[0-9]\d*$/.test(String(str));

// 浮点
export const isFloat: CartReelReg = str =>
  !isCart(str) &&
  (isNumOrFloat(str) ||
    /^(-|\+|)\d+\.\d+(|e|E)(|\-|\+)\d+$|^(-|\+|)\d+(|e|E)(|\-|\+)\d+$/.test(String(str)));

export const hasDecimal: CartReelReg = str => /^(-|\+|)\d+\.\d+$/.test(String(str));
export const parseNumber: {
  (str: number): number | string;
} = str => {
  if (!hasDecimal(str)) {
    return str;
  }
  return typeof str === 'string' ? parseFloat(str).toFixed(3) : str.toFixed(3);
};

export const now = () => moment().format('YYYY-MM-DD HH:mm:ss');
export const weeks = () => moment().weeks();

export const ymd = () => moment().format('YYYYMMDD');
export const monthList = [
  '',
  '一月',
  '二月',
  '三月',
  '四月',
  '五月',
  '六月',
  '七月',
  '八月',
  '九月',
  '十月',
  '十一月',
  '十二月',
];
export const monthname = (idx = moment().format('MM')) => monthList[Number(idx)];

export const timestamp = () => moment().format('x');

interface lastAlpha {
  (str: string): string;
}
let getLastAlpha: lastAlpha = str => {
  if (str === 'A') {
    return 'Z';
  }
  let c: number = str.charCodeAt(0);
  return String.fromCharCode(c - 1);
};

// 处理冠字信息
/**
 *
 * @param {code,prod} 号码，品种
 */
interface GZSetting {
  code: string;
  prod: string;
}
interface GZInfo {
  start: string;
  end: string;
  start2: string;
  end2: string;
  alpha: string;
  alpha2: string;
}

// interface iFunGZInfo {
//   (param: GZSetting): GZInfo | boolean;
// }
export const handleGZInfo: (param: GZSetting) => GZInfo | boolean = ({ code, prod }) => {
  if (code.length !== 6) {
    return false;
  }
  code = code.toUpperCase();

  let kInfo: number = 35;
  if (prod.includes('9602') || prod.includes('9603')) {
    kInfo = 40;
  }

  let alphaInfo: Array<string> = code.match(/[A-Z]/g);
  let numInfo: string = code.match(/\d/g).join('');
  let starNum: number = code.slice(1, 6).indexOf(alphaInfo[1]) + 1;
  let starInfo: string = code
    .slice(1, starNum)
    .split('')
    .fill('*')
    .join('');
  let start: number = parseInt(numInfo, 10) - kInfo;

  let end: string = numInfo;
  let needConvert: boolean = start < 0;
  let start2: string = String(start + 1),
    end2: string = end;

  let alpha: string = alphaInfo[0] + starInfo + alphaInfo[1];
  let alpha2: string = alpha;

  if (needConvert) {
    start = 10000 + start;
    end = '9999';
    start2 = '0000';
    end2 = numInfo;
    // 字母进位
    let [a1, a2] = alphaInfo;
    if (a2 === 'A') {
      a1 = getLastAlpha(a1);
      a2 = getLastAlpha(a2);
    } else {
      a2 = getLastAlpha(a2);
    }
    alpha = a1 + starInfo + a2;
  }
  start += 1;

  // start = '000' + start;
  // start = start.slice(start.length - 4, start.length);
  const startStr: string = String(start).padStart(4, '0');

  return {
    start: startStr,
    end,
    start2,
    end2,
    alpha,
    alpha2,
  };
};

//尼泊尔品种
export const isNRB = (str: any) => /^[A-Z](|[1-9]|[1-9]\d|100)$/.test(String(str));

// 冠字
export let isGZ: CartReelReg = value =>
  /^[A-Za-z]{2}\d{4}$|^[A-Za-z]\d[A-Za-z]\d{3}$|^[A-Za-z]\d{2}[A-Za-z]\d{2}$|^[A-Za-z]\d{3}[A-Za-z]\d$|^[A-Za-z]\d{4}[A-Za-z]$/.test(
    String(value)
  ) || isNRB(value);

// export let loadFile: {
//   (fileName: string, content: any): void;
// } = (fileName, content) => {
//   var aLink: HTMLAnchorElement = document.createElement('a');
//   var blob: Blob = new Blob([content], {
//     type: 'text/plain'
//   });
//   // var evt = new Event("click");
//   aLink.download = fileName;
//   aLink.href = URL.createObjectURL(blob);
//   aLink.click();
//   URL.revokeObjectURL(aLink.href);
// };

let dataURItoBlob = (dataURI: string) => {
  var byteString: string = atob(dataURI.split(',')[1]);
  var mimeString: string = dataURI
    .split(',')[0]
    .split(':')[1]
    .split(';')[0];
  var ab: ArrayBuffer = new ArrayBuffer(byteString.length);
  var ia: Uint8Array = new Uint8Array(ab);
  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], {
    type: mimeString,
  });
};

/**
 * wiki: dataURL to blob, ref to https://gist.github.com/fupslot/5015897
 * @param dataURI:base64
 * @returns {FormData}
 * 用法： axios({url,type:'POST',data}).then(res=>res.data);
 */
// 将BASE64编码图像转为FormData供数据上传，用法见上方注释。
export let dataURI2FormData: {
  (dataURI: string): FormData;
} = dataURI => {
  var data: FormData = new FormData();
  var blob: Blob = dataURItoBlob(dataURI);
  data.append('file', blob);
  return data;
};

/**
 * @功能：将base64字符串上传至服务器同时保存为文件，返回文件信息及attach_id
 * @param {base64字符串} datURI
 * @return {
 *      status:bool,//上传状态
 *      id:int,//文件id
 *      fileInfo:object // 文件描述：宽、高、url、大小、类型、名称
 * }
 */
export let uploadBase64 = (dataURI: string) => {
  var data: FormData = dataURI2FormData(dataURI);
  return http({
    method: 'POST',
    url: uploadHost,
    data,
  }); //.then((res) => res.data);
};

/**
 *
 * @param {file文件对象，input type="file"} file
 * @param {回调函数} callback
 * @desc 将file图像文件对象转换为BASE64
 */
// export let dataFile2URI = async (file: File, callback?: Function) => {
//   if (typeof FileReader === 'undefined') {
//     return {
//       status: false,
//       data: '浏览器不支持 FileReader'
//     };
//   }
//   if (!/image\/\w+/.test(file.type)) {
//     //判断获取的是否为图片文件
//     return {
//       status: false,
//       data: '浏览器不支持 请确保文件为图像文件'
//     };
//   }
//   let reader: FileReader = new FileReader();
//   reader.onload = ({ target: { result } }: any) => {
//     if (typeof callback === 'function') {
//       callback(result);
//     }
//   };
//   reader.readAsDataURL(file);

//   return reader;
// };

/**
 * 千分位格式化数字
 * @param {数字} num
 * @param {小数位数} decimalLength
 */
export const thouandsNum: {
  (num: number, len: number): string;
} = (num, decimalLength = 2) => {
  if (String(num).length === 0) {
    return '';
  }
  console.log(num);

  let numStr: string = Number(num).toLocaleString();
  if (numStr.includes('.')) {
    let [integer, decimal] = numStr.split('.');
    return integer + '.' + decimal.padEnd(decimalLength, '0');
  }
  return numStr + '.' + ''.padEnd(decimalLength, '0');
};

// hash = window.location.hash;
/**
 * @parms hash 地址信息
 * @returns 格式化的查询信息
 */
export const parseUrl = hash => {
  let queryStr: string = hash
    .slice(1)
    .replace(/，/g, ',')
    .replace(/ /g, '');
  return qs.parse(queryStr);
};

// 处理url链接信息，返回组件model所需的初始数据
export const handleUrlParams: (
  hash: string,
  split?: boolean
) => {
  id: number | string;
  params: any;
  dateRange: [string, string];
} = (hash, split = false) => {
  let query = parseUrl(hash);
  let params = R.clone(query);

  // 2019-03 默认开始时间
  params.cache = params.cache || ['5'];

  let defaultDate: number = 13;
  if (params.daterange) {
    defaultDate = parseInt(params.daterange, 10);
    Reflect.deleteProperty(params, 'daterange');
  }
  let datename = Object.keys(dateRanges)[defaultDate];

  const [tstart, tend] = dateRanges[datename] || dateRanges.三天前;

  // 处理默认日期类型（20190327）
  let formatType = 'YYYYMMDD';

  let dateType = params.datetype || 'date';
  switch (dateType) {
    case 'month':
      formatType = 'YYYYMM';
      break;
    case 'year':
      formatType = 'YYYY';
      break;
    case 'date':
    default:
      formatType = 'YYYYMMDD';
      break;
  }
  Reflect.deleteProperty(params, 'datetype');

  Reflect.deleteProperty(params, 'hidemenu');

  const [ts, te] = [tstart.format(formatType), tend.format(formatType)];

  // 以逗号或分号分割参数
  if (split) {
    Object.keys(params).forEach(key => {
      let item: string | string[] = params[key];
      if (typeof item !== 'string') {
        item = item[0];
      }

      if (item.includes(',')) {
        params[key] = item.split(',');
      } else if (item.includes(';')) {
        params[key] = item.split(';');
      }
    });
  }
  let { id } = params;
  Reflect.deleteProperty(params, 'id');

  return {
    id: 'String' === R.type(id) ? [id] : id,
    params,
    dateRange: [ts, te],
  };
};

interface Props {
  dispatch: Dispatch;
}

export const logout = ({ dispatch }: Props) => {
  dispatch({
    type: 'common/setStore',
    payload: {
      userSetting: {
        uid: '',
        name: '',
        avatar: '',
        menu: '',
      },
      isLogin: false,
    },
  });
  console.log('logout');
  userTool.saveLoginStatus(0);

  let { href, origin } = window.location;
  router.push({
    pathname: '/login',
    search: qs.stringify({
      redirect: href.replace(origin, ''),
    }),
  });
  return true;
};

interface Store {
  payload: any;
}
export const setStore = (state, store: Store) => {
  let { payload } = store;
  if (typeof payload === 'undefined') {
    payload = store;
    // throw new Error('需要更新的数据请设置在payload中');
  }
  let nextState = R.clone(state);
  Object.keys(payload).forEach(key => {
    let val = payload[key];
    if (getType(val) == 'object') {
      nextState[key] = Object.assign({}, nextState[key], val);
    } else {
      nextState[key] = val;
    }
  });
  return nextState;
};

export const isChineseWord = str => new RegExp(/[\u00A1-\uFFFF]/).test(str);

// 中文宽1，其余宽0.7
export const getStringWidth = str => {
  if (isFloat(str)) {
    str = Number(str).toFixed(2);
  }
  return String(str)
    .trim()
    .split('')
    .reduce((x, y) => x + (isChineseWord(y) ? 1 : 0.7), 0);
};

// 将带,;及换行符的字符串转换为数组文本
export const str2Arr: (str: string, needTrim?: boolean) => string[] = (str, needTrim = true) => {
  if (!str) {
    return [];
  }
  str = String(str).trim();
  let res = [];
  if (str.includes(',')) {
    res = str.split(',');
  } else if (str.includes(';')) {
    res = str.split(';');
  } else if (str.includes(' ')) {
    res = str.split(' ');
  } else if (str.includes('\n')) {
    res = str.split('\n');
  } else {
    res = [str];
  }
  res = res.map(item => item.replace(/\n/, ''));
  if (needTrim) {
    res = R.filter(item => item.trim().length > 0)(res);
  }
  return res;
};

// 去除对象值中内容为空的
export const handleTextVal = obj => {
  let inputValue = {};

  Object.entries(obj).forEach(([key, val]: [string, string]) => {
    let value = str2Arr(val);
    inputValue[key] = value.length == 1 ? value[0] : value;
  });
  return inputValue;
};

export const getTableExtraLabel = ({ header, data }) => {
  if (R.isNil(data) || data.length === 0) {
    return [];
  }
  return header.map((item, idx) => `${item}:${data[0][idx]}`);
};

/**
 * https://github.com/reduxjs/redux/blob/6b3e1ceb1ddef4915b9b8e148be66c0806f9fd0a/src/utils/actionTypes.ts#L8
 */
export const getNonce = () =>
  Math.random()
    .toString(36)
    .slice(3);

export const jump = url => router.push(url);

const saveVersion = version => {
  window.localStorage.setItem('version', version);
};

/**
 * 处理当前系统版本号
 * @param param0 系统版本号、更新日期
 */
const readVersion = async ({ version, date }) => {
  onTips(date);

  let localVersion = Number(window.localStorage.getItem('version') || '0.0');
  let serverVersion = Number(version);

  // 版本未更新，退出
  if (serverVersion <= localVersion) {
    return;
  }

  // 否则存储新版本信息;
  saveVersion(version);
};

/**
 * 弹出新功能界面
 * @param date 最近更新时间
 */
const onTips = async date => {
  let [res]: [
    {
      title: string;
      desc: string[] | string;
      url: { title: string; href: string }[] | string;
      img?: string[];
    }
  ] = await axios.axios({
    url: `${window.location.origin}/update.json`,
  });

  let title = window.localStorage.getItem('funcName') || '';

  // 功能弹出过，退出
  if (title === res.title) {
    return;
  }
  window.localStorage.setItem('funcName', res.title);
  notification.info({
    message: res.title,
    description: (
      <div>
        更新时间：{date}
        <br />
        功能描述：
        {Array.isArray(res.desc)
          ? res.desc.map((item, idx) => (
              <div key={item} style={{ margin: '5px 0' }}>
                {idx + 1}.{item}
                <br />
              </div>
            ))
          : res.desc}
        <br />
        {res.url && res.url.length > 0 && <div>本次更新功能链接：</div>}
        {Array.isArray(res.url)
          ? res.url.map((item, idx) => (
              <a href={item.href} target="_blank" key={item.href} style={{ marginRight: 10 }}>
                {idx + 1}: {item.title}
              </a>
            ))
          : res.url &&
            res.url.length > 0 && (
              <a href={res.url} target="_blank">
                点击这里查看
              </a>
            )}
        <br />
        {(res.img || []).map(item => (
          <img src={item} key={item} style={{ width: '100%', maxWidth: 500 }} />
        ))}
      </div>
    ),
    duration: 600,
  });
};

/**
 * 获取系统版本号
 */
export const getVersion = () =>
  axios
    .axios({
      url: `${window.location.origin}/version${DEV ? 'dev' : ''}.json`,
    })
    .then(res => {
      readVersion(res);
      return res;
    });

/**
 *
 * @param {file文件对象，input type="file"} file
 * @param type 'buffer' | 'binary'
 * @desc 将file图像文件对象转换为BASE64
 */
export let loadDataFile: (file: File, type?: 'binary' | 'buffer') => Promise<null | Blob> = async (
  file,
  type = 'buffer'
) => {
  if (typeof FileReader === 'undefined') {
    return Promise.resolve(null);
  }

  let reader: FileReader = new FileReader();
  reader[type === 'buffer' ? 'readAsArrayBuffer' : 'readAsBinaryString'](file);

  return new Promise(resolve => {
    reader.onload = ({ target: { result } }: { target: { result: Blob } }) => {
      resolve(result);
    };
  });
};

export const encodeBase64 = (str: string) => window.btoa(unescape(encodeURIComponent(str)));

export const decodeBase64 = (str: string) => decodeURIComponent(escape(window.atob(str)));
