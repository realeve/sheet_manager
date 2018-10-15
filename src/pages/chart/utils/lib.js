import gColor from './charts/gColor';
import * as lib from '@/utils/lib';

const R = require('ramda');

// let uniq = arr => Array.from(new Set(arr));

let uniq = arr => R.uniq(arr);

let getCopyRight = () => {
  return {
    text: '©xx有限公司 xx部',
    borderColor: '#999',
    borderWidth: 0,
    textStyle: {
      fontSize: 10,
      fontWeight: 'normal'
    },
    x: 'right',
    y2: 3
  };
};

let handleDefaultOption = (option, config) => {
  let renderer = getRenderer(config);
  let toolbox = option.toolbox || {
    feature: {
      dataZoom: {},
      magicType: {
        type: ['line', 'bar', 'stack', 'tiled']
      }
    }
  };
  toolbox = Object.assign(toolbox, {
    feature: {
      saveAsImage: {
        type: renderer === 'svg' ? 'svg' : 'png'
      }
    }
  });

  option = Object.assign(
    {
      toolbox,
      tooltip: {},
      legend: {},
      title: [
        {
          left: 'center',
          text: config.data.title
        },
        {
          text: config.data.source,
          borderWidth: 0,
          textStyle: {
            fontSize: 10,
            fontWeight: 'normal'
          },
          x: 5,
          y2: 0
        },
        {
          text: `统计时间：${config.dateRange[0]} - ${config.dateRange[1]}`,
          borderWidth: 0,
          textStyle: {
            fontSize: 10,
            fontWeight: 'normal'
          },
          x: 5,
          y2: 18
        },
        getCopyRight()
      ]
    },
    option
  );

  if (['bar', 'line'].includes(config.type)) {
    let axisPointerType = 'shadow';
    let tooltipTrigger = 'axis';
    switch (config.type) {
      case 'bar':
        // case "histogram":
        axisPointerType = 'shadow';
        break;
      case 'line':
        axisPointerType = 'cross';
        break;
      default:
        tooltipTrigger = 'item';
        axisPointerType = 'cross';
        break;
    }
    option.tooltip = {
      trigger: tooltipTrigger,
      axisPointer: {
        type: axisPointerType
      }
    };

    if (config.histogram) {
      option.tooltip = {};
      // Reflect.deleteProperty(option, 'dataZoom');
    }
  }
  return option;
};

// 字符串转日期
let str2Date = str => {
  let needConvert = /^[1-9]\d{3}(0[1-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1])$|^[1-9]\d{3}(0[1-9]|1[0-2])$/.test(
    str
  );
  if (!needConvert) {
    return str;
  }
  let dates = [str.substr(0, 4), str.substr(4, 2)];
  if (str.length === 8) {
    dates[2] = str.substr(6, 2);
  }
  return dates.join('-');
};

let str2Num = str => {
  if (/^(|\-)[0-9]+.[0-9]+$/.test(str)) {
    return parseFloat(parseFloat(str).toFixed(3));
  }
  if (/^(|\-)[0-9]+$/.test(str)) {
    return parseInt(str, 10);
  }
};

let isDate = dateStr => {
  return /^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])|^[1-9]\d{3}(0[1-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1])$/.test(
    dateStr
  );
};

let needConvertDate = dateStr => {
  return /^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])|^[1-9]\d{3}(0[1-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1])$|^[1-9]\d{3}(0[1-9]|1[0-2])$/.test(
    dateStr
  );
};

let getDataByIdx = ({ key, data }) => R.pluck(key)(data);

let getUniqByIdx = ({ key, data }) =>
  R.uniq(
    getDataByIdx({
      key,
      data
    })
  );

let getDataByKeys = ({ keys, data }) => {
  let _data = R.project(keys)(data);
  return R.map(R.values)(_data);
};

const colors = [
  '#da0d68',
  '#975e6d',
  '#e0719c',
  '#f99e1c',
  '#ef5a78',
  '#da1d23',
  '#dd4c51',
  '#3e0317',
  '#e62969',
  '#6569b0',
  '#ef2d36',
  '#c94a44',
  '#b53b54',
  '#a5446f',
  '#f2684b',
  '#e73451',
  '#e65656',
  '#f89a1c',
  '#aeb92c',
  '#4eb849',
  '#f68a5c',
  '#baa635',
  '#f7a128',
  '#f26355',
  '#e2631e',
  '#fde404',
  '#7eb138',
  '#ebb40f',
  '#e1c315',
  '#9ea718',
  '#94a76f',
  '#d0b24f',
  '#8eb646',
  '#faef07',
  '#c1ba07',
  '#b09733',
  '#8f1c53',
  '#b34039',
  '#ba9232',
  '#8b6439',
  '#187a2f',
  '#a2b029',
  '#718933',
  '#3aa255',
  '#a2bb2b',
  '#62aa3c',
  '#03a653',
  '#038549',
  '#28b44b',
  '#a3a830',
  '#7ac141',
  '#5e9a80',
  '#0aa3b5',
  '#9db2b7',
  '#8b8c90',
  '#beb276',
  '#fefef4',
  '#744e03',
  '#a3a36f',
  '#c9b583',
  '#978847',
  '#9d977f',
  '#cc7b6a',
  '#db646a',
  '#76c0cb',
  '#80a89d',
  '#def2fd',
  '#7a9bae',
  '#039fb8',
  '#5e777b',
  '#120c0c',
  '#c94930',
  '#caa465',
  '#dfbd7e',
  '#be8663',
  '#b9a449',
  '#899893',
  '#a1743b',
  '#894810',
  '#ddaf61',
  '#b7906f',
  '#eb9d5f',
  '#ad213e',
  '#794752',
  '#cc3d41',
  '#b14d57',
  '#c78936',
  '#8c292c',
  '#e5762e',
  '#a16c5a',
  '#a87b64',
  '#c78869',
  '#d4ad12',
  '#9d5433',
  '#c89f83',
  '#bb764c',
  '#692a19',
  '#470604',
  '#e65832',
  '#d45a59',
  '#310d0f',
  '#ae341f',
  '#d78823',
  '#da5c1f',
  '#f89a80',
  '#f37674',
  '#e75b68',
  '#d0545f'
];

