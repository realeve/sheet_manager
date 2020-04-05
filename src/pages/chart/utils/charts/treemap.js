import { handleSunBrustData } from './sunburst';
import * as R from 'ramda';

let chartConfig = [
  {
    key: 'type',
    title: '图表类型',
    default: 'treemap。可选为 tree/treemap，前者为树图，后者为矩形树图',
    url: '/chart#id=8/26f49db157&type=treemap',
  },
  {
    key: 'scale',
    title: '图表矩形长宽比例',
    default: 1.618,
    url: '/chart#id=8/26f49db157&type=treemap&scale=0.6',
  },
  {
    key: 'orient',
    title: "可选值为'LR' , 'RL', 'TB', 'BT',分别代表左右、右左、上下、下上",
    default: 'LR',
  },
  {
    key: 'radial',
    title:
      '树图的布局，有 正交 和 径向 两种，设为1时为径向。这里的 正交布局 就是我们通常所说的 水平 和 垂直 方向。而 径向布局 是指以根节点为圆心，每一层节点为环，一层层向外发散绘制而成的布局',
    default: '0',
  },
];

let treemap = config => {
  let { data, header } = config.data;
  config.scale = config.scale || 0.5 * (1 + Math.sqrt(5));

  let seriesData = handleSunBrustData(data, header, false);
  let sum = R.compose(R.sum, R.pluck('value'))(seriesData);

  let orient = config.orient || 'LR';
  let radial = config.radial || '0';
  let layout = {};
  if (radial !== '0') {
    layout = { layout: 'radial' };
  }

  return {
    series: {
      type: config.type,
      data: seriesData,
      squareRatio: parseFloat(config.scale),
      orient,
      ...layout,
      // leafDepth: 3
    },
    tooltip: {
      trigger: 'item',
      formatter({ data: { name, value } }) {
        return `${name}:${value}(${((value * 100) / sum).toFixed(2)}%)`;
      },
    },
    legend: {
      show: false,
    },
    toolbox: {},
  };
};

export { treemap, chartConfig };
