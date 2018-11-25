import util from '../utils/lib';
import chartOption from '../utils/charts';
import { axios, DEV } from '@/utils/axios';
import * as lib from '@/utils/lib';
const R = require('ramda');

export const fetchData = (params) => axios(params);

export const getQueryConfig = (url, params) => ({
  url,
  params: {
    ...params,
    tstart2: params.tstart,
    tend2: params.tend,
    tstart3: params.tstart,
    tend3: params.tend
  }
});

const decodeUrlParam = ({ url, params, idx }) => {
  let param = {};
  let handleKey = (key) => {
    let item = params[key];
    if (R.type(item) !== 'Array') {
      param[key] = item;
    } else {
      param[key] = item[idx] ? item[idx] : R.last(item);
    }
    if (param[key].includes(';')) {
      param[key] = param[key].split(';');
    }
  };
  R.compose(
    R.forEach(handleKey),
    R.keys
  )(params);
  return param;
};

export const decodeHash = ({ tid, query, tstart, tend }) =>
  tid.map((url, idx) => {
    let params = decodeUrlParam({
      url,
      params: {
        ...query,
        tstart,
        tend,
        tstart2: tstart,
        tend2: tend,
        tstart3: tstart,
        tend3: tend
      },
      idx
    });
    return {
      url,
      params
    };
  });

export const computeDerivedState = async ({ url, params, idx }) => {
  console.time(`加载图表${idx + 1}数据`);
  let dataSrc = await axios({
    url,
    params
  });

  console.log('增加数据分组');
  let option = [];
  if (params.group) {
    let param = params.group;
    if (lib.isInt(param)) {
      param = R.nth(param, dataSrc.header);
    }
    let dataList = R.groupBy(R.prop(param))(dataSrc.data);
    option = R.compose(
      R.map((prefix) => {
        let newParam = R.clone(params);
        let newDataSrc = R.clone(dataSrc);
        newDataSrc.data = dataList[prefix];
        if (!params.prefix) {
          newParam.prefix = prefix;
        }
        return getOption({
          dataSrc: newDataSrc,
          params: newParam,
          idx
        });
      }),
      R.keys
    )(dataList);
  } else {
    option = [
      getOption({
        dataSrc,
        params,
        idx
      })
    ];
  }

  if (DEV && option.length === 1) {
    console.log(`option=${JSON.stringify(option)}`);
  }
  console.timeEnd(`加载图表${idx + 1}数据`);
  return {
    dataSrc,
    option,
    loading: false
  };
};

export const getOption = ({ dataSrc, params, idx }) => {
  let { tstart, tend } = params;
  if (dataSrc.rows) {
    // 根据地址栏参数顺序决定图表配置顺序
    let config = R.clone(params);
    config = Object.assign(config, {
      data: dataSrc,
      dateRange: [tstart, tend]
    });
    let { type } = config;
    type = type || 'bar';

    const opt = dataSrc.data.length === 0 ? {} : chartOption[type](config);
    return util.handleDefaultOption(opt, config);
  }

  return {
    tooltip: {},
    xAxis: {
      type: 'category'
    },
    yAxis: {
      type: 'value'
    },
    series: []
  };
};