function hex2rgb(hexVal) {
  var result = '';
  hexVal = hexVal.includes('#') ? hexVal.slice(1) : hexVal;
  switch (hexVal.length) {
    case 3:
      result =
        parseInt(hexVal[0] + '' + hexVal[0], 16) +
        ',' +
        parseInt(hexVal[1] + '' + hexVal[1], 16) +
        ',' +
        parseInt(hexVal[2] + '' + hexVal[2], 16);
      break;
    case 6:
    default:
      result =
        parseInt(hexVal[0] + '' + hexVal[1], 16) +
        ',' +
        parseInt(hexVal[2] + '' + hexVal[3], 16) +
        ',' +
        parseInt(hexVal[4] + '' + hexVal[5], 16);
      break;
  }
  return result;
}

function rgb2hex(rgbVal) {
  rgbVal = rgbVal
    .replace(/rgb/, '')
    .replace(/\(/, '')
    .replace(/\)/, '')
    .split(',');
  rgbVal[0] =
    parseInt(rgbVal[0], 10).toString(16).length === 2
      ? parseInt(rgbVal[0], 10).toString(16)
      : '0' + parseInt(rgbVal[0], 10).toString(16);
  rgbVal[1] =
    parseInt(rgbVal[1], 10).toString(16).length === 2
      ? parseInt(rgbVal[1], 10).toString(16)
      : '0' + parseInt(rgbVal[1], 10).toString(16);
  rgbVal[2] =
    parseInt(rgbVal[2], 10).toString(16).length === 2
      ? parseInt(rgbVal[2], 10).toString(16)
      : '0' + parseInt(rgbVal[2], 10).toString(16);

  return rgbVal;
}

let getLegendData = legendData =>
  legendData.map(name => ({
    name: String(name),
    icon: 'circle'
  }));

let chartGL = ['bar3d', 'line3d', 'scatter3d', 'surface'];

let getRenderer = params =>
  ['paralell', ...chartGL].includes(params.type) || params.histogram
    ? 'canvas'
    : 'svg';

let getChartHeight = (params, { series }) => {
  // , ...chartGL
  let height = ['sunburst', 'sankey', 'paralell'].includes(params.type)
    ? '900px'
    : chartGL.includes(params.type)
      ? '700px'
      : '500px';
  if (params.type === 'calendar') {
    if (!R.isNil(series)) {
      height = 100 + series.length * (6 * params.size + 70) + 'px';
    } else {
      height = '800px';
    }
  }
  return height;
};

// 处理minmax值至最佳刻度，需要考虑 >10 及 <10 两种场景以及负数的情况
let handleMinMax = ({ min, max }) => {
  let exLength = String(Math.floor(max)).length - 1;
  if (max > 10) {
    return {
      max: Math.ceil(max / 10 ** exLength) * 10 ** exLength,
      min: min - (min % 10 ** exLength)
    };
  }
  return {
    max: Math.ceil(max / 1) * 1,
    min: min > 0 ? min - (min % 1) : Math.floor(min / 1) * 1
  };
};

let getLegend = ({ data, legend }, selectedMode = 'single') => {
  if (R.isNil(legend)) {
    return {
      show: false
    };
  }
  let key = data.header[legend];
  let legendData = getUniqByIdx({
    key,
    data: data.data
  });
  return {
    selectedMode,
    data: getLegendData(legendData)
  };
};

// 获取指定key对应的轴数据
let getAxis = ({ data, header }, key) => {
  let xAxis = getUniqByIdx({
    key: header[key],
    data
  });
  let xAxisType = lib.getType(xAxis[0]) === 'number' ? 'value' : 'category';

  if (xAxisType === 'value') {
    xAxis = R.sort((a, b) => a - b)(xAxis);
  }
  return {
    xAxis,
    xAxisType
  };
};

export default {
  handleMinMax,
  getLegend,
  getLegendData,
  hex2rgb,
  rgb2hex,
  isDate,
  needConvertDate,
  uniq,
  getCopyRight,
  handleDefaultOption,
  str2Date,
  str2Num,
  handleColor: gColor.handleColor,
  getUniqByIdx,
  getDataByIdx,
  colors,
  getDataByKeys,
  getRenderer,
  getChartHeight,
  getAxis
};
