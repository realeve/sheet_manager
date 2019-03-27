import util from '../utils/lib';
import chartOption from '../utils/charts';
import { axios } from '@/utils/axios';
import { DEV } from '@/utils/setting';
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

const decodeUrlParam = ({ params, idx }) => {
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

export const decodeHash = ({ tid, query, selectValue, dateRange: [tstart, tend] }) =>
  tid.map((url, idx) => {
    Reflect.deleteProperty(query, 'selectkey');
    Reflect.deleteProperty(query, 'cascade');
    Reflect.deleteProperty(query, 'menufold');

    let params = decodeUrlParam({
      url,
      params: {
        ...query,
        tstart,
        tend,
        tstart2: tstart,
        tend2: tend,
        tstart3: tstart,
        tend3: tend,
        ...selectValue,
      },
      idx,
    });

    return {
      url,
      params,
    };
  });

export const computeDerivedState = async ({ url, params }) => {
  console.time(`加载图表数据开始`);
  let dataSrc = await axios({
    url,
    params,
  });
  console.timeEnd(`加载图表数据完成`);
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
