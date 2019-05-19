import { axios } from '@/utils/axios';
const R = require('ramda');
export const fetchData = axios;

export const handleParams = ({ tid, params, dateRange, dateType, textAreaList }) => {
  const [tstart, tend] = dateRange;
  let param =
    dateType === 'none'
      ? {
          mode: 'array',
        }
      : {
          tstart,
          tend,
          tstart2: tstart,
          tend2: tend,
          tstart3: tstart,
          tend3: tend,
          mode: 'array',
        };

  let method = textAreaList.length > 0 ? 'post' : 'get';
  let option = tid.map(url => {
    if (!url.includes('http')) {
      let [id, nonce] = url.split('/').filter(item => item.length > 0);
      return {
        data: { ...param, id, nonce },
        method,
      };
    }
    return {
      url,
      data: param,
      method,
    };
  });
  let paramKeys = Object.keys(params);

  // 对传入参数补齐
  paramKeys.forEach(key => {
    let val = params[key];
    if (R.is(String, val)) {
      val = [val];
    }
    let lastVal = R.last(val);
    // 对后几个元素填充数据
    for (let i = val.length; i < option.length; i++) {
      val[i] = lastVal;
    }
    params[key] = val;
  });

  return option.map((item, idx) => {
    paramKeys.forEach(key => {
      item.data[key] = params[key][idx];
    });
    if (item.method === 'get') {
      let {
        url,
        data: { id, nonce, ...data },
        method,
        ...appendParam
      } = item;
      item = {
        ...appendParam,
        url: url || `${id}/${nonce}`,
        params: data,
        method,
      };
    }
    return R.clone(item);
  });
};
