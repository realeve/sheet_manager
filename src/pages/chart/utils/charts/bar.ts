import util, { TChartConfig } from '../lib';
import jStat from 'jStat';
import theme from './theme';
import * as scatter from './scatter';
import * as histogram from './histogram';
import * as boxplot from './boxplot';
import * as pareto from './pareto';

const R = require('ramda');

let chartConfig: TChartConfig = [
  {
    key: 'x',
    title: 'X轴在数据的索引或键值',
    default: 0
  },
  {
    key: 'y',
    title: 'Y轴在数据的索引或键值',
    default: 1
  },
  {
    key: 'z',
    title: '散点图中散点大小的索引或键值',
    default: '仅在散点图中生效，不设置时默认为20'
  },
  {
    key: 'legend',
    title: '数据序列的索引或键值',
    default:
      '不设置时，legend/x/y默认为0，1，2;如果数据列最多只有2列，则x/y为 0/1',
    url: '/chart#id=8/26f49db157&area=1&type=line'
  },
  {
    key: 'type',
    title: '图表类型',
    default:
      'bar:默认；line:曲线图;scatter:散点图;boxplot:箱线图。其中散点图也可使用横纵互换、标记区域等功能。',
    url: [
      '/chart#id=9/a043209280&type=scatter&legend=0&x=1&y=2',
      '/chart#id=9/a043209280&type=scatter&legend=0&x=1&y=2&markarea=10-15&markareatext=优秀值&reverse=1&markline=8&marktext=良好',
      '/chart#id=11/51742ef993&type=boxplot&x=0&y=1&legend=2&markarea=90-95&markareatext=优秀值',
      '/chart#id=11/51742ef993&type=boxplot&x=0&y=1&legend=2&markarea=90-95&markareatext=优秀值&reverse=1&markline=87'
    ]
  },
  {
    key: 'scattersize',
    title: '散点图中散点大小',
    default: '不设置时默认为20px'
  },
  {
    key: 'scale',
    title: '散点图中散点大小缩放比例',
    default: '1',
    url:
      '/chart#id=9/a043209280&type=scatter&legend=0&x=1&y=2&z=3&scale=1.5&markarea=5-12&markareatext=优秀值'
  },
  {
    key: 'smooth',
    title: '平滑曲线',
    default: '默认1，可选值 1/0  是/否',
    url: '/chart#id=8/26f49db157&area=1&type=line&smooth=0'
  },
  {
    key: 'stack',
    title: '堆叠数据',
    default: 0,
    url: '/chart#id=8/26f49db157&area=1&type=line&stack=1'
  },
  {
    key: 'area',
    title: '曲线图中开启该项则显示面积图',
    default: 0
  },
  {
    key: 'zoom',
    title: '是否显示横向缩放条',
    default: 0
  },
  {
    key: 'zoomv',
    title: '是否显示纵向缩放条',
    default: 0
  },
  {
    key: 'reverse',
    title: '交换x/y轴',
    default: 0
  },
  {
    key: 'pareto',
    title:
      '显示帕累托曲线，只针对单个legend序列的数据。当有多个legend序列时默认对第1项数据处理',
    default: 0,
    url:
      '/chart#id=6/8d5b63370c&data_type=score&x=3&y=4&legend=2&type=line&smooth=1&area=1&pareto=1'
  },
  {
    key: 'min/max',
    title: 'Y轴最小值/最大值',
    default: '自动设置'
  },
  {
    key: 'barWidth 或 barwidth',
    title: '柱状图柱条最大宽度',
    default: 'auto'
  },
  {
    key: 'barshadow',
    title: '显示柱状图背景',
    default: 1,
    url:
      '/chart#id=6/8d5b63370c&data_type=score&x=3&y=4&legend=2&type=bar&barshadow=1'
  },
  {
    key: 'pictorial',
    title: '是否使用象形柱图,仅支持平面坐标系',
    default: 0
  },
  {
    key: 'symbol',
    title: '象形柱图使用三角形/弧形',
    default: '0:三角形,1：弧形',
    url:
      '/chart#id=6/8d5b63370c&data_type=score&x=3&y=4&type=bar&legend=2&pictorial=1&symbol=1'
  },
  {
    key: 'polar',
    title: '极坐标系，与象形柱图不能同时存在',
    default: 0,
    url: [
      '/chart#id=6/8d5b63370c&data_type=score&x=3&y=4&area=1&type=line&legend=2&pictorial=0&polar=1',
      '/chart#id=6/8d5b63370c&data_type=score&x=3&y=4&reverse=1&area=1&type=bar&legend=2&pictorial=0&polar=1&barshadow=1',
      '/chart#id=6/8d5b63370c&data_type=sex&barwidth=20&x=3&y=4&reverse=1&area=1&type=bar&legend=2&pictorial=0&polar=1&barshadow=1&max=4000000'
    ]
  },
  {
    key: 'step',
    title:
      '阶梯线图（也称为步骤图）,是与线图相似的​​图表，但是线在数据点之间形成一系列步骤。当您要显示以不规则间隔发生的更改时，分阶线图可能很有用。例如，奶制品价格上涨，汽油，税率，利率等。开启阶梯图时，smooth平滑选项自动关闭',
    default: '可选值start/middle/end,默认不设置',
    url:
      '/chart#id=6/8d5b63370c&data_type=score&x=3&y=4&area=0&type=line&legend=2&step=start'
  },
  {
    type: 'percent',
    title: '百分比堆叠图，开启该项时，帕累托选项自动关闭',
    default: 0,
    url: '/chart#id=8/26f49db157&area=1&type=line&stack=1&percent=1'
  },
  {
    type: 'markline',
    title: '标记线位置',
    default:
      '主要用在对某一指标设置上限的场景,默认不设置，可设置为Y轴的具体数值，也可设置为max/min/average,分别表示最大值、最小值、平均值。当需要设置多个标记线时使用半角逗号隔开',
    url:
      '/chart#id=6/8d5b63370c&data_type=score&x=3&y=4&legend=2&type=line&smooth=1&markline=750000,average&marktext=上限,avg'
  },
  {
    type: 'marktext',
    title: '标记线显示文本，与markline一一对应',
    default: '如果设置了markline但未设置marktext时，显示对应数据的值。',
    url: '/chart#id=8/26f49db157&type=line&markline=1500&marktext=参考值'
  },
  {
    type: 'markarea',
    title: '标记区域',
    default:
      '标记区域需设置标记的上下限，格式为 min-max，需要设置多个标记区域时使用半角逗号隔开。如markarea=15-30,35-45'
  },
  {
    type: 'markareatext',
    title: '标记区域显示文本，与标记区域一一对应',
    default: '如果设置了markarea但未设置markareatext时，显示对应数据的值。',
    url:
      '/chart#id=8/26f49db157&type=line&markarea=1200-2500,800-1200&markareatext=优秀值,良好值'
  },
  {
    type: 'histogram',
    title:
      '开启直方图模式，此时只允许设置legend及x轴。绘制直方图时，还将自动添加一根概率密度分布曲线。',
    default: '0,默认关闭'
  },
  {
    type: 'multilegend',
    title: '多个序列是否能同时开启，直方图中默认为否',
    default: '1',
    url:
      '/chart#id=11/51742ef993&type=bar&x=1&legend=0&histogram=1&multilegend=1'
  }
];

