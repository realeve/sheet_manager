import { calendar } from './calendar';

test('calendar', () => {
  const config = {
    data: {
      header: ['a', 'b', 'c'],
      data: [
        {
          a: 'a1',
          b: '2018-10-02',
          c: 20,
        },
        {
          a: 'a1',
          b: '2018-09-01',
          c: 20,
        },
      ],
    },
  };

  let res = calendar(config);
  let calendarOption = {
    calendar: [
      {
        cellSize: [20, 20],
        dayLabel: { firstDay: 1, nameMap: 'cn' },
        itemStyle: { normal: { borderColor: '#fff', borderWidth: 2, color: '#ebedf0' } },
        left: 'center',
        monthLabel: { nameMap: 'cn' },
        orient: 'horizontal',
        range: ['2018-09-01', '2018-10-02'],
        splitLine: { lineStyle: { type: 'solid', width: 0 }, show: false },
        top: 100,
        yearLabel: { formatter: '{start}', textStyle: { color: '#667', fontSize: 16 } },
      },
    ],
    legend: { show: false },
    series: [
      {
        calendarIndex: 0,
        coordinateSystem: 'calendar',
        data: [['2018-10-02', 20], ['2018-09-01', 20]],
        type: 'heatmap',
      },
    ],
    tooltip: { position: 'top', trigger: 'item' },
    visualMap: {
      calculable: true,
      inRange: { color: ['#ebedf0', '#c6e48b', '#7bc96f', '#239a3b', '#196127'] },
      left: 'center',
      max: 20,
      min: 20,
      top: 'bottom',
      type: 'piecewise',
    },
  };
  expect(res).toMatchObject(calendarOption);

  expect(res.tooltip.formatter({ seriesName: 'a1', value: ['2018-09-01', 20] })).toContain(
    '2018-09-01：20'
  );

  const appendConfig = {
    size: 20,
    vertical: true,
    startmode: 'month',
    legend: 0,
  };
  expect(calendar(Object.assign(config, appendConfig))).toMatchObject({
    calendar: [
      {
        orient: 'vertical',
        range: ['2018-09-01', '2018-10-31'],
        yearLabel: { formatter: '{start}(a1)', textStyle: { color: '#667', fontSize: 16 } },
      },
    ],
  });

  expect(
    calendar({
      data: {
        header: ['b', 'c'],
        data: [
          {
            b: '2018-10-02',
            c: 20,
          },
          {
            b: '2018-09-01',
            c: 20,
          },
        ],
      },
    })
  ).toMatchObject(calendarOption);
});
