import util, { TChartConfig } from '../lib';
import * as R from 'ramda';

export interface BarStyle {
  type: string;
  barWidth: number;
  barGap: string;
  stack: string;
  silent: boolean;
  [key: string]: any;
}

export interface IndexCfg extends BarStyle {
  name: string;
  data: number[];
  itemStyle: {
    color: string;
  };
}

let chartConfig: TChartConfig = [
  {
    key: 'type',
    title: '图表类型',
    default: 'bullet',
    url: [],
  },
  {
    key: 'x',
    title: 'X轴，用于需要对比的各个指标.',
    default: 0,
  },
  {
    key: 'y',
    title: '对应指标的期望完成值',
    default: 1,
  },
  {
    key: 'y2',
    title: '对应指标的实际完成值',
    default: 2,
  },
  {
    key: 'level',
    title: '各指标等级，依次为差,良,中,优，用逗号隔开',
    default:
      '3,4,5,6 表示3-6列分别为差至优的等级。在接口中的别名分别对应展示的文字(第3列起默认为差/良/中/优)。如果评价等级只有3级，如设为3,4,5，别名设置为差、良、优',
    url: [
      '/chart#id=75/be3010cfeb&type=bullet&level=3,4,5',
      '/chart#id=75/be3010cfeb&type=bullet&level=3,4,5,6',
    ],
  },
  {
    key: 'max',
    title: '指标最大值',
    default: 100,
    url: ['/chart#id=75/be3010cfeb&type=bullet&max=130'],
  },
  {
    key: 'revert',
    title: '翻转X/Y',
    default: '0:false',
    url: ['/chart#id=75/be3010cfeb&type=bullet&reverse=1', '/chart#id=75/be3010cfeb&type=bullet'],
  },
];

const handleStackData = option => {
  let { header, data } = option.data;
  let levelCfg: string = option.level;
  let levelIdx: string[] = levelCfg.split(',');
  let levelText: string[] = levelIdx.map(idx => header[idx]);
  levelText = ['低于' + levelText[0], ...levelText];
  let max: number | string = option.max;

  let levelColor: string[] = ['#d3d3d3', '#FFA39E', '#FFD591', '#91D5FF', '#A7E8B4'];

  const indexStyle: BarStyle = {
    type: 'bar',
    barWidth: 50,
    barGap: '-130%',
    stack: '指标范围',
    silent: true,
  };

  let levelDataList: any[] = levelIdx.map(level =>
    util.getDataByIdx({
      key: header[level],
      data,
    })
  );
  levelDataList.push(new Array(levelDataList[0].length).fill(parseInt(String(max), 10)));

  // 堆叠数据还原，逆向减操作
  for (let i: number = levelDataList.length - 1; i > 0; i--) {
    let curCol: number[] = levelDataList[i];
    let nextCol: number[] = levelDataList[i - 1];
    for (let j: number = 0; j < curCol.length; j++) {
      levelDataList[i][j] = curCol[j] - nextCol[j];
    }
  }

  let levelData: IndexCfg[] = levelDataList.map((data, idx) => ({
    ...indexStyle,
    name: levelText[idx],
    data,
    itemStyle: {
      color: levelColor[5 - levelText.length + idx], // 如果只有优良差三级的时候，levelText为4，区间范围自动加1
    },
  }));
  return { levelData, levelText };
};

const getShape = ({ x, y, reverse }) => {
  let shape: {
    x1: number;
    x2: number;
    y1: number;
    y2: number;
  } = {
    x1: x,
    x2: x,
    y1: y - 30,
    y2: y + 20,
  };

  if (reverse) {
    shape = {
      x1: x - 30,
      x2: x + 20,
      y1: y,
      y2: y,
    };
  }
  return shape;
};

const renderItem = (api, reverse) => {
  const [x, y]: number[] = api.coord([api.value(0), api.value(1)]);
  let shape = getShape({ x, y, reverse });
  return {
    type: 'group',
    children: [
      {
        type: 'line',
        shape,
        style: {
          stroke: api.visual('color'),
          lineWidth: 4,
        },
      },
    ],
  };
};

const bullet = option => {
  let { header, data } = option.data;
  option = Object.assign(
    {
      x: 0,
      y: 1,
      y2: 2,
      level: '3,4,5,6',
      reverse: '0',
      max: 100,
    },
    option
  );

  let xIdx: number | string = option.x;
  let targetIdx: number | string = option.y;
  let actualIdx: number | string = option.y2;

  let reverse: boolean = option.reverse == '1';

  let xAxisData: any[] = util.getDataByIdx({
    key: header[xIdx],
    data,
  });
  let yAxisData: any[] = util.getDataByIdx({
    key: header[targetIdx],
    data,
  });
  let actualData: any[] = util.getDataByIdx({
    key: header[actualIdx],
    data,
  });

  let { levelText, levelData } = handleStackData(option);

  let configX = {
    data: xAxisData,
    axisLine: {
      show: false,
    },
    axisTick: {
      show: false,
    },
  };
  let configY = {
    splitLine: {
      show: false,
    },
  };

  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
      formatter(params) {
        let [target, actual, ...levels] = params;
        levels = levels.map(({ seriesName, value }) => ({
          seriesName,
          value,
        }));
        levels.forEach((_, idx) => {
          if (idx) {
            levels[idx].value += levels[idx - 1].value;
          }
        });
        let curLevel: number = -1;
        levels.forEach((item, idx) => {
          if (actual.value >= item.value) {
            curLevel = idx;
          }
        });

        let curText: string = levels[curLevel + 1].seriesName;

        let levelDst = R.clone(levels).map((item, idx) => {
          if (idx === 0) {
            item.value = `0 ~ ${levels[idx].value}`;
          } else {
            item.value = `${levels[idx - 1].value} ~ ${levels[idx].value}`;
          }
          return item;
        });

        let detail: string = [target, actual, ...levelDst]
          .map(({ seriesName, value }) => `${seriesName}: ${value}`)
          .join('<br>');
        return `${target.name}<strong style="color:#f67;"> (${curText}) </strong><br><br>
        ${detail} 
        `;
      },
    },
    legend: {
      data: ['目标值', '实际值', ...levelText].map(name => ({
        name,
        icon: 'circle',
      })),
      selectedMode: false,
      top: 40,
    },
    yAxis: reverse ? configY : configX,
    xAxis: reverse ? configX : configY,
    color: ['#47467c', '#e23273'],
    series: [
      {
        type: 'bar',
        name: '目标值',
        data: yAxisData,
        barWidth: 30,
        z: 9,
      },
      {
        type: 'custom',
        name: '实际值',
        renderItem: (_, api) => renderItem(api, reverse),
        data: actualData,
        z: 10,
      },
      ...levelData,
    ],
  };
};

export { bullet, chartConfig, handleStackData, getShape, renderItem };
