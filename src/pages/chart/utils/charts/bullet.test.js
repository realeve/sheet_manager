import * as lib from './bullet';

const renderAPI = { value: () => 100, coord: ([x, y]) => [x, y], visual: () => '#f22' };
const renderDst = src => ({
  type: 'group',
  children: [
    {
      type: 'line',
      shape: src,
      style: {
        stroke: '#f22',
        lineWidth: 4,
      },
    },
  ],
});
test('自定义渲染', () => {
  let src = {
    x1: 100,
    x2: 100,
    y1: 70,
    y2: 120,
  };
  expect(lib.getShape({ x: 100, y: 100, reverse: false })).toMatchObject(src);
  let dst = {
    x1: 70,
    x2: 120,
    y1: 100,
    y2: 100,
  };
  expect(lib.getShape({ x: 100, y: 100, reverse: true })).toMatchObject(dst);

  expect(lib.renderItem(renderAPI, false)).toMatchObject(renderDst(src));
});

test('堆叠数据处理', () => {
  const indexStyle = {
    type: 'bar',
    barWidth: 50,
    barGap: '-130%',
    stack: '指标范围',
    silent: true,
  };
  let option1 = {
    x: 0,
    y: 1,
    y2: 2,
    level: '3,4,5,6',
    reverse: '0',
    max: 100,
    data: {
      header: ['x', 'y', 'y2', '差', '良', '中', '优'],
      data: [
        {
          x: '品种1',
          y: 70,
          y2: 80,
          差: 60,
          良: 65,
          中: 70,
          优: 80,
        },
      ],
    },
  };
  expect(lib.handleStackData(option1)).toMatchObject({
    levelData: [
      {
        ...indexStyle,
        name: '低于差',
        data: [60],
        itemStyle: { color: '#ff736e' },
      },
      {
        ...indexStyle,
        name: '差',
        data: [5],
        itemStyle: { color: '#FFA39E' },
      },
      {
        ...indexStyle,
        name: '良',
        data: [5],
        itemStyle: { color: '#FFD591' },
      },
      {
        ...indexStyle,
        name: '中',
        data: [10],
        itemStyle: { color: '#91D5FF' },
      },
      {
        ...indexStyle,
        name: '优',
        data: [20],
        itemStyle: { color: '#A7E8B4' },
      },
    ],
    levelText: ['低于差', '差', '良', '中', '优'],
  });

  let option2 = {
    x: 0,
    y: 1,
    y2: 2,
    level: '3,4,5',
    reverse: '0',
    max: 100,
    data: {
      header: ['x', 'y', 'y2', '差', '良', '优'],
      data: [
        {
          x: '品种1',
          y: 70,
          y2: 80,
          差: 60,
          良: 65,
          优: 70,
        },
      ],
    },
  };
  expect(lib.handleStackData(option2)).toMatchObject({
    levelData: [
      {
        ...indexStyle,
        data: [60],
        itemStyle: { color: '#FFA39E' },
        name: '低于差',
      },
      {
        ...indexStyle,
        data: [5],
        itemStyle: { color: '#FFD591' },
        name: '差',
      },
      {
        ...indexStyle,
        data: [5],
        itemStyle: { color: '#91D5FF' },
        name: '良',
      },
      {
        ...indexStyle,
        data: [30],
        itemStyle: { color: '#A7E8B4' },
        name: '优',
      },
    ],
    levelText: ['低于差', '差', '良', '优'],
  });

  // 最终渲染结果处理
  let dst1 = lib.bullet(option1);
  expect(dst1.legend).toMatchObject({
    data: [
      { icon: 'circle', name: '目标值' },
      { icon: 'circle', name: '实际值' },
      { icon: 'circle', name: '低于差' },
      { icon: 'circle', name: '差' },
      { icon: 'circle', name: '良' },
      { icon: 'circle', name: '中' },
      { icon: 'circle', name: '优' },
    ],
    selected: [{ 低于差: false }, { 差: false }, { 良: false }, { 中: false }, { 优: false }],
  });

  expect({ xAxis: dst1.xAxis, yAxis: dst1.yAxis }).toMatchObject({
    xAxis: { splitLine: { show: false } },
    yAxis: {
      axisLine: { show: false },
      axisTick: { show: false },
      data: ['品种1'],
    },
  });

  expect([dst1.series[0], dst1.series[1]]).toMatchObject([
    { barWidth: 30, data: [70], name: '目标值', type: 'bar', z: 9 },
    { data: [80], name: '实际值', type: 'custom', z: 10 },
  ]);

  let dst2 = lib.bullet(Object.assign(option1, { reverse: true }));
  expect({ xAxis: dst2.xAxis, yAxis: dst2.yAxis }).toMatchObject({
    yAxis: { splitLine: { show: false } },
    xAxis: {
      axisLine: { show: false },
      axisTick: { show: false },
      data: ['品种1'],
    },
  });

  expect(dst1.series[1].renderItem(null, renderAPI)).toMatchObject(
    renderDst({
      x1: 100,
      x2: 100,
      y1: 70,
      y2: 120,
    })
  );
  let html = dst1.tooltip.formatter([
    { seriesName: '目标值', value: 70 },
    { seriesName: '实际值', value: 75 },
    { seriesName: '差', value: 60 },
    { seriesName: '良', value: 10 },
    { seriesName: '优', value: 10 },
  ]);
  expect(html).toContain('<strong style="color:#f67;"> (优) </strong><br><br>');
  expect(html).toContain('目标值:70<br>实际值:75<br>差:60<br>良:70<br>优:80');
});
