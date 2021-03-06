import { init } from './histogram';
import { bar, getChartConfig } from './bar';

let data = {
  header: ['a', 'b'],
  data: [
    {
      a: 20,
      b: 'a1',
    },
    {
      a: 20,
      b: 'a1',
    },
    {
      a: 20,
      b: 'a1',
    },
    {
      a: 30,
      b: 'a1',
    },
    {
      a: 30,
      b: 'a1',
    },
    {
      a: 40,
      b: 'a1',
    },
  ],
};

test('histogram 直方图测试', () => {
  let res = init({ data, x: 0 });
  expect(res.series[0].label.normal.formatter({ value: [0, 1] })).toBe(1);

  expect(res).toMatchObject({
    series: [
      {
        barWidth: '99.3%',
        data: [[18, 0], [23, 3], [28, 0], [33, 2], [38, 0], [43, 1]],
        label: { normal: { position: 'insideTop', show: true } },
        // smooth: true,
        type: 'bar',
      },
      {
        // color: '#9570E5',
        data: [
          [18, 0.027224709140964445],
          [23, 0.04742383665119938],
          [28, 0.05267415855226293],
          [33, 0.0373049111885026],
          [38, 0.016846197863181634],
          [43, 0.0048507095112751645],
        ],
        name: undefined,
        smooth: true,
        symbolSize: 0,
        type: 'line',
        yAxisIndex: 1,
        z: 10,
      },
    ],
    tooltip: {},
    xAxis: { name: 'a', nameLocation: 'middle', scale: true, type: 'value' },
    yAxis: [{ type: 'value' }, { name: 'PDF', nameLocation: 'middle', type: 'value' }],
  });

  expect(init({ data, x: 0, legend: 1, multilegend: false })).toMatchObject({
    legend: { data: [{ icon: 'circle', name: 'a1' }], selectedMode: 'single' },
  });
});

test('直方图多选模式', () => {
  expect(init({ data, x: 0, legend: 1, multilegend: true })).toMatchObject({
    legend: {
      selectedMode: 'multiple',
    },
  });

  expect(getChartConfig({ data, x: 0, legend: 1, multilegend: true, histogram: 1 })).toMatchObject({
    dataZoom: [{ end: 100, realtime: true, start: 0, type: 'inside', xAxisIndex: 0 }],
    legend: { data: [{ icon: 'circle', name: 'a1' }], selectedMode: 'multiple' },
    series: [
      {
        barWidth: '99.3%',
        data: [[18, 0], [23, 3], [28, 0], [33, 2], [38, 0], [43, 1]],
        label: { normal: { position: 'insideTop', show: true } },
        name: 'a1',
        // smooth: true,
        type: 'bar',
      },
      {
        // color: '#9570E5',
        data: [
          [18, 0.027224709140964445],
          [23, 0.04742383665119938],
          [28, 0.05267415855226293],
          [33, 0.0373049111885026],
          [38, 0.016846197863181634],
          [43, 0.0048507095112751645],
        ],
        label: { normal: { position: 'insideTop', show: true } },
        name: 'a1',
        smooth: true,
        symbolSize: 0,
        type: 'line',
        yAxisIndex: 1,
        z: 10,
      },
    ],
    xAxis: { name: 'a', nameLocation: 'middle', scale: true, type: 'value' },
    yAxis: [{ type: 'value' }, { name: 'PDF', nameLocation: 'middle', type: 'value' }],
  });
});