let symbol: {
  triangle: string;
  roundAngle: string;
} = {
  triangle: 'path://M0,10 L10,10 L5,0 L0,10 z',
  roundAngle: 'path://M0,10 L10,10 C5.5,10 5.5,5 5,0 C4.5,5 4.5,10 0,10 z'
};

let getOption = (options) => {
  let option: {
    x: number;
    y: number;
    legend?: number;
    type?: string;
    smooth?: boolean;
    [key: string]: any;
  };
  switch (options.data.header.length) {
    case 3:
      option = {
        legend: 0,
        x: 1,
        y: 2
      };
      break;
    case 2:
    default:
      option = {
        x: 0,
        y: 1
      };
      break;
  }
  option = Object.assign(
    option,
    {
      type: 'bar',
      smooth: true
    },
    options
  );
  R.forEach((key) => (option[key] = parseInt(option[key], 10)))([
    'x',
    'y',
    'legend'
  ]);
  option.smooth = options.smooth;

  if (options.pictorial && !options.polar) {
    option.type = 'pictorialBar';
  }

  return option;
};

let handleDataWithLegend = (srcData, option) => {
  let { data, header } = srcData;
  let { xAxis, xAxisType } = util.getAxis(srcData, option.x);

  let legendData = util.getUniqByIdx({
    key: header[option.legend],
    data
  });

  let getSeriesData = (name) => {
    let dataList = R.filter(R.propEq(header[option.legend], name))(data);
    let seriesData = R.map((item) => {
      let temp = R.find(R.propEq(header[option.x], item))(dataList);
      return R.isNil(temp) ? '-' : R.prop(header[option.y])(temp);
    })(xAxis);
    return {
      data: seriesData,
      name,
      type: option.type,
      smooth: option.smooth
    };
  };

  let series = R.map(getSeriesData)(legendData);
  return {
    series,
    xAxis,
    xAxisType
  };
};

