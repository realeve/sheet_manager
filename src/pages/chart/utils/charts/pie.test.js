import { pie, getCenterConfig, handleSeriesData } from './pie';

test('饼图', () => {
  expect(
    pie({
      data: {
        header: ['a', 'b'],
        data: [{ a: 'a', b: 10 }, { a: 'b', b: 15 }],
      },
      dateRange: ['201801', '201802'],
      title: 'pie chart',
    })
  ).toMatchObject({
    series: [
      {
        center: ['50%', '50%'],
        data: [{ name: 'a', value: 10 }, { name: 'b', value: 15 }],
        itemStyle: {
          emphasis: { shadowBlur: 10, shadowColor: 'rgba(0, 0, 0, 0.5)', shadowOffsetX: 0 },
        },
        name: 'a',
        radius: '50%',
        selectedMode: 'single',
        type: 'pie',
      },
    ],
  });

  expect(
    pie({
      data: {
        header: ['c', 'a', 'b'],
        data: [{ a: 'a', b: 10, c: 'legend' }, { a: 'b', b: 15, c: 'legend' }],
      },
      dateRange: ['201801', '201802'],
      source: 'data source',
      legend: 0,
    })
  ).toMatchObject({
    series: [
      {
        center: ['50%', '50%'],
        data: [{ name: 'a', value: 10 }, { name: 'b', value: 15 }],
        itemStyle: {
          emphasis: { shadowBlur: 10, shadowColor: 'rgba(0, 0, 0, 0.5)', shadowOffsetX: 0 },
        },
        name: 'legend',
        radius: '45%',
        selectedMode: 'single',
        type: 'pie',
      },
    ],
  });

  expect(
    pie({
      data: {
        header: ['c', 'a', 'b'],
        data: [{ a: 'a', b: 10, c: 'legend' }, { a: 'b', b: 15, c: 'legend' }],
      },
      dateRange: ['201801', '201802'],
      source: 'data source',
      legend: 0,
      radius: '1',
    })
  ).toMatchObject({
    series: [
      {
        center: ['50%', '50%'],
        data: [{ name: 'a', value: 10 }, { name: 'b', value: 15 }],
        itemStyle: {
          emphasis: { shadowBlur: 10, shadowColor: 'rgba(0, 0, 0, 0.5)', shadowOffsetX: 0 },
        },
        name: 'legend',
        radius: '45%',
        selectedMode: 'single',
        type: 'pie',
      },
    ],
  });

  expect(
    pie({
      data: {
        header: ['c', 'a', 'b'],
        data: [{ a: 'a', b: 10, c: 'legend' }, { a: 'b', b: 15, c: 'legend' }],
      },
      dateRange: ['201801', '201802'],
      source: 'data source',
      legend: 0,
      area: '1',
      rose: 'radius',
      doughnut: '1',
      title: 'pie chart',
    })
  ).toMatchObject({
    series: [
      {
        center: ['50%', '50%'],
        data: [{ name: 'a', value: 10 }, { name: 'b', value: 15 }],
        itemStyle: {
          emphasis: { shadowBlur: 10, shadowColor: 'rgba(0, 0, 0, 0.5)', shadowOffsetX: 0 },
        },
        name: 'legend',
        radius: ['20%', '45%'],
        selectedMode: 'single',
        type: 'pie',
      },
    ],
  });

  expect(
    pie({
      data: {
        header: ['c', 'a', 'b'],
        data: [
          { a: 'a', b: 10, c: 'legend1' },
          { a: 'a', b: 10, c: 'legend1' },
          { a: 'b', b: 15, c: 'legend2' },
          { a: 'b', b: 15, c: 'legend2' },
          { a: 'b', b: 15, c: 'legend3' },
          { a: 'b', b: 15, c: 'legend3' },
        ],
      },
      dateRange: ['201801', '201802'],
      source: 'data source',
      legend: 0,
    })
  ).toMatchObject({
    series: [
      {
        center: ['20%', '50%'],
        data: [{ name: 'a', value: 10 }, { name: 'a', value: 10 }],
        itemStyle: {
          emphasis: { shadowBlur: 10, shadowColor: 'rgba(0, 0, 0, 0.5)', shadowOffsetX: 0 },
        },
        name: 'legend1',
        radius: '35%',
        selectedMode: 'single',
        type: 'pie',
      },
      {
        center: ['50%', '50%'],
        data: [{ name: 'b', value: 15 }, { name: 'b', value: 15 }],
        itemStyle: {
          emphasis: { shadowBlur: 10, shadowColor: 'rgba(0, 0, 0, 0.5)', shadowOffsetX: 0 },
        },
        name: 'legend2',
        radius: '35%',
        selectedMode: 'single',
        type: 'pie',
      },
      {
        center: ['80%', '50%'],
        data: [{ name: 'b', value: 15 }, { name: 'b', value: 15 }],
        itemStyle: {
          emphasis: { shadowBlur: 10, shadowColor: 'rgba(0, 0, 0, 0.5)', shadowOffsetX: 0 },
        },
        name: 'legend3',
        radius: '35%',
        selectedMode: 'single',
        type: 'pie',
      },
    ],
  });

  expect(
    pie({
      data: {
        header: ['c', 'a', 'b'],
        data: [
          { a: 'a', b: 10, c: 'legend1' },
          { a: 'a', b: 10, c: 'legend1' },
          { a: 'b', b: 15, c: 'legend2' },
          { a: 'b', b: 15, c: 'legend2' },
          { a: 'b', b: 15, c: 'legend3' },
          { a: 'b', b: 15, c: 'legend4' },
        ],
      },
      dateRange: ['201801', '201802'],
      source: 'data source',
      legend: 0,
    })
  ).toMatchObject({
    series: [
      {
        center: ['25%', '25%'],
        data: [{ name: 'a', value: 10 }, { name: 'a', value: 10 }],
        name: 'legend1',
        radius: '30%',
        selectedMode: 'single',
        type: 'pie',
      },
      {
        center: ['75%', '25%'],
        data: [{ name: 'b', value: 15 }, { name: 'b', value: 15 }],
        name: 'legend2',
        radius: '30%',
        selectedMode: 'single',
        type: 'pie',
      },
      {
        center: ['25%', '75%'],
        data: [{ name: 'b', value: 15 }],
        name: 'legend3',
        radius: '30%',
        selectedMode: 'single',
        type: 'pie',
      },
      {
        center: ['75%', '75%'],
        data: [{ name: 'b', value: 15 }],
        name: 'legend4',
        radius: '30%',
        selectedMode: 'single',
        type: 'pie',
      },
    ],
  });
});

test('getCenterConfig', () => {
  let res = getCenterConfig(new Array(1));
  expect(res.center).toHaveLength(1);

  res = getCenterConfig(new Array(2));
  expect(res.center).toHaveLength(2);

  res = getCenterConfig(new Array(2));
  expect(res.center).toHaveLength(2);

  res = getCenterConfig(new Array(3));
  expect(res.center).toHaveLength(3);

  res = getCenterConfig(new Array(4));
  expect(res.center).toHaveLength(4);

  res = getCenterConfig(new Array(5));
  expect(res.center).toHaveLength(5);

  res = getCenterConfig(new Array(6));
  expect(res.center).toHaveLength(6);

  res = getCenterConfig(new Array(7));
  expect(res.center).toHaveLength(1);
});

test('handleSeriesData', () => {
  expect(
    handleSeriesData([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, { value: 11 }, { value: 12 }])
  ).toMatchObject([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, { name: '其它', value: 23 }]);
});
