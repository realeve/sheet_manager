import { chartConfig as bar } from './charts/bar';
import { chartConfig as pie } from './charts/pie';
import { chartConfig as sunburst } from './charts/sunburst';

import { chartConfig as radar } from './charts/radar';

import { chartConfig as sankey } from './charts/sankey';
import { chartConfig as treemap } from './charts/treemap';
import { chartConfig as themeriver } from './charts/themeriver';

import { chartConfig as paralell } from './charts/paralell';

import { chartConfig as heatmap } from './charts/heatmap';

import { chartConfig as calendar } from './charts/calendar';
import { chartConfig as bar3d } from './charts/bar3d';

const commonConfig: Array<{
  key: string,
  title: string,
  default?: string
}> = [
  {
    key: 'prefix',
    title: '前缀，该值作为参数请求API，同时将显示在标题的前面',
    default: ''
  },
  {
    key: 'suffix',
    title: '后缀，该值作为参数请求API，同时将显示在标题的后面',
    default: ''
  },
  {
    key: 'height',
    title: '图表高度,默认500'
  },
  {
    key: 'render',
    title: '渲染模式，当某些图表类型渲染异常时，建议改为canvas',
    default: '系统根据图表类型默认自动选择，可选项为 canvas 或 svg'
  }
];
const config = {
  bar: {
    name: '柱状图',
    config: bar
  },
  line: {
    name: '曲线图',
    config: bar
  },
  scatter: {
    name: '散点图',
    config: bar
  },
  boxplot: {
    name: '箱线图',
    config: bar
  },
  pie: {
    name: '饼图',
    config: pie
  },
  sunburst: {
    name: '旭日图',
    config: sunburst
  },
  radar: {
    name: '雷达图',
    config: radar
  },
  sankey: {
    name: '桑基图',
    config: sankey
  },
  treemap: {
    name: '矩形树图',
    config: treemap
  },
  themeriver: {
    name: '主题河流图',
    config: themeriver
  },
  paralell: {
    name: '平行坐标系',
    config: paralell
  },
  heatmap: {
    name: '热力图',
    config: heatmap
  },
  calendar: {
    name: '日历图',
    config: calendar
  },
  bar3d: {
    name: '三维柱状图',
    config: bar3d
  },
  line3d: {
    name: '三维曲线图',
    config: bar3d
  },
  scatter3d: {
    name: '三维散点图',
    config: bar3d
  },
  surface: {
    name: '三维曲面图',
    config: bar3d
  }
};
export default Object.keys(config).map((type) => {
  let item = config[type];
  item.config = Object.assign({}, config, commonConfig);
  return { type, ...item };
});
