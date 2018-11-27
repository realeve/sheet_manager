import theme from './theme';
import { bar } from './bar';
import { pie } from './pie';
import { sunburst } from './sunburst';

import { radar } from './radar';

import { sankey } from './sankey';
import { treemap } from './treemap';
import { themeriver } from './themeriver';

import { paralell } from './paralell';

import { heatmap } from './heatmap';

import { calendar } from './calendar';
import { bar3d } from './bar3d';

export let chartTypeList = [
  [
    { name: '柱形图', value: 'bar', icon: '/img/icons/bar.png' },
    { name: '曲线图', value: 'line', icon: '/img/icons/line.png' },
    { name: '散点图', value: 'scatter', icon: '/img/icons/scatter.png' }
  ],
  [{ name: '箱线图', value: 'boxplot', icon: '/img/icons/boxplot.png' }],
  [{ name: '饼图', value: 'pie', icon: '/img/icons/pie.png' }],
  [{ name: '雷达图', value: 'radar', icon: '/img/icons/radar.png' }],
  [
    {
      name: '旭日图',
      value: 'sunburst'
    },
    {
      name: '桑基图',
      value: 'sankey',
      icon: '/img/icons/sankey.png'
    },
    {
      name: '树图',
      value: 'treemap',
      icon: '/img/icons/treemap.png'
    }
  ],
  [{ name: '事件河流图', value: 'themeriver' }],
  [{ name: '平行坐标系', value: 'paralell', icon: '/img/icons/scatter.png' }],
  [{ name: '热力图', value: 'heatmap', icon: '/img/icons/heatmap.png' }],
  [{ name: '日历图', value: 'calendar', icon: '/img/icons/calendar.png' }],
  [
    {
      name: '3维柱状图',
      value: 'bar3d',
      icon: '/img/icons/bar.png'
    },
    {
      name: '3维曲线图',
      value: 'line3d',
      icon: '/img/icons/line.png'
    },
    {
      name: '3维散点图',
      value: 'scatter3d',
      icon: '/img/icons/scatter.png'
    },
    {
      name: '3维曲面图',
      value: 'surface'
    }
  ]
];
export default {
  bar,
  line: bar,
  scatter: bar,
  boxplot: bar,
  theme,
  pie,
  sunburst,
  radar,
  sankey,
  treemap,
  themeriver,
  paralell,
  heatmap,
  calendar,
  bar3d,
  line3d: bar3d,
  scatter3d: bar3d,
  surface: bar3d
};
