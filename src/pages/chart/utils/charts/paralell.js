import util from '../lib';
import * as lib from '@/utils/lib';
import jStat from 'jstat';
const R = require('ramda');

let chartConfig = [
  {
    key: 'type',
    title: '图表类型',
    default: 'paralell',
    url: '/chart#id=15/440962596e&type=paralell&visual=0',
  },
  {
    key: 'sequence',
    title: 'header中各字段序列',
    default: '默认按接口中输出字段的顺序进行，最后一列为数据字段。',
    url: '/chart#id=14/52e11ab939&legend=0&type=paralell&sequence=1,2,3,4,5,6,7,8,9,10,11,12,13',
  },
  {
    key: 'legend',
    title: '数据序列的索引或键值',
    default: '不设置时，默认无legend',
    url: '/chart#id=14/52e11ab939&legend=0&type=paralell',
  },
  {
    key: 'visual',
    title: '以第几个数据作为颜色索引序列',
    default: 0,
    url: [
      '/chart#id=14/52e11ab939&legend=0&type=paralell&visual=1',
      '/chart#id=15/440962596e&type=paralell&visual=0',
    ],
  },
  {
    key: 'vertical',
    title: '垂直布局',
    default: '0,关闭时水平布局',
    url: '/chart#id=15/440962596e&type=paralell&visual=0&vertical=1',
  },
  // {
  //     key: 'blackbg',
  //     title: '是否使用黑色背景',
  //     default: 1,
  //     url: ['/chart#id=15/440962596e&type=paralell&visual=0&blackbg=0']
  // }
];

let getParalellBg = ({ blackbg }) =>
  blackbg
    ? {
        nameTextStyle: {
          color: '#aaa',
          fontSize: 14,
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: '#aaa',
          },
        },
        axisTick: {
          lineStyle: {
            color: '#999',
          },
        },
        splitLine: {
          show: false,
        },
        axisLabel: {
          textStyle: {
            color: '#fff',
          },
        },
      }
    : {
        nameTextStyle: {
          color: '#333',
          fontSize: 12,
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: '#333',
          },
        },
        axisTick: {
          lineStyle: {
            color: '#333',
          },
        },
        splitLine: {
          show: false,
        },
        axisLabel: {
          textStyle: {
            color: '#333',
          },
        },
      };

let handleSeriesItem = (config, keys, legendName, legendKey) => {
  let seriesData = R.isNil(legendName)
    ? config.data.data
    : R.filter(R.propEq(legendKey, legendName))(config.data.data);
  let seriesItem = util.getDataByKeys({
    keys,
    data: seriesData,
  });
  return {
    name: R.isNil(legendName) ? '平行坐标系' : String(legendName),
    type: 'parallel',
    lineStyle: {
      normal: {
        width: 1,
        opacity: 0.5,
      },
    },
    data: seriesItem,
    smooth: config.smooth,
    progressiveChunkMode: 'mod',
    progressive: 500,
  };
};

export let getDataSequence = ({ header, sequence, legend }) => {
  if (R.isNil(sequence)) {
    if (R.isNil(legend)) {
      return header;
    }
    return R.reject(R.equals(header[legend]))(header);
  }
  sequence = sequence.split(',');
  return R.map(idx => header[idx])(sequence);
};

let getMinMax = (dataSequence, data, idx) => {
  let key = dataSequence[idx];
  let dataByKey = R.pluck(key)(data);
  return {
    max: jStat.max(dataByKey),
    min: jStat.min(dataByKey),
  };
};

let getParallelAxis = (dataSequence, [seriesData], data) =>
  dataSequence.map((name, dim) => {
    let res = {
      dim,
      name,
    };
    if (!lib.isNumOrFloat(seriesData[dim])) {
      res.type = 'category';
    } else {
      let minMax = util.handleMinMax(getMinMax(dataSequence, data, dim));
      res = {
        ...res,
        ...minMax,
      };
    }
    return res;
  });

let getVisualMap = (dataSequence, data, dimension) => ({
  show: true,
  dimension,
  calculable: true,
  ...getMinMax(dataSequence, data, dimension),
  inRange: {
    color: ['#50a3ba', '#a2ca36', '#e92312'],
  },
});

let paralell = config => {
  config.smooth = config.smooth === '0' ? false : true;
  config.visual = config.visual || 0;
  config.blackbg = config.blackbg === '0' ? false : true;
  config.vertical = config.vertical || false;

  let { data, header } = config.data;
  let dataSequence = getDataSequence({
    data,
    header,
    legend: config.legend,
  });
  let legendData = [];
  let seriesData = [];
  if (!R.isNil(config.legend)) {
    let legendKey = header[config.legend];
    legendData = util.getUniqByIdx({
      key: legendKey,
      data,
    });
    seriesData = legendData.map(legendName =>
      handleSeriesItem(config, dataSequence, legendName, legendKey)
    );
  } else {
    seriesData = [handleSeriesItem(config, dataSequence)];
  }

  let parallelAxis = getParallelAxis(dataSequence, seriesData[0].data, data);
  let visualMap = getVisualMap(dataSequence, data, config.visual);

  let bg = getParalellBg(config);
  let [left, right] = ['5%', '10%'];
  if (config.orient === 'vertical') {
    left = '18%';
    right = '5%';
  }

  let option = {
    tooltip: {},
    parallelAxis,
    visualMap,
    parallel: {
      left,
      right,
      top: 60,
      axisExpandable: true,
      parallelAxisDefault: {
        type: 'value',
        nameLocation: 'start',
        nameGap: 20,
        ...bg,
      },
      layout: config.vertical ? 'vertical' : 'horizontal',
    },
    series: seriesData,
    toolbox: {},
    blendMode: 'lighter',
    legend: {
      show: false,
    },
  };

  if (config.blackbg) {
    option.backgroundColor = '#445';
  }

  if (!R.isNil(config.legend)) {
    option.legend = {
      data: util.getLegendData(legendData),
    };
  }
  return option;
};

export { paralell, chartConfig };
