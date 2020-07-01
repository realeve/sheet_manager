import util from '../lib';
import jStat from 'jstat';
const R = require('ramda');

let chartConfig = [
  {
    key: 'type',
    title: '图表类型',
    default: 'heatmap',
    url: [
      '/chart#id=16/48add90c27&type=heatmap&legend=0',
      '/chart#id=16/48add90c27&type=heatmap&legend=0&x=1&y=2',
    ],
  },
  {
    key: 'x',
    title:
      'X轴在数据的索引或键值。由于热力图中x,y均为类目型数据，请在数据结构中做好legend/X/Y的排序.',
    default: 0,
  },
  {
    key: 'y',
    title: 'Y轴在数据的索引或键值',
    default: 1,
  },
  {
    key: 'z',
    title: '数据值的索引或键值',
  },
  {
    key: 'legend',
    title: '数据序列的索引或键值',
    default:
      '不设置时，数据超过2列，legend/x/y默认为0，1，2;如果数据列最多只有2列，则x/y为 0/1。legend只允许选择单项',
  },
];

let getAxisX = ({ x, data }) => ({
  type: 'category',
  data: util.getUniqByIdx({
    key: data.header[x],
    data: data.data,
  }),
  splitArea: {
    show: true,
  },
  axisLine: {
    show: false,
  },
});

let getAxisY = ({ y, data }) => ({
  type: 'category',
  data: util.getUniqByIdx({
    key: data.header[y],
    data: data.data,
  }),
  splitArea: {
    show: true,
  },
  axisTick: {
    show: false,
  },
  axisLine: {
    show: false,
  },
});

let getVisualMap = ({ z, data }) => {
  let key = R.pluck(data.header[z])(data.data);
  key = R.map(item => Number(item))(key);
  let minmax = {
    max: jStat.max(key),
    min: jStat.min(key),
  };
  minmax = util.handleMinMax(minmax);
  return {
    ...minmax,
    precision: 1,
    calculable: true,
    orient: 'horizontal',
    left: 'center',
    bottom: -15,
    color: ['#45527a', '#f44'],
  };
};

let getSeries = ({ data, x, y, z, legend }, xAxis, yAxis) => {
  let { header } = data;
  let key = header[z];
  let srcData = [];

  let heatmapStyle = {
    label: {
      normal: {
        show: true,
      },
    },
    itemStyle: {
      emphasis: {
        shadowBlur: 10,
        shadowColor: 'rgba(0, 0, 0, 0.5)',
      },
    },
  };

  // 数据预处理，只保留需要的x,y,z,legend
  if (R.isNil(legend)) {
    srcData = util.getDataByKeys({
      keys: [header[x], header[y], key],
      data: data.data,
    });
  } else {
    srcData = util.getDataByKeys({
      keys: [header[legend], header[x], header[y], key],
      data: data.data,
    });
  }

  let xAxisIndex = {},
    yAxisIndex = {};
  xAxis.forEach((axisName, id) => {
    xAxisIndex[axisName] = id;
  });

  yAxis.forEach((axisName, id) => {
    yAxisIndex[axisName] = id;
  });

  if (R.isNil(legend)) {
    return [
      {
        data: srcData.map(([x, y, z]) => [xAxisIndex[x], yAxisIndex[y], z]),
        type: 'heatmap',
        ...heatmapStyle,
      },
    ];
  }

  let legendData = util.getUniqByIdx({
    key: header[legend],
    data: data.data,
  });

  return legendData.map(name => {
    let seriesItem = R.filter(R.propEq(0, name))(srcData);
    return {
      name,
      data: seriesItem.map(([, x, y, z]) => [xAxisIndex[x], yAxisIndex[y], z]),
      type: 'heatmap',
      ...heatmapStyle,
    };
  });
};

let handleConfig = config => {
  let { legend, x, y, z } = config;
  let { header } = config.data;
  if (header.length > 3) {
    x = x || 1;
    y = y || 2;
    z = z || 3;
  } else {
    x = x || 0;
    y = y || 1;
    z = z || 2;
  }

  return Object.assign(config, {
    x,
    y,
    z,
    legend,
  });
};

const heatmap = config => {
  config = handleConfig(config);
  let legend = util.getLegend(config);
  let xAxis = getAxisX(config);
  let yAxis = getAxisY(config);
  let visualMap = getVisualMap(config);
  let series = getSeries(config, xAxis.data, yAxis.data);

  return {
    tooltip: {
      trigger: 'item',
      position: 'top',
    },
    legend,
    xAxis,
    yAxis,
    visualMap,
    series,
  };
};

export { heatmap, chartConfig };