let handleDataNoLegend = (srcData, option) => {
  let { data } = srcData;
  let { xAxis, xAxisType } = util.getAxis(srcData, option.x);

  let getSeriesData = () => {
    let seriesData = R.map((item) =>
      R.compose(
        R.nth(option.y),
        R.find(R.propEq(option.x, item))
      )(data)
    )(xAxis);
    return {
      data: seriesData,
      type: option.type,
      smooth: option.smooth
    };
  };
  let series = getSeriesData();
  return {
    series,
    xAxis,
    xAxisType
  };
};

let handleData = (srcData, option) => {
  if (R.has('legend', option)) {
    return handleDataWithLegend(srcData, option);
  }
  return handleDataNoLegend(srcData, option);
};

let handleSeriesItem = (option) => (seriesItem) => {
  if (option.area && option.type !== 'bar') {
    seriesItem.areaStyle = {
      normal: {
        opacity: 0.4
      }
    };
  } else if (option.type === 'bar') {
    seriesItem.label = {
      normal: {
        show: true,
        position: 'insideTop'
        // formatter: ({
        //     value
        // }) => value[1]
      }
    };
  }

  if (option.stack) {
    seriesItem.stack = 'All';
  }

  // 堆叠数据需保证数据类型不为字符串
  if (option.stack) {
    seriesItem = R.assoc('data', R.map(util.str2Num)(seriesItem.data))(
      seriesItem
    );
  }

  if (option.barWidth || option.barwidth) {
    seriesItem.barMaxWidth = option.barWidth || option.barwidth;
  }

  if (option.type === 'pictorialBar') {
    seriesItem = Object.assign({}, seriesItem, {
      itemStyle: {
        normal: {
          opacity: 0.6
        },
        emphasis: {
          opacity: 1
        }
      },
      barGap: '0',
      symbol: option.symbol === '0' ? symbol.triangle : symbol.roundAngle
    });
  }

  // 阶梯图
  if (option.step) {
    seriesItem.step = option.step;
    seriesItem.smooth = false;
  }

  return seriesItem;
};

// 堆叠百分比处理
let handlePercentSeries = (series) => {
  const handleItem = (item) => {
    item = parseFloat(item);
    item = R.isNil(item) ? 0 : item;
    return item;
  };

  let sumArr = [];
  series.forEach(({ data }, i) => {
    data.forEach((item, idx) => {
      item = handleItem(item);
      sumArr[idx] = R.isNil(sumArr[idx]) ? item : sumArr[idx] + item;
    });
  });
  series.forEach(({ data }, i) => {
    series[i].data = data.map((item, idx) => {
      item = handleItem(item);
      if (sumArr[idx] === 0) {
        return '-';
      }
      let val = (100 * item) / sumArr[idx];
      return parseFloat(val.toFixed(3));
    });
  });
  return series;
};

// 处理标记线
let handleMarkLine = (series, options) => {
  let { markline, marktext } = options;

  markline = markline.split(',');
  marktext = marktext ? marktext.split(',') : [];

  let data = markline.map((item, i) => {
    let type = ['average', 'min', 'max'].includes(item)
      ? {
          type: item
        }
      : {
          yAxis: parseFloat(item)
        };
    let res = {
      ...type,
      label: {
        normal: {
          show: true,
          formatter: (params) => (marktext[i] ? marktext[i] : params.value)
        }
      }
    };
    return res;
  });

  return series.map((item, idx) => {
    item = Object.assign(item, {
      markLine: {
        symbol: 'none',
        lineStyle: {
          normal: {
            type: 'dashed'
          }
        },
        data
      }
    });
    return item;
  });
};

