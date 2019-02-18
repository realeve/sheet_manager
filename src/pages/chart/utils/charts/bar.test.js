import { bar, handleMarkText, handlePolar, handleData, handleSPC } from './bar';

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

  // reverse+markarea+markareatext
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
      reverse: '1',
      markarea: '0-1',
      markareatext: '优秀值',
    })
  ).toMatchObject({
    renderer: 'canvas',
    series: [
      {
        data: [1],
        label: { normal: { position: 'insideTop', show: true } },
        markArea: {
          data: [[{ name: '优秀值', yAxis: 0 }, { xAxis: 1 }]],
          emphasis: { label: { position: 'insideRight' } },
          label: { color: '#aaa', fontSize: 15, position: 'insideRight' },
          silent: false,
        },
        name: '',
        smooth: false,
        type: 'bar',
      },
    ],
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

test('柱状图附加设置项', () => {
  // barshadow
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
      barshadow: '1',
    })
  ).toMatchObject({
    series: [
      {
        data: [1],
        label: { normal: { position: 'insideTop', show: true } },
        name: '',
        smooth: false,
        type: 'bar',
        z: 10,
      },
      {
        barGap: '-100%',
        data: [1],
        itemStyle: { normal: { color: 'rgba(0,0,0,0.1)' } },
        silent: true,
        type: 'bar',
      },
    ],
  });

  // barwidth+barshadow
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
      barshadow: '1',
      barwidth: 20,
    })
  ).toMatchObject({
    series: [
      {
        data: [1],
        label: { normal: { position: 'insideTop', show: true } },
        name: '',
        smooth: false,
        type: 'bar',
        barMaxWidth: 20,
        z: 10,
      },
      {
        barGap: '-100%',
        data: [1],
        itemStyle: { normal: { color: 'rgba(0,0,0,0.1)' } },
        silent: true,
        barMaxWidth: 20,
        type: 'bar',
      },
    ],
  });

  // scatter
  expect(
    bar({
      data: {
        header: ['a', 'b'],
        data: [
          {
            a: 1,
            b: 1,
          },
        ],
      },
      x: 0,
      y: 1,
      type: 'scatter',
    })
  ).toMatchObject({
    series: [{ data: [1], name: '', smooth: false, symbolSize: 20, type: 'scatter' }],
    xAxis: { data: [1], type: 'value' },
    yAxis: {
      name: 'b',
    },
  });

  // dateAxis
  expect(
    bar({
      data: {
        header: ['a', 'b'],
        data: [
          {
            a: '20180901',
            b: 1,
          },
        ],
      },
      x: 0,
      y: 1,
    })
  ).toMatchObject({
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
      data: ['2018-09-01'],
      name: 'a',
    },
    yAxis: {
      name: 'b',
    },
  });

  // reverse+boxplot

  expect(
    bar({
      data: {
        header: ['a', 'b'],
        data: [
          {
            b: 1,
            a: 'x',
          },
          {
            b: 2,
            a: 'x',
          },
          {
            b: 3,
            a: 'x',
          },
          {
            b: 20,
            a: 'x',
          },
        ],
      },
      x: 0,
      y: 1,
      reverse: '1',
      type: 'boxplot',
    })
  ).toMatchObject({
    series: [
      {
        data: [[1, 1.75, 2.5, 7.25, 15.5]],
        itemStyle: { borderColor: '#61A5E8' },
        name: '箱线图',
        type: 'boxplot',
      },
      { data: [[20, 0]], itemStyle: { color: '#61A5E8' }, name: '箱线图', type: 'scatter' },
    ],
    xAxis: { scale: true, type: 'value' },
    yAxis: { data: ['x'], nameGap: 70, scale: true, type: 'category' },
  });

  // stack+percent
  expect(
    bar({
      data: {
        header: ['c', 'a', 'b'],
        data: [
          {
            a: 'a1',
            b: 0,
            c: 'l1',
          },
          {
            a: 'a1',
            b: 3,
            c: 'l2',
          },
          {
            a: 'a2',
            b: 0,
            c: 'l1',
          },
          {
            a: 'a2',
            b: 0,
            c: 'l2',
          },
          {
            a: 'a3',
            b: null,
            c: 'l1',
          },
          {
            a: 'a3',
            b: null,
            c: 'l2',
          },
          {
            a: 'a3',
            b: 2,
            c: 'l2',
          },
        ],
      },
      legend: 0,
      x: 1,
      y: 2,
      stack: '1',
      percent: '1',
    })
  ).toMatchObject({
    series: [
      {
        data: [0, '-', '-'],
        label: { normal: { position: 'insideTop', show: true } },
        name: 'l1',
        smooth: false,
        stack: 'All',
        type: 'bar',
      },
      {
        data: [100, '-', '-'],
        label: { normal: { position: 'insideTop', show: true } },
        name: 'l2',
        smooth: false,
        stack: 'All',
        type: 'bar',
      },
    ],
    xAxis: {
      boundaryGap: true,
      data: ['a1', 'a2', 'a3'],
      name: 'a',
    },
    yAxis: {
      name: 'b',
    },
  });

  expect(
    handlePolar(
      {
        reverse: false,
      },
      { yAxis: {}, series: [] }
    )
  ).toMatchObject({ angleAxis: {}, polar: {}, radiusAxis: {}, series: [] });

  expect(
    handlePolar(
      {
        reverse: false,
      },
      { xAxis: {}, series: [] }
    )
  ).toMatchObject({ angleAxis: {}, polar: {}, radiusAxis: {}, series: [] });

  expect(
    handlePolar(
      {
        reverse: true,
      },
      { yAxis: {}, series: [] }
    )
  ).toMatchObject({ angleAxis: {}, polar: {}, radiusAxis: {}, series: [] });

  // markline+marktext

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
      markline: 'average',
    })
  ).toMatchObject({
    series: [
      {
        data: [1],
        label: { normal: { position: 'insideTop', show: true } },
        markLine: {
          data: [{ type: 'average' }],
          lineStyle: { normal: { type: 'dashed' } },
          symbol: 'none',
        },
        name: 'legend',
        smooth: false,
        type: 'bar',
      },
    ],
    xAxis: {
      name: 'b',
    },
    yAxis: {
      boundaryGap: true,
      data: ['a1'],
      name: 'a',
    },
  });
});

