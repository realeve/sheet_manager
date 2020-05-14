import { axios } from '@/utils/axios';
const R = require('ramda');
export const fetchData = async cfg => {
  if (!(cfg.params || cfg.data).innerjoin) {
    return axios(cfg);
  }

  /**
   * 2020-03-13 李宾
   * 处理数据关联，用法如下:
   * &innerjoin=527/3dc3d3d2da&innerjoinkey=carts
   * a:如果有数据关联的场景，则blob字段第一次不发送，blob_type第一次也不发送；
   * b:第一次数据加载完毕后，再请求一次innerjoin中的数据，得到的结果作为最终结果
   *
   * 该设定主要用于如下场景：
   *
   * 需要从数据库1中查询一组信息，返回结果为一列数据A，将数据列A赋值为innerjoinkey设定的参数，再由innerjoin请求数据，最终结果作为返回记录
   * 1.请求 id-->  数据 A ————>  carts = A
   * 2.请求 innerjoin，参数carts，得到结果B
   * 3.返回B
   *
   */
  let { blob, blob_type, ...params } = R.clone(cfg.params || cfg.data);
  cfg.params = params;
  let res = await axios(cfg);
  if (res.rows == 0) {
    return res;
  }

  // 第一步请求结果
  let leftData = res.data.map(item => Object.values(item)[0]);

  // 二次数据请求，拼装字段
  let url = params.innerjoin;
  let id = url.split('/')[0];
  let nonce = url.split('/')[1];
  let method = 'post';
  if (blob) {
    params.blob = blob;
  }
  if (blob_type) {
    params.blob_type = blob_type;
  }

  let data = R.clone(params);

  Reflect.deleteProperty(data, 'innerjoin');
  Reflect.deleteProperty(data, 'innerjoinkey');

  // 数据注入
  data[params.innerjoinkey] = leftData;

  return axios({ data: { id, nonce, ...data }, method });
};

export const handleParams = ({ tid, params, dateRange, dateType, textAreaList, ...props }) => {
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

  let method = (textAreaList || []).length > 0 ? 'post' : 'get';
  let option = (tid || props.id).map(url => {
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
