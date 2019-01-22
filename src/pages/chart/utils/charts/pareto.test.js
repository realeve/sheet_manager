import { init } from './pareto';
test('pareto', () => {
  const config = {
    yAxis: { name: 'yAxisName' },
    legend: [],
    series: [
      {
        name: 'seriesName',
        data: [1, 2, 3, 4, 5],
      },
    ],
  };
  const result = {
    grid: { right: 50 },
    legend: { data: ['yAxisName', 'Pareto'] },
    series: [
      { data: [1, 2, 3, 4, 5], name: 'yAxisName' },
      {
        data: ['6.67', '20.00', '40.00', '66.67', '100.00'],
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
    yAxis: [
      { name: 'yAxisName' },
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
  };

  expect(init(config)).toMatchObject(result);
});
