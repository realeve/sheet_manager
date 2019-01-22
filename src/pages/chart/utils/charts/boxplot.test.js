import { init } from './boxplot';

test('boxplot', () => {
  const config = {
    data: {
      header: ['a', 'b'],
      data: [{ a: 'mon', b: 1 }, { a: 'mon', b: 2 }, { a: 'mon', b: 3 }, { a: 'mon', b: 4 }],
    },
    x: 0,
    y: 1,
  };
  const req = init(config);
  const result = {
    series: [
      {
        data: [[1, 1.75, 2.5, 3.25, 4]],
        itemStyle: { borderColor: undefined },
        name: undefined,
        type: 'boxplot',
      },
    ],
    xAxis: { data: ['mon'], scale: true, type: 'category' },
    yAxis: { scale: true, type: 'value' },
  };
  expect(req).toMatchObject(result);

  expect(req.series[0].tooltip.formatter({ name: 'a1', data: [0, 1, 2, 3, 4, 5] })).toContain(
    'Experiment'
  );

  expect(
    init({
      data: {
        header: ['c', 'a', 'b'],
        data: [
          { a: 'mon', b: 1, c: 'a' },
          { a: 'mon', b: 2, c: 'a' },
          { a: 'mon', b: 3, c: 'a' },
          { a: 'mon', b: 4, c: 'a' },
        ],
      },
      legend: 0,
      x: 1,
      y: 2,
    })
  ).toMatchObject({
    series: [
      {
        data: [[1, 1.75, 2.5, 3.25, 4]],
        itemStyle: { borderColor: undefined },
        name: undefined,
        type: 'boxplot',
      },
    ],
  });
});
