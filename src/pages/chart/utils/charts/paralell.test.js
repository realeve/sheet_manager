import { paralell, getDataSequence } from './paralell';

test('paralell', () => {
  const config = {
    data: {
      data: [
        {
          a: 'a2',
          b: 'a2',
          c: 3,
        },
      ],
      header: ['a', 'b', 'c'],
    },
  };
  const appendConfig = {
    smooth: '0',
    visual: 0,
    blackbg: '0',
    vertical: true,
    legend: '0',
    orient: 'vertical',
  };
  let res = {
    backgroundColor: '#445',
    blendMode: 'lighter',
    legend: { show: false },
    parallel: {
      axisExpandable: true,
      layout: 'horizontal',
      left: '5%',
      parallelAxisDefault: {
        axisLabel: { textStyle: { color: '#fff' } },
        axisLine: { lineStyle: { color: '#aaa' }, show: true },
        axisTick: { lineStyle: { color: '#999' } },
        nameGap: 20,
        nameLocation: 'start',
        nameTextStyle: { color: '#aaa', fontSize: 14 },
        splitLine: { show: false },
        type: 'value',
      },
      right: '10%',
      top: 60,
    },
    parallelAxis: [
      { dim: 0, name: 'a', type: 'category' },
      { dim: 1, name: 'b', type: 'category' },
      { dim: 2, max: 3, min: 3, name: 'c' },
    ],
    series: [
      {
        data: [['a2', 'a2', 3]],
        lineStyle: { normal: { opacity: 0.5, width: 1 } },
        name: '平行坐标系',
        progressive: 500,
        progressiveChunkMode: 'mod',
        smooth: true,
        type: 'parallel',
      },
    ],
    toolbox: {},
    tooltip: {},
    visualMap: {
      calculable: true,
      dimension: 0,
      inRange: { color: ['#50a3ba', '#a2ca36', '#e92312'] },
      max: 'a2',
      min: 'a2',
      show: true,
    },
  };

  expect(paralell(config)).toMatchObject(res);

  expect(getDataSequence({ header: ['a', 'b', 'c'], sequence: '0,1,2' })).toMatchObject([
    'a',
    'b',
    'c',
  ]);

  expect(paralell(Object.assign(config, appendConfig))).toMatchObject({
    legend: { data: [{ icon: 'circle', name: 'a2' }] },
    parallel: {
      axisExpandable: true,
      layout: 'vertical',
      left: '18%',
      parallelAxisDefault: {
        axisLabel: { textStyle: { color: '#333' } },
        axisLine: { lineStyle: { color: '#333' }, show: true },
        axisTick: { lineStyle: { color: '#333' } },
        nameTextStyle: { color: '#333', fontSize: 12 },
      },
      right: '5%',
    },
    parallelAxis: [{ dim: 0, name: 'b', type: 'category' }, { dim: 1, max: 3, min: 3, name: 'c' }],
    series: [
      {
        data: [['a2', 3]],
        lineStyle: { normal: { opacity: 0.5, width: 1 } },
        name: 'a2',
        progressive: 500,
        progressiveChunkMode: 'mod',
        smooth: false,
        type: 'parallel',
      },
    ],
  });
});