// 处理标区域
let handleMarkArea = (series, options) => {
  let { markarea, markareatext } = options;

  markarea = markarea.split(',');
  markareatext = markareatext ? markareatext.split(',') : [];

  let data = markarea.map((item, i) => {
    let yAxis = item.split('-').map((value) => parseFloat(value));
    let color = util.hex2rgb(theme.color[i % theme.color.length]);
    color = `rgba(${color},0.2)`;

    return [
      {
        name: markareatext[i] ? markareatext[i] : markarea[i],
        yAxis: yAxis[0],
        itemStyle: {
          color
        }
      },
      {
        yAxis: yAxis[1]
      }
    ];
  });

  series[0] = Object.assign(series[0], {
    markArea: {
      silent: false,
      emphasis: {
        label: {
          position: 'insideRight'
        }
      },
      label: {
        position: 'insideRight',
        fontSize: 15,
        color: '#aaa'
      },
      data
    }
  });
  return series;
};

let handleBarshadow = (series) => {
  let { data, barMaxWidth } = series[0];
  let max = jStat.max(data);
  data = data.map((item) => max);
  series[0].z = 10;
  let seriesItem = {
    type: 'bar',
    itemStyle: {
      normal: {
        color: 'rgba(0,0,0,0.1)'
      }
    },
    silent: true,
    // barWidth: 40,
    barGap: '-100%',
    data
  };
  if (barMaxWidth) {
    seriesItem = Object.assign(seriesItem, { barMaxWidth });
  }
  series.push(seriesItem);
  return series;
};

interface IdataZoomItem {
  type?: string;
  realtime?: boolean;
  start?: number;
  end?: number;
  xAxisIndex?: number;
  yAxisIndex?: number;
  filterMode?: string;
  [key: string]: any;
}
interface IOptionRes {
  xAxis: any;
  series: any;
  yAxis?: any;
  legend?: any;
  xAxisType: any;
  [key: string]: any;
}
let getChartConfig: (
  opt: any
) => {
  xAxis;
  series;
  yAxis;
  legend;
  dataZoom: Array<IdataZoomItem>;
} = (options) => {
  let option = getOption(options);
  let { data } = options;
  let { header } = data;

  let res: IOptionRes = handleData(data, option);

  if (options.histogram) {
    res = histogram.init(options);
  } else if (options.type === 'boxplot') {
    res = boxplot.init(options);
  }

  let { xAxis, series, yAxis, legend, xAxisType } = res;

  let axisOption = {
    nameLocation: 'center',
    nameGap: 30,
    nameTextStyle: {
      fontWeight: 'bold'
    }
  };

  // 处理Y轴信息
  yAxis = yAxis || {
    name: header[option.y],
    ...axisOption
  };

  if (options.max) {
    yAxis.max = parseFloat(options.max);
  }
  if (options.min) {
    yAxis.min = parseFloat(options.min);
  }
  // Y轴处理完毕

  if (!options.histogram && !['boxplot'].includes(options.type)) {
    let dateAxis = util.needConvertDate(R.path(['xAxis', 0], xAxis));
    if (dateAxis) {
      xAxis = R.map(util.str2Date)(xAxis);
    }
  }

  if (!options.histogram && !['boxplot', 'scatter'].includes(options.type)) {
    let xAxisData = R.clone(xAxis);
    xAxis = {
      data: xAxisData,
      name: header[option.x],
      ...axisOption,
      boundaryGap: options.type === 'bar'
    };
  }

  series = R.map(handleSeriesItem(option))(series);

  if (option.percent) {
    series = handlePercentSeries(series);
  }

  if (option.markline) {
    series = handleMarkLine(series, options);
  }

  if (option.markarea) {
    series = handleMarkArea(series, options);
  }

  if (options.type === 'scatter') {
    let res = scatter.init(
      {
        xAxis,
        series
      },
      options,
      data
    );
    series = res.series;
    xAxis = {
      data: xAxis,
      type: xAxisType
    };
  }

  if (option.barshadow) {
    series = handleBarshadow(series);
  }

  return {
    xAxis,
    series,
    yAxis,
    legend,
    dataZoom: [
      {
        type: 'inside',
        realtime: true,
        start: 0,
        end: 100,
        xAxisIndex: 0
      }
    ]
  };
};

