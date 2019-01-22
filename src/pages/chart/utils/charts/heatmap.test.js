import { heatmap } from './heatmap';

test('heatmap', () => {
  expect(
    heatmap({
      data: {
        header: ['region_name', 'row_num', 'col_num', 'err_num'],
        data: [
          { region_name: 'A幅', row_num: 1, col_num: 1, err_num: 25 },
          { region_name: 'A幅', row_num: 1, col_num: 2, err_num: 60 },
          { region_name: 'A幅', row_num: 1, col_num: 3, err_num: 29 },
        ],
      },
      legend: 0,
    })
  ).toMatchObject({
    legend: { data: [{ icon: 'circle', name: 'A幅' }], selectedMode: 'single' },
    series: [
      {
        data: [[0, 0, 25], [0, 1, 60], [0, 2, 29]],
        itemStyle: { emphasis: { shadowBlur: 10, shadowColor: 'rgba(0, 0, 0, 0.5)' } },
        label: { normal: { show: true } },
        name: 'A幅',
        type: 'heatmap',
      },
    ],
    visualMap: {
      bottom: -15,
      calculable: true,
      color: ['#45527a', '#f44'],
      left: 'center',
      max: 60,
      min: 20,
      orient: 'horizontal',
      precision: 1,
    },
    xAxis: { axisLine: { show: false }, data: [1], splitArea: { show: true }, type: 'category' },
    yAxis: {
      axisLine: { show: false },
      axisTick: { show: false },
      data: [1, 2, 3],
      splitArea: { show: true },
      type: 'category',
    },
  });

  expect(
    heatmap({
      data: {
        header: ['row_num', 'col_num', 'err_num'],
        data: [
          { row_num: 1, col_num: 1, err_num: 25 },
          { row_num: 1, col_num: 2, err_num: 60 },
          { row_num: 1, col_num: 3, err_num: 29 },
        ],
      },
    })
  ).toMatchObject({
    legend: { show: false },
    series: [
      {
        data: [[0, 0, 25], [0, 1, 60], [0, 2, 29]],
        type: 'heatmap',
      },
    ],
  });
});