test('处理柱状图数据', () => {
  expect(
    handleData(
      {
        header: ['a', 'b'],
        data: [
          {
            a: 'a1',
            b: 1,
          },
          {
            a: 'a2',
            b: 2,
          },
        ],
      },
      {
        x: 0,
        y: 1,
        type: 'bar',
        smooth: false,
      }
    )
  ).toMatchObject({
    series: { data: [1, 2], smooth: false, type: 'bar' },
    xAxis: ['a1', 'a2'],
    xAxisType: 'category',
  });

  // reverse+boxplot+markarea+markline
  expect(
    bar({
      data: {
        header: ['a', 'b'],
        data: [
          {
            b: 1,
            a: 'x',
          },
          {
            b: 2,
            a: 'x',
          },
          {
            b: 3,
            a: 'x',
          },
          {
            b: 20,
            a: 'x',
          },
        ],
      },
      x: 0,
      y: 1,
      reverse: '1',
      type: 'boxplot',
      markarea: '0-5',
      markline: '10',
    })
  ).toMatchObject({
    renderer: 'canvas',
    series: [
      {
        data: [[1, 1.75, 2.5, 7.25, 15.5]],
        markArea: {
          data: [[{ name: '0-5', yAxis: 0 }, { xAxis: 5 }]],
          emphasis: { label: { position: 'insideRight' } },
          label: { color: '#aaa', fontSize: 15, position: 'insideRight' },
          silent: false,
        },
        markLine: {
          data: [{ label: { normal: { show: true } }, xAxis: 10 }],
          lineStyle: { normal: { type: 'dashed' } },
          symbol: 'none',
        },
        name: '箱线图',
        type: 'boxplot',
      },
      {
        data: [[20, 0]],
        markLine: {
          data: [{ label: { normal: { show: true } }, xAxis: 10 }],
          lineStyle: { normal: { type: 'dashed' } },
          symbol: 'none',
        },
        name: '箱线图',
        type: 'scatter',
      },
    ],
    xAxis: { type: 'value' },
    yAxis: { data: ['x'], type: 'category' },
  });
});

test('spc chart', () => {
  let config = {
    data: {
      header: ['a', 'b'],
      data: [
        {
          b: 1,
          a: 'a',
        },
        {
          b: 2,
          a: 'b',
        },
        {
          b: 3,
          a: 'c',
        },
        {
          b: 4,
          a: 'd',
        },
        {
          b: 5,
          a: 'e',
        },
        {
          b: 6,
          a: 'r',
        },
        {
          b: 7,
          a: 'g',
        },
      ],
    },
    y: 1,
    x: 0,
    spc: 1,
  };

  let series = [{ markLine: { data: [] } }];

  let options = handleSPC(config, {
    series,
    visualMap: {},
  });

  expect(options.series[0].markLine.data).toHaveLength(7);

  options = handleSPC(config, {
    series: [{}],
  });

  expect(options.series[0].markLine.data).toHaveLength(7);

  options = bar(config);
  expect(options.series[0].markLine.data).toHaveLength(7);

  // 对Y轴的处理
  expect(options.yAxis).toMatchObject({
    splitLine: {
      show: false,
    },
  });

  // 帕雷托图有双Y轴，需要循环处理
  options = bar({ ...config, pareto: true });

  expect(options.yAxis[0]).toMatchObject({
    splitLine: {
      show: false,
    },
  });
});
