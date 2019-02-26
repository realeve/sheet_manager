import lib from './lib';
import { AUTHOR } from '@/utils/setting';
test('uniq data', () => {
  expect(lib.uniq([1, 2, 3, 4, 3, 3, 2, 1, 4])).toEqual([1, 2, 3, 4]);
});

test('copyright', () => {
  expect(lib.getCopyRight()).toEqual({
    text: '©' + AUTHOR,
    borderColor: '#999',
    borderWidth: 0,
    textStyle: {
      fontSize: 10,
      fontWeight: 'normal',
    },
    x: 'right',
    y2: 3,
  });
});

test('处理默认标题', () => {
  expect(
    lib.getDefaultTitle(
      {
        title: 'title',
      },
      {}
    )
  ).toEqual('title');

  expect(
    lib.getDefaultTitle(
      {},
      {
        prefix: '前置信息',
        data: {
          title: 'title',
          source: 'source',
        },
        dateRange: ['20180101', '20180201'],
      }
    )
  ).toHaveLength(4);
});

test('默认参数配置处理', () => {
  const title = [
    { left: 'center', text: '图表标题' },
    {
      borderWidth: 0,
      text: '数据来源：测试数据库',
      textStyle: { fontSize: 10, fontWeight: 'normal' },
      x: 5,
      y2: 0,
    },
    {
      borderWidth: 0,
      text: '统计时间：20180101 - 20180201',
      textStyle: { fontSize: 10, fontWeight: 'normal' },
      x: 5,
      y2: 18,
    },
    {
      borderColor: '#999',
      borderWidth: 0,
      text: '©' + AUTHOR,
      textStyle: { fontSize: 10, fontWeight: 'normal' },
      x: 'right',
      y2: 3,
    },
  ];

  expect(
    lib.handleDefaultOption(
      {},
      {
        data: {
          title: '图表标题',
          source: '数据来源：测试数据库',
        },
        dateRange: ['20180101', '20180201'],
      }
    )
  ).toEqual({
    legend: {
      align: 'right',
      textStyle: { color: '#666' },
      type: 'scroll',
      width: 500,
    },
    title,
    toolbox: { feature: { saveAsImage: { type: 'svg' } } },
    tooltip: {},
  });

  expect(
    lib.handleDefaultOption(
      { legend: {} },
      {
        data: {
          title: '图表标题',
          source: '数据来源：测试数据库',
        },
        dateRange: ['20180101', '20180201'],
      }
    )
  ).toEqual({
    legend: {},
    title,
    toolbox: { feature: { saveAsImage: { type: 'svg' } } },
    tooltip: {},
  });

  expect(
    lib.handleDefaultOption(
      { legend: {} },
      {
        data: {
          title: '图表标题',
          source: '数据来源：测试数据库',
        },
        dateRange: ['20180101', '20180201'],
        type: 'line',
      }
    )
  ).toEqual({
    legend: {},
    title,
    toolbox: { feature: { saveAsImage: { type: 'svg' } } },
    tooltip: { axisPointer: { type: 'cross' }, trigger: 'axis' },
  });
  expect(
    lib.handleDefaultOption(
      { legend: {} },
      {
        data: {
          title: '图表标题',
          source: '数据来源：测试数据库',
        },
        dateRange: ['20180101', '20180201'],
        type: 'bar',
      }
    )
  ).toEqual({
    legend: {},
    title,
    toolbox: { feature: { saveAsImage: { type: 'svg' } } },
    tooltip: { axisPointer: { type: 'shadow' }, trigger: 'axis' },
  });

  expect(
    lib.handleDefaultOption(
      { legend: {} },
      {
        data: {
          title: '图表标题',
          source: '数据来源：测试数据库',
        },
        dateRange: ['20180101', '20180201'],
        type: 'bar',
        histogram: '1',
      }
    )
  ).toEqual({
    legend: {},
    title,
    toolbox: { feature: { saveAsImage: { type: 'png' } } },
    tooltip: {},
  });

  expect(
    lib.handleDefaultOption(
      { legend: {}, toolbox: {} },
      {
        data: {
          title: '图表标题',
          source: '数据来源：测试数据库',
        },
        dateRange: ['20180101', '20180201'],
        type: 'bar',
        histogram: '1',
        simple: false,
      }
    )
  ).toEqual({
    legend: {},
    title,
    toolbox: { feature: { saveAsImage: { type: 'png' } } },
    tooltip: {},
  });

  expect(
    lib.handleDefaultOption(
      { legend: {} },
      {
        data: {
          title: '图表标题',
          source: '数据来源：测试数据库',
        },
        dateRange: ['20180101', '20180201'],
        type: 'bar',
        histogram: '1',
        simple: false,
      }
    )
  ).toEqual({
    legend: {},
    title,
    toolbox: { feature: { saveAsImage: { type: 'png' } } },
    tooltip: {},
  });

  expect(
    lib.handleDefaultOption(
      {
        legend: {},
        xAxis: {
          name: 'xAxisName',
          otherParam: {},
        },
        yAxis: {
          name: 'yAxisName',
          otherParam: {},
        },
      },
      {
        data: {
          title: '图表标题',
          source: '数据来源：测试数据库',
        },
        dateRange: ['20180101', '20180201'],
        type: 'bar',
        histogram: '1',
        simple: true,
      }
    )
  ).toEqual({
    legend: {},
    title: { left: 'center', text: '图表标题' },
    toolbox: { feature: { saveAsImage: { type: 'png' } } },
    tooltip: {},
    xAxis: {
      axisLine: { show: false },
      axisTick: { show: false },
      otherParam: {},
    },
    yAxis: { otherParam: {} },
  });

  expect(
    lib.handleDefaultOption(
      {
        legend: {},
        yAxis: {
          name: 'yAxisName',
          otherParam: {},
        },
      },
      {
        data: {
          title: '图表标题',
          source: '数据来源：测试数据库',
        },
        dateRange: ['20180101', '20180201'],
        type: 'bar',
        histogram: '1',
        simple: true,
      }
    )
  ).toEqual({
    legend: {},
    title: { left: 'center', text: '图表标题' },
    toolbox: { feature: { saveAsImage: { type: 'png' } } },
    tooltip: {},
    yAxis: { otherParam: {} },
  });

  expect(
    lib.handleDefaultOption(
      {
        legend: {},
        xAxis: {
          name: 'xAxisName',
          otherParam: {},
        },
      },
      {
        data: {
          title: '图表标题',
          source: '数据来源：测试数据库',
        },
        dateRange: ['20180101', '20180201'],
        type: 'bar',
        histogram: '1',
        simple: true,
      }
    )
  ).toEqual({
    legend: {},
    title: { left: 'center', text: '图表标题' },
    toolbox: { feature: { saveAsImage: { type: 'png' } } },
    tooltip: {},
    xAxis: {
      axisLine: { show: false },
      axisTick: { show: false },
      otherParam: {},
    },
  });
});

