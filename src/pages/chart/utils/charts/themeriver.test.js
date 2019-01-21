import { themeriver } from './themeriver';

test('themeriver', () => {
  expect(
    themeriver({
      type: 'themeriver',
      data: {
        data: [
          { 地区: 'Asia', 年份: 1750, value: 524 },
          { 地区: 'Asia', 年份: 1800, value: 636 },
          { 地区: 'Africa', 年份: 1750, value: 106 },
          { 地区: 'Africa', 年份: 1800, value: 121 },
          { 地区: 'Europe', 年份: 1750, value: 178 },
          { 地区: 'Europe', 年份: 1800, value: 231 },
        ],
        header: ['地区', '年份', 'value'],
      },
    })
  ).toMatchObject({
    color: ['#1890FF', '#2FC25B', '#FACC14', '#223273', '#8543E0', '#13C2C2', '#3436C7', '#F04864'],
    legend: {
      data: [
        { icon: 'circle', name: 'Asia' },
        { icon: 'circle', name: 'Africa' },
        { icon: 'circle', name: 'Europe' },
      ],
    },
    series: [
      {
        data: [
          [1750, 524, 'Asia'],
          [1800, 636, 'Asia'],
          [1750, 106, 'Africa'],
          [1800, 121, 'Africa'],
          [1750, 178, 'Europe'],
          [1800, 231, 'Europe'],
        ],
        itemStyle: { emphasis: { shadowBlur: 20, shadowColor: 'rgba(0, 0, 0, 0.8)' } },
        type: 'themeRiver',
      },
    ],
    singleAxis: { type: 'time' },
    toolbox: {},
    tooltip: {
      axisPointer: {
        lineStyle: { color: 'rgba(0,0,0,0.2)', type: 'solid', width: 1 },
        type: 'cross',
      },
      trigger: 'axis',
    },
  });

  expect(
    themeriver({
      type: 'themeriver',
      data: {
        data: [{ 年份: 1750, value: 524 }, { 年份: 1800, value: 636 }],
        header: ['年份', 'value'],
      },
    })
  ).toMatchObject({
    color: ['#1890FF', '#2FC25B', '#FACC14', '#223273', '#8543E0', '#13C2C2', '#3436C7', '#F04864'],
    series: [
      {
        data: [],
        itemStyle: { emphasis: { shadowBlur: 20, shadowColor: 'rgba(0, 0, 0, 0.8)' } },
        type: 'themeRiver',
      },
    ],
    singleAxis: { type: 'time' },
    toolbox: {},
    tooltip: {
      axisPointer: {
        lineStyle: { color: 'rgba(0,0,0,0.2)', type: 'solid', width: 1 },
        type: 'cross',
      },
      trigger: 'axis',
    },
  });

  expect(() => {
    themeriver({
      type: 'themeriver',
      data: {
        data: [{ 年份: 1750, a: 1, b: 2, value: 524 }, { 年份: 1800, a: 2, b: 2, value: 636 }],
        header: ['年份', 'value', 'a', 'b'],
      },
    });
  }).toThrow();
});
