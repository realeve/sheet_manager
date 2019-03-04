import util from '../lib';

let chartConfig = [
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
    title: '依次为差,良,中,优，用逗号隔开',
    default:
      '3,4,5,6  表示3-6列分别为差至优的等级。在接口中的别名分别对应展示的文字，默认为差，良，中优',
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

const bullet = option => {
  let { header, data } = option.data;

  let xIdx = option.x || 0;
  let targetIdx = option.y || 1;
  let actualIdx = option.y2 || 2;
  let levelIdx = option.level || '3,4,5,6';
  levelIdx = levelIdx.split(',');
  let levelText = levelIdx.map(idx => header[idx]);
  levelText = ['低于' + levelText[0], ...levelText];

  let reverse = option.reverse == '1' || false;

  let max = option.max || 100;

  let xAxisData = util.getDataByIdx({
    key: header[xIdx],
    data,
  });
  let yAxisData = util.getDataByIdx({
    key: header[targetIdx],
    data,
  });
  let actualData = util.getDataByIdx({
    key: header[actualIdx],
    data,
  });

  let levelColor = ['#ff736e', '#FFA39E', '#FFD591', '#91D5FF', '#A7E8B4'];

  const indexStyle = {
    type: 'bar',
    barWidth: 50,
    barGap: '-130%',
    stack: '指标范围',
    silent: true,
  };

  let levelDataList = levelIdx.map(level =>
    util.getDataByIdx({
      key: header[level],
      data,
    })
  );
  levelDataList.push(new Array(levelDataList[0].length).fill(parseInt(max, 10)));

  // 堆叠数据还原，逆向减操作
  for (let i = levelDataList.length - 1; i > 0; i--) {
    let curCol = levelDataList[i];
    let nextCol = levelDataList[i - 1];
    for (let j = 0; j < curCol.length; j++) {
      levelDataList[i][j] = curCol[j] - nextCol[j];
    }
  }

  let levelData = levelDataList.map((data, idx) => ({
    ...indexStyle,
    name: levelText[idx],
    data,
    itemStyle: {
      color: levelColor[idx],
    },
  }));

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

  let config = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    legend: {
      data: ['目标值', '实际值', ...levelText].map(name => ({
        name,
        icon: 'circle',
      })),
      selected: levelText.map(key => ({
        [key]: false,
      })),
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
        renderItem: (_, api) => {
          const [x, y] = api.coord([api.value(0), api.value(1)]);
          let shape = {
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
        },
        data: actualData,
        z: 10,
      },
      ...levelData,
    ],
  };
  return config;
};

export { bullet, chartConfig };
