import { bar3d } from './bar3d';

test('bar3d', () => {
  const config = {
    data: {
      header: ['a', 'b', 'c'],
      data: [
        {
          a: 1,
          b: 2,
          c: 3,
        },
      ],
    },
  };

  expect(bar3d({ ...config, type: 'bar3d', shading: '0' })).toMatchObject({
    grid3D: { light: { ambient: { intensity: 0.3 }, main: { intensity: 1.2 } } },
    series: [
      {
        data: [[1, 2, 3]],
        emphasis: { itemStyle: { opacity: 0.9 } },
        itemStyle: { opacity: 0.65 },
        label: { show: true, textStyle: { borderWidth: 1, fontSize: 12 } },
        scatterSize: 40,
        shading: 'color',
        type: 'bar3D',
      },
    ],
    tooltip: { trigger: 'item' },
    visualMap: {
      inRange: {
        color: [
          '#313695',
          '#4575b4',
          '#74add1',
          '#abd9e9',
          '#e0f3f8',
          '#ffffbf',
          '#fee090',
          '#fdae61',
          '#f46d43',
          '#d73027',
          '#a50026',
        ],
      },
      max: 3,
      show: false,
    },
    xAxis3D: {
      axisLabel: { textStyle: { color: '#222' } },
      axisLine: { lineStyle: { color: '#aaa', width: 2 } },
      boundaryGap: true,
      data: [1],
      nameTextStyle: { color: '#555', fontSize: 16 },
      splitArea: { show: false },
      splitLine: { show: true },
      type: 'value',
    },
    yAxis3D: {
      axisLabel: { textStyle: { color: '#222' } },
      axisLine: { lineStyle: { color: '#aaa', width: 2 } },
      boundaryGap: true,
      data: [2],
      nameTextStyle: { color: '#555', fontSize: 16 },
      splitArea: { show: false },
      splitLine: { show: true },
      type: 'value',
    },
    zAxis3D: {
      axisLabel: { textStyle: { color: '#222' } },
      axisLine: { lineStyle: { color: '#aaa', width: 2 } },
      boundaryGap: true,
      nameTextStyle: { color: '#555', fontSize: 16 },
      splitArea: { show: false },
      splitLine: { show: true },
    },
  });
});