test('字符串转日期', () => {
  expect(lib.str2Date('20181221')).toBe('2018-12-21');
  expect(lib.str2Date('2018-12-21')).toBe('2018-12-21');
  expect(lib.str2Date('201812033')).toBe('201812033');
  expect(lib.str2Date('201812')).toBe('2018-12');
});

test('字符串转数字', () => {
  expect(lib.str2Num('2018')).toBe(2018);
  expect(lib.str2Num('-2018')).toBe(-2018);

  expect(lib.str2Num('3')).toBe(3);
  expect(lib.str2Num('-3')).toBe(-3);

  expect(lib.str2Num('2018.2')).toBe(2018.2);
  expect(lib.str2Num('-2018.2')).toBe(-2018.2);
  expect(lib.str2Num('a')).toBe('a');
});

test('处理色彩信息', () => {
  expect(lib.handleColor({})).toEqual({});

  expect(lib.handleColor({ series: [{ name: 'a' }] })).toEqual({
    series: [{ name: 'a' }],
  });

  expect(
    lib.handleColor({
      series: [{ name: '9602A' }],
      legend: { data: ['9602A'] },
    })
  ).toEqual({
    series: [{ name: '9602A' }],
    legend: { data: ['9602A'] },
    color: ['#7ECF51'],
  });

  expect(
    lib.handleColor({
      series: [{ name: '9602A' }, { name: 'unknown' }],
      legend: { data: ['9602A', 'unknown'] },
    })
  ).toEqual({
    series: [{ name: '9602A' }, { name: 'unknown' }],
    legend: { data: ['9602A', 'unknown'] },
    color: ['#7ECF51', '#61A5E8'],
  });
});

test('是否是日期', () => {
  expect(lib.isDate('2018')).toBeFalsy();
  expect(lib.isDate('2018-12-21')).toBeTruthy();
  expect(lib.isDate('20181221')).toBeTruthy();
  expect(lib.isDate('0018-12-21')).toBeFalsy();
});

test('是否需要转换', () => {
  expect(lib.needConvertDate('2018-12-21')).toBeTruthy();
  expect(lib.needConvertDate('20181221')).toBeTruthy();
  expect(lib.needConvertDate('201812')).toBeTruthy();
  expect(lib.needConvertDate('2018-12')).toBeTruthy();
});

test('按键值分组', () => {
  expect(
    lib.getDataByIdx({
      key: 'a',
      data: [{ a: 1 }, { a: 2 }, { a: 3 }, { a: 4 }, { a: 1 }],
    })
  ).toEqual([1, 2, 3, 4, 1]);
});

test('按键值获取唯一值', () => {
  expect(
    lib.getUniqByIdx({
      key: 'a',
      data: [{ a: 1 }, { a: 2 }, { a: 4 }, { a: 4 }, { a: 1 }],
    })
  ).toEqual([1, 2, 4]);
});

