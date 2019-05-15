import { axios } from '@/utils/axios';
const R = require('ramda');
export const fetchData = axios;

// export const fetchData =  ({ url, params }) =>
//   axios({
//     url,
//     params,
//   }).catch(err => {
//     return { err };
//   });

export const handleParams = ({ tid, params, dateRange, dateType }) => {
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
  let option = tid.map(url => ({
    url,
    params: param,
  }));
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
      item.params[key] = params[key][idx];
    });
    return R.clone(item);
    // return JSON.parse(JSON.stringify(item));
  });
};
