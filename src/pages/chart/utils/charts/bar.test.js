import { bar } from './bar';

test('bar', () => {
  let result = {
    series: [
      {
        data: [1],
        label: { normal: { position: 'insideTop', show: true } },
        smooth: false,
        type: 'bar',
      },
    ],
    xAxis: {
      boundaryGap: true,
      data: ['a1'],
      name: 'a',
      nameGap: 30,
      nameLocation: 'center',
      nameTextStyle: { fontWeight: 'bold' },
    },
    yAxis: {
      name: 'b',
      nameGap: 30,
      nameLocation: 'center',
      nameTextStyle: { fontWeight: 'bold' },
    },
  };
  expect(
    bar({
      data: {
        header: ['a', 'b'],
        data: [
          {
            a: 'a1',
            b: 1,
          },
        ],
      },
      x: 0,
      y: 1,
    })
  ).toMatchObject(result);

  // markarea,legend
  expect(
    bar({
      data: {
        header: ['c', 'a', 'b'],
        data: [
          {
            a: 'a1',
            b: 1,
            c: 'legend',
          },
        ],
      },
      legend: 0,
      x: 1,
      y: 2,
      markarea: '0-1',
    })
  ).toMatchObject({ ...result, renderer: 'canvas' });

  // reverse
  expect(
    bar({
      data: {
        header: ['c', 'a', 'b'],
        data: [
          {
            a: 'a1',
            b: 1,
            c: 'legend',
          },
        ],
      },
      legend: 0,
      x: 1,
      y: 2,
      reverse: '1',
    })
  ).toMatchObject({
    series: [
      {
        data: [1],
        label: { normal: { position: 'insideTop', show: true } },
        name: 'legend',
        smooth: false,
        type: 'bar',
      },
    ],
    xAxis: {
      name: 'b',
      nameGap: 30,
      nameLocation: 'center',
      nameTextStyle: { fontWeight: 'bold' },
    },
    yAxis: {
      boundaryGap: true,
      data: ['a1'],
      name: 'a',
      nameGap: 70,
      nameLocation: 'center',
      nameTextStyle: { fontWeight: 'bold' },
    },
  });

  // pictorial
  expect(
    bar({
      data: {
        header: ['c', 'a', 'b'],
        data: [
          {
            a: 'a1',
            b: 1,
            c: 'legend',
          },
        ],
      },
      legend: 0,
      x: 1,
      y: 2,
      pictorial: '1',
    })
  ).toMatchObject({
    series: [
      {
        barGap: '0',
        data: [1],
        itemStyle: { emphasis: { opacity: 1 }, normal: { opacity: 0.6 } },
        name: 'legend',
        smooth: false,
        symbol: 'path://M0,10 L10,10 C5.5,10 5.5,5 5,0 C4.5,5 4.5,10 0,10 z',
        type: 'pictorialBar',
      },
    ],
  });

  // 空数据
  expect(
    bar({
      data: {
        header: ['c', 'a', 'b'],
        data: [
          {
            a: 'a1',
            b: 1,
            c: 'legend',
          },
          {
            a: 'a2',
            b: 1,
            c: 'legend2',
          },
        ],
      },
      legend: 0,
      x: 1,
      y: 2,
    })
  ).toMatchObject({
    series: [
      {
        data: [1, '-'],
        label: { normal: { position: 'insideTop', show: true } },
        name: 'legend',
        smooth: false,
        type: 'bar',
      },
      {
        data: ['-', 1],
        label: { normal: { position: 'insideTop', show: true } },
        name: 'legend2',
        smooth: false,
        type: 'bar',
      },
    ],
    xAxis: {
      boundaryGap: true,
      data: ['a1', 'a2'],
      name: 'a',
      nameGap: 30,
      nameLocation: 'center',
      nameTextStyle: { fontWeight: 'bold' },
    },
  });

  // min,max,percent,zoom,step,barwidth
  expect(
    bar({
      data: {
        header: ['a', 'b'],
        data: [
          {
            a: 'a1',
            b: 1,
          },
        ],
      },
      x: 0,
      y: 1,
      min: 0,
      max: 10,
      percent: '1',
      zoom: '1',
      zoomv: '1',
      step: 'start',
      barwidth: 20,
    })
  ).toMatchObject({
    dataZoom: [
      { end: 100, realtime: true, start: 0, type: 'inside', xAxisIndex: 0 },
      { end: 100, realtime: true, start: 0, type: 'inside', yAxisIndex: 0 },
      { end: 100, realtime: true, start: 0 },
      { filterMode: 'empty', type: 'slider', yAxisIndex: 0 },
    ],
    series: [
      {
        data: [100],
        smooth: false,
        type: 'bar',
        step: 'start',
        barMaxWidth: 20,
      },
    ],
    xAxis: {
      boundaryGap: true,
      data: ['a1'],
      name: 'a',
    },
    yAxis: {
      max: 10,
      min: 0,
      name: 'b',
    },
  });
});
