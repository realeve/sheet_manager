import util from '../lib';
const R = require('ramda');
interface IChart {
  key: string;
  title: string;
  default?: string;
  url?: string | Array<string>;
}

let chartConfig: Array<IChart> = [
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
    key: 'legend',
    title: '数据序列的索引或键值',
    default: '当legend存在时，legend/x/y默认为0，1，2'
  },
  {
    key: 'type',
    title: '图表类型',
    default: 'pie'
  },
  {
    key: 'doughnut',
    title: '是否显示为环形图。',
    default: '0',
    url:
      '/chart#id=6/8d5b63370c&data_type=sex;score;net_type;dom_loaded;wechat_version;answer_minutes&x=3&y=4&type=pie&legend=2&doughnut=1'
  },
  {
    key: 'rose',
    title: '玫瑰图样式',
    default: 'radius/area,不设置时为默认样式'
  }
];

const getCenterConfig = (legendData) => {
  let len: number = legendData.length;

  let center = [];
  let titlePosition = [];
  switch (len) {
    case 1:
      center = [['50%', '50%']];
      titlePosition = [
        {
          x: '50%',
          y: '0%'
        }
      ];
      break;
    case 2:
      center = [['25%', '50%'], ['75%', '50%']];
      titlePosition = [
        {
          x: '25%',
          y: '30%'
        },
        {
          x: '75%',
          y: '30%'
        }
      ];
      break;
    case 3:
      center = [['20%', '50%'], ['50%', '50%'], ['80%', '50%']];
      titlePosition = [
        {
          x: '20%',
          y: '30%'
        },
        {
          x: '50%',
          y: '30%'
        },
        {
          x: '80%',
          y: '30%'
        }
      ];
      break;
    case 4:
      center = [['25%', '25%'], ['75%', '25%'], ['25%', '75%'], ['75%', '75%']];
      titlePosition = [
        {
          x: '25%',
          y: '5%'
        },
        {
          x: '75%',
          y: '5%'
        },
        {
          x: '25%',
          y: '55%'
        },
        {
          x: '75%',
          y: '55%'
        }
      ];
      break;
    case 5:
      center = [
        ['25%', '25%'],
        ['75%', '25%'],
        ['20%', '75%'],
        ['50%', '75%'],
        ['80%', '75%']
      ];
      titlePosition = [
        {
          x: '25%',
          y: '5%'
        },
        {
          x: '75%',
          y: '5%'
        },
        {
          x: '20%',
          y: '55%'
        },
        {
          x: '50%',
          y: '55%'
        },
        {
          x: '80%',
          y: '55%'
        }
      ];
      break;
    case 6:
      center = [
        ['20%', '25%'],
        ['50%', '25%'],
        ['80%', '25%'],
        ['20%', '75%'],
        ['50%', '75%'],
        ['80%', '75%']
      ];
      titlePosition = [
        {
          x: '20%',
          y: '5%'
        },
        {
          x: '50%',
          y: '5%'
        },
        {
          x: '80%',
          y: '5%'
        },
        {
          x: '20%',
          y: '55%'
        },
        {
          x: '50%',
          y: '55%'
        },
        {
          x: '80%',
          y: '55%'
        }
      ];
      break;
    default:
      center = [['50%', '50%']];
      titlePosition = [
        {
          x: '50%',
          y: '0%'
        }
      ];
      break;
  }
  return {
    center,
    titlePosition
  };
};

let getRadiusLength: string = (legendData: Array<T>) => {
  let len = legendData.length;
  if (len < 3) {
    return '45%';
  } else if (len < 4) {
    return '35%';
  }
  return '30%';
};

let standardPie = ({ option, config }) => {
  option = Object.assign(option, config);
  R.forEach((key) => (option[key] = parseInt(option[key], 10)))(['x', 'y']);

  let { data, header } = config.data;

  let seriesData = [],
    series = [];

  const getSeriesData = R.map((item) => ({
    name: R.prop(header[option.x], item),
    value: R.prop(header[option.y], item)
  }));

  const getSeriesItem = (name, center, data, radiusLen = '50%') => ({
    name,
    type: 'pie',
    radius: option.doughnut ? ['20%', radiusLen] : radiusLen,
    center,
    selectedMode: 'single',
    data,
    itemStyle: {
      emphasis: {
        shadowBlur: 10,
        shadowOffsetX: 0,
        shadowColor: 'rgba(0, 0, 0, 0.5)'
      }
    },
    label: {
      normal: {
        show: true,
        formatter: '{b}\n({d})%'
      }
    }
  });

  let title = util.getDefaultTitle(option, config);

  if (!R.isNil(option.legend)) {
    let legendData = util.getUniqByIdx({
      key: header[option.legend],
      data
    });
    let radiusLen = getRadiusLength(legendData);
    let { center, titlePosition } = getCenterConfig(legendData);
    series = legendData.map((text, i) => {
      let sData = R.filter(R.propEq(header[option.legend], text))(data);
      seriesData = getSeriesData(sData);
      title.push({
        text,
        ...titlePosition[i],
        textStyle: {
          fontSize: 20,
          fontWeight: 'normal'
        },
        textAlign: 'center'
      });
      return getSeriesItem(text, center[i], seriesData, radiusLen);
    });
  } else {
    seriesData = getSeriesData(data);
    series = getSeriesItem(header[option.x], ['50%', '50%'], seriesData);
  }

  // 玫瑰图
  if (['area', 'radius'].includes(option.rose)) {
    series = series.map((item) => {
      item.roseType = option.rose;
      return item;
    });
  }

  return {
    series,
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    // legend: {
    //     show: false
    // },
    toolbox: {},
    title
  };
};

let pie = (config) => {
  let option = {};
  switch (config.data.header.length) {
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
  return standardPie({
    config,
    option
  });
};

export { pie, chartConfig };
