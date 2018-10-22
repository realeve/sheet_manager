import { handleSunBrustData } from './sunburst';

let chartConfig = [
  {
    key: 'type',
    title: '图表类型',
    default: 'treemap',
    url: '/chart#id=8/26f49db157&type=treemap'
  },
  {
    key: 'scale',
    title: '图表矩形长宽比例',
    default: 1.618,
    url: '/chart#id=8/26f49db157&type=treemap&scale=0.6'
  }
];

let treemap = (config) => {
  let { data, header } = config.data;
  config.scale = config.scale || 0.5 * (1 + Math.sqrt(5));

  let seriesData = handleSunBrustData(data, header, false);

  return {
    series: {
      type: config.type,
      data: seriesData,
      squareRatio: parseFloat(config.scale)
      // leafDepth: 3
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      show: false
    },
    toolbox: {}
  };
};

export { treemap, chartConfig };
