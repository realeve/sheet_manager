import util from '../lib';
import jStat from 'jStat';
import theme from './theme';
const R = require('ramda');

let chartConfig = [
  {
    key: 'type',
    title: '图表类型',
    default: 'radar。雷达图默认第一列为序列名称，后续列为需要比较的各项数据'
  },
  {
    key: 'area',
    title: '显示面积图',
    default: 0
  },
  {
    key: 'circleshape',
    title: '雷达图背景使用圆形或多边形',
    default: 0,
    url: '/chart#id=10/51ccc896d2&type=radar&area=1&circleshape=1'
  }
];

let getColMax = (name, data) => {
  let arr = R.pluck(name, data);
  let max = jStat.max(arr);
  return Math.ceil(max / 100) * 100;
};

let radar = (config) => {
  let { header, data } = config.data;
  let headerList = R.tail(header);

  let radar = {
    indicator: headerList.map((name) => ({
      name,
      max: getColMax(name, data)
    }))
  };

  if (config.circleshape || config.circleshape === '1') {
    radar.shape = 'circle';
  }

  let legendData = util.getUniqByIdx({
    key: header[0],
    data
  });

  let series = legendData.map((name, i) => {
    let seriesItem = R.find(R.propEq(header[0], name))(data);
    let setting = {
      data: [R.tail(R.values(seriesItem))],
      name,
      type: 'radar',
      symbol: 'none',
      itemStyle: {
        color: theme.color[i]
      }
    };
    if (config.area || config.area === '1') {
      setting = Object.assign(setting, {
        areaStyle: {
          type: 'default',
          opacity: 0.2
        }
      });
    }
    return setting;
  });

  return {
    radar,
    series,
    tooltip: {
      trigger: 'item'
    },
    legend: {
      show: true,
      data: legendData.map((name) => ({
        name,
        icon: 'circle'
      }))
    },
    toolbox: {}
  };
};

export { radar, chartConfig };
