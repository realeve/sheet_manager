import util from '../utils/lib';
import chartOption from '../utils/charts';
import { axios } from '@/utils/axios';
import * as lib from '@/utils/lib';
const R = require('ramda');

// export const fetchData = (params) => axios(params);

export const getQueryConfig = (url, params) => ({
  url,
  params: {
    ...params,
    tstart2: params.tstart,
    tend2: params.tend,
    tstart3: params.tstart,
    tend3: params.tend,
  },
});

const decodeUrlParam = ({ data: params, idx }) => {
  let param = {};
  let handleKey = key => {
    let item = params[key];
    if (R.type(item) !== 'Array') {
      param[key] = item;
    } else {
      param[key] = item[idx] ? item[idx] : R.last(item);
    }
    if (String(param[key]).includes(';')) {
      param[key] = String(param[key]).split(';');
    }
  };
  R.compose(
    R.forEach(handleKey),
    R.keys
  )(params);
  return param;
};

export const decodeHash = ({
  tid,
  query,
  selectValue,
  dateRange: [tstart, tend],
  inputValue,
  dateType,
}) =>
  tid.map((url, idx) => {
    Reflect.deleteProperty(query, 'selectkey');
    Reflect.deleteProperty(query, 'cascade');
    Reflect.deleteProperty(query, 'menufold');
    Reflect.deleteProperty(query, 'textarea');
    Reflect.deleteProperty(query, 'textareakey');
    let dates =
      dateType === 'none'
        ? {}
        : { tstart, tend, tstart2: tstart, tend2: tend, tstart3: tstart, tend3: tend };
    // console.log(dateType);

    let [id, nonce] = url.split('/').filter(item => item.length > 0);

    return decodeUrlParam({
      method: 'post',
      data: {
        id,
        nonce,
        ...query,
        ...dates,
        ...selectValue,
        ...inputValue,
      },
      idx,
    });
  });

export const computeDerivedState = async ({ params }) => {
  console.time(`加载图表${params.nonce}`);
  let dataSrc = await axios({
    method: 'post',
    data: params,
  });
  console.timeEnd(`加载图表${params.nonce}`);
  return getDrivedState({ dataSrc, params });
};

export const getDrivedState = ({ dataSrc, params }) => {
  let option = [];
  if (params.group) {
    let param = params.group;
    if (lib.isInt(param)) {
      param = R.nth(param, dataSrc.header);
    }
    let dataList = R.groupBy(R.prop(param))(dataSrc.data);

    option = R.compose(
      R.map(prefix => {
        let newParam = R.clone(params);
        let newDataSrc = R.clone(dataSrc);
        newDataSrc.data = dataList[prefix];
        if (!params.prefix) {
          newParam.prefix = prefix;
        }
        return getOption({
          dataSrc: newDataSrc,
          params: newParam,
        });
      }),
      R.keys
    )(dataList);
  } else {
    option = [
      getOption({
        dataSrc,
        params,
      }),
    ];
  }

  // if (DEV && option.length) {
  //   console.log(`option=${JSON.stringify(option[0])}`);
  // }

  // console.log(`option=${JSON.stringify(option[0])}`);

  //   dataSrc.data = dataSrc.data.map((item) => Object.values(item));
  return {
    dataSrc,
    option,
  };
};

export const getOption = ({ dataSrc, params }) => {
  let { tstart, tend } = params;
  if (dataSrc.rows) {
    // 根据地址栏参数顺序决定图表配置顺序
    let config = R.clone(params);
    config = Object.assign(config, {
      data: dataSrc,
      dateRange: [tstart, tend],
    });
    let { type } = config;
    type = type || 'bar';

    const opt = dataSrc.data.length === 0 ? {} : chartOption[type](config);
    const showDateRange = dataSrc.dates && dataSrc.dates.length > 0;
    return util.handleDefaultOption(opt, config, showDateRange);
  }

  return {
    tooltip: {},
    xAxis: {
      type: 'category',
    },
    yAxis: {
      type: 'value',
    },
    series: [],
  };
};
