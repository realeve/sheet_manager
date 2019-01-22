import { bar, handleMarkText } from './bar';

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

  // pictorial+symbol
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
      symbol: '0',
    })
  ).toMatchObject({
    series: [
      {
        barGap: '0',
        data: [1],
        itemStyle: { emphasis: { opacity: 1 }, normal: { opacity: 0.6 } },
        name: 'legend',
        smooth: false,
        symbol: 'path://M0,10 L10,10 L5,0 L0,10 z',
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

  // pareto
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
      pareto: '1',
    })
  ).toMatchObject({
    legend: { data: ['b', 'Pareto'] },
    series: [
      {
        data: [1],
        label: { normal: { position: 'insideTop', show: true } },
        name: 'b',
        smooth: false,
        type: 'bar',
      },
      {
        data: ['100.00'],
        lineStyle: {
          normal: {
            shadowBlur: 0,
            shadowColor: 'rgba(0,0,0,0)',
            shadowOffsetX: 0,
            shadowOffsetY: 0,
            type: 'solid',
            width: 2,
          },
        },
        markLine: {
          data: [{ label: { normal: { show: false } }, name: '80%', yAxis: 80 }],
          lineStyle: { normal: { type: 'dot' } },
          symbol: 'none',
        },
        name: 'Pareto',
        smooth: true,
        symbol: 'circle',
        symbolSize: '4',
        type: 'line',
        yAxisIndex: 1,
      },
    ],
    xAxis: {
      boundaryGap: true,
      data: ['a1'],
      name: 'a',
    },
    yAxis: [
      { name: 'b' },
      {
        axisLabel: { interval: 'auto', margin: 10, show: true, textStyle: { fontSize: 16 } },
        axisTick: { show: false },
        max: 100,
        min: 0,
        name: '帕累托(%)',
        nameGap: 36,
        nameLocation: 'middle',
        nameTextStyle: { fontSize: 16 },
        position: 'right',
        scale: true,
        splitArea: { show: false },
        type: 'value',
      },
    ],
  });

  // polar
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
      polar: '1',
    })
  ).toMatchObject({
    angleAxis: {
      boundaryGap: true,
      data: ['a1'],
      name: 'a',
      nameGap: 30,
      nameLocation: 'center',
      nameTextStyle: { fontWeight: 'bold' },
    },
    polar: {},
    radiusAxis: {
      name: 'b',
      nameGap: 30,
      nameLocation: 'center',
      nameTextStyle: { fontWeight: 'bold' },
    },
    series: [
      {
        coordinateSystem: 'polar',
        data: [1],
        label: { normal: { position: 'insideTop', show: true } },
        smooth: false,
        type: 'bar',
      },
    ],
  });

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
      polar: '1',
      reverse: '1',
    })
  ).toMatchObject({
    angleAxis: {
      name: 'b',
      nameGap: 30,
      nameLocation: 'center',
      nameTextStyle: { fontWeight: 'bold' },
    },
    grid: { left: 100 },
    polar: {},
    radiusAxis: {
      boundaryGap: true,
      data: ['a1'],
      name: 'a',
      nameGap: -40,
      nameLocation: 'center',
      nameTextStyle: { fontWeight: 'bold' },
    },
    series: [
      {
        coordinateSystem: 'polar',
        data: [1],
        label: { normal: { position: 'insideTop', show: true } },
        smooth: false,
        type: 'bar',
      },
    ],
  });

  // stack
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
      stack: '1',
    })
  ).toMatchObject({
    series: [
      {
        data: [1],
        label: { normal: { position: 'insideTop', show: true } },
        name: '',
        smooth: false,
        stack: 'All',
        type: 'bar',
      },
    ],
  });

  // reverse+markline+marktext
  let reqMarkText = bar({
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
    markline: '10',
    marktext: '优秀值',
  });
  expect(reqMarkText).toMatchObject({
    series: [
      {
        data: [1],
        label: { normal: { position: 'insideTop', show: true } },
        markLine: {
          data: [{ label: { normal: { show: true } }, xAxis: 10 }],
          lineStyle: { normal: { type: 'dashed' } },
          symbol: 'none',
        },
        name: 'legend',
        smooth: false,
        type: 'bar',
      },
    ],
  });
  expect(handleMarkText({ value: 1 }, [2], 0)).toBe(2);
  expect(handleMarkText({ value: 3 }, [2], 1)).toBe(3);

  expect(reqMarkText.series[0].markLine.data[0].label.normal.formatter({ value: 3 }, [2], 1)).toBe(
    '优秀值'
  );

  // reverse+markline+markarea
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
      markarea: '0-1',
      marktext: '优秀值',
    })
  ).toMatchObject({
    series: [
      {
        data: [1],
        label: { normal: { position: 'insideTop', show: true } },
        markArea: {
          data: [[{ name: '0-1', yAxis: 0 }, { xAxis: 1 }]],
          emphasis: { label: { position: 'insideRight' } },
          label: { color: '#aaa', fontSize: 15, position: 'insideRight' },
          silent: false,
        },
        name: 'legend',
        smooth: false,
        type: 'bar',
      },
    ],
  });

  // reverse+boxplot
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
      markarea: '0-1',
      marktext: '优秀值',
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

  // area

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
      area: '1',
      type: 'line',
    })
  ).toMatchObject({
    series: [
      {
        areaStyle: { normal: { opacity: 0.4 } },
        data: [1],
        name: 'legend',
        smooth: false,
        type: 'line',
      },
    ],
  });
});