test('按键值获取唯一值', () => {
  expect(
    lib.getDataByKeys({
      keys: ['a', 'b'],
      data: [
        { a: 1, b: 2, c: 3, d: 4 },
        { a: 2, b: 2, c: 3, d: 4 },
        { a: 4, b: 2, c: 3, d: 4 },
        { a: 4, b: 2, c: 3, d: 4 },
        { a: 1, b: 2, c: 3, d: 4 },
      ],
    })
  ).toEqual([[1, 2], [2, 2], [4, 2], [4, 2], [1, 2]]);
});

test('导出颜色表', () => {
  expect(lib.colors).toHaveLength(108);
});

test('convert HEX to RGB', () => {
  expect(lib.hex2rgb('#101010')).toEqual('16,16,16');
  expect(lib.hex2rgb('101010')).toEqual('16,16,16');
  expect(lib.hex2rgb('111')).toEqual('17,17,17');
  expect(lib.hex2rgb('#111')).toEqual('17,17,17');
});

test('convert RGB to HEX', () => {
  expect(lib.rgb2hex('rgb(16,16,16)')).toEqual(['10', '10', '10']);
  expect(lib.rgb2hex('rgb(255,255,255)')).toEqual(['ff', 'ff', 'ff']);
  expect(lib.rgb2hex('rgb(5,5,5)')).toEqual(['05', '05', '05']);
});

test('数据序列格式化', () => {
  expect(lib.getLegendData(['A品种', 'B品种'])).toEqual([
    {
      name: 'A品种',
      icon: 'circle',
    },
    {
      name: 'B品种',
      icon: 'circle',
    },
  ]);
});

test('获取渲染器', () => {
  expect(
    lib.getRenderer({
      render: 'svg',
      type: 'bar',
      histogram: '0',
    })
  ).toBe('svg');

  expect(
    lib.getRenderer({
      type: 'paralell',
    })
  ).toBe('canvas');

  expect(
    lib.getRenderer({
      type: 'bar',
    })
  ).toBe('svg');

  expect(
    lib.getRenderer({
      type: 'bar',
      histogram: '1',
    })
  ).toBe('canvas');
});

test('chart height', () => {
  expect(lib.getChartHeight({ type: 'sankey' }, { series: {} })).toBe('900px');
  expect(lib.getChartHeight({ type: 'sunburst' }, { series: {} })).toBe('900px');
  expect(lib.getChartHeight({ type: 'paralell' }, { series: {} })).toBe('900px');
  expect(lib.getChartHeight({ type: 'bar3d' }, { series: {} })).toBe('700px');
  expect(lib.getChartHeight({ type: 'line3d' }, { series: {} })).toBe('700px');
  expect(lib.getChartHeight({ type: 'scatter3d' }, { series: {} })).toBe('700px');
  expect(lib.getChartHeight({ type: 'surface' }, { series: {} })).toBe('700px');
  expect(lib.getChartHeight({ type: 'bar' }, { series: {} })).toBe('500px');
  expect(lib.getChartHeight({ type: 'bar', height: 600 }, { series: {} })).toBe('600px');

  expect(lib.getChartHeight({ type: 'calendar', size: 10 }, { series: [{}, {}] })).toBe('360px');

  expect(lib.getChartHeight({ type: 'calendar', size: 10 }, {})).toBe('800px');
});

test('坐标极值刻度确定', () => {
  expect(lib.handleMinMax({ min: 22, max: 36 })).toEqual({
    min: 20,
    max: 40,
  });

  expect(lib.handleMinMax({ min: 2.2, max: 3.6 })).toEqual({
    min: 2,
    max: 4,
  });

  expect(lib.handleMinMax({ min: 320, max: 856 })).toEqual({
    min: 300,
    max: 900,
  });

  expect(lib.handleMinMax({ min: -1.3, max: 4.4 })).toEqual({
    min: -2,
    max: 5,
  });
});

test('获取 Legend', () => {
  expect(lib.getLegend({ data: [] })).toEqual({ show: false });
  expect(
    lib.getLegend({
      data: {
        header: ['a'],
        data: [
          {
            a: '张三',
            b: 2,
          },
          {
            a: '张三',
            b: 3,
          },
          {
            a: '李四',
            b: 2,
          },
        ],
      },
      legend: 0,
    })
  ).toEqual({
    selectedMode: 'single',
    data: [
      {
        icon: 'circle',
        name: '张三',
      },
      {
        icon: 'circle',
        name: '李四',
      },
    ],
  });
});

test('获取坐标轴', () => {
  expect(
    lib.getAxis(
      {
        header: ['a'],
        data: [
          {
            a: '张三',
            b: 2,
          },
          {
            a: '张三',
            b: 3,
          },
          {
            a: '李四',
            b: 2,
          },
        ],
      },
      0
    )
  ).toEqual({
    xAxis: ['张三', '李四'],
    xAxisType: 'category',
  });

  expect(
    lib.getAxis(
      {
        header: ['a'],
        data: [
          {
            a: 2,
            b: 2,
          },
          {
            a: 4,
            b: 3,
          },
          {
            a: 3,
            b: 2,
          },
        ],
      },
      0
    )
  ).toEqual({
    xAxis: [2, 3, 4],
    xAxisType: 'value',
  });
});