let initDefaultOption = (options) => {
  let option = {
    type: options.type || 'bar',
    scattersize: options.scattersize || 20,
    scale: options.scale || 1,
    smooth: options.smooth === '1' ? true : false,
    stack: options.stack === '1' ? true : false,
    area: options.area === '1' ? true : false,
    zoom: options.zoom === '1' ? true : false,
    zoomv: options.zoomv === '1' ? true : false,
    reverse: options.reverse === '1' ? true : false,
    pareto: options.pareto === '1' ? true : false,
    barshadow: options.barshadow === '1' ? true : false,
    pictorial: options.pictorial === '1' ? true : false,
    polar: options.polar === '1' ? true : false,
    percent: options.percent === '1' ? true : false,
    histogram: options.histogram === '1' ? true : false,
    multilegend: options.multilegend === '1' ? true : false
  };
  return Object.assign(
    {
      type: 'bar',
      scattersize: 20,
      scale: 1,
      smooth: true,
      stack: false,
      area: false,
      zoom: false,
      reverse: false,
      pareto: false,
      barshadow: true,
      pictorial: false,
      polar: false,
      percent: false,
      histogram: false,
      multilegend: false
    },
    options,
    option
  );
};

const handleReverse = (config, option) => {
  let { xAxis, yAxis } = R.clone(option);

  option.xAxis = yAxis;
  option.yAxis = xAxis;

  option.grid = {
    left: 100
  };
  option.yAxis.nameGap = 70;

  // 箱线图的散点需要交换顺序
  if (config.type === 'boxplot') {
    option.series.forEach((item, i) => {
      if (item.type === 'scatter') {
        option.series[i].data = option.series[i].data.map((s) => s.reverse());
      }
    });
  }

  // markarea需交换轴信息
  if (config.markarea) {
    option.series.forEach((item, i) => {
      let markArea = option.series[i].markArea;
      if (markArea && markArea.data)
        option.series[i].markArea.data = markArea.data.map((markData) =>
          markData.map((s) => {
            if (s.yAxis) {
              s.xAxis = R.clone(s.yAxis);
              Reflect.deleteProperty(s, 'yAxis');
            }
            return s;
          })
        );
    });
  }

  if (config.markline) {
    option.series.forEach((item, i) => {
      let markLine = option.series[i].markLine;
      if (markLine && markLine.data) {
        option.series[i].markLine.data = markLine.data.map((s) => {
          if (s.yAxis) {
            s.xAxis = R.clone(s.yAxis);
            Reflect.deleteProperty(s, 'yAxis');
          }
          return s;
        });
      }
    });
  }

  return option;
};

// http://localhost:8000/chart#id=6/8d5b63370c&data_type=score&x=3&y=4&legend=2
// test URL: http://localhost:8000/chart/133#type=bar&x=0&y=1&smooth=1&max=100&min=70
// http://localhost:8000/chart/145#type=line&legend=0&x=1&y=2&smooth=1&max=100&min=70
let bar = (options) => {
  options = initDefaultOption(options);
  let option = getChartConfig(options);

  // svg下,markarea有bug
  if (options.markarea) {
    option = Object.assign(option, {
      renderer: 'canvas'
    });
  }

  if (!options.stack) {
    option.dataZoom.push({
      type: 'inside',
      realtime: true,
      start: 0,
      end: 100,
      yAxisIndex: 0
    });
  }

  if (options.reverse) {
    option = handleReverse(options, option);
  }

  if (options.zoom) {
    option.dataZoom.push({
      realtime: true,
      start: 0,
      end: 100
    });
  }

  if (options.zoomv) {
    option.dataZoom.push({
      type: 'slider',
      yAxisIndex: 0,
      filterMode: 'empty'
    });
  }

  // 印制产品颜色处理
  let configs = util.handleColor(option);

  // 帕累托图
  if (!options.percent && options.pareto) {
    configs = pareto.init(option);
  }

  // 极坐标系
  if (options.polar) {
    if (options.reverse) {
      configs.yAxis.nameGap = -40;
      configs = Object.assign(configs, {
        radiusAxis: configs.yAxis,
        polar: {},
        angleAxis: configs.xAxis || {}
      });
    } else {
      configs = Object.assign(configs, {
        radiusAxis: configs.yAxis || {},
        polar: {},
        angleAxis: configs.xAxis
      });
    }
    Reflect.deleteProperty(configs, 'dataZoom');
    Reflect.deleteProperty(configs, 'xAxis');
    Reflect.deleteProperty(configs, 'yAxis');
    configs.series = R.map(R.assoc('coordinateSystem', 'polar'))(
      configs.series
    );
  }

  return configs;
};

export { bar, chartConfig };
