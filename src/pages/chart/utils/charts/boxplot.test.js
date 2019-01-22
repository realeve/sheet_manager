import { init } from './boxplot';
import { bar } from './bar';

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
        itemStyle: { borderColor: '#61A5E8' },
        name: '箱线图',
        type: 'boxplot',
      },
    ],
    xAxis: { data: ['mon'], scale: true, type: 'category' },
    yAxis: { scale: true, type: 'value' },
  };
  expect(req).toMatchObject(result);
  expect(init({ data: config.data })).toMatchObject(result);

  expect(bar({ data: config.data, type: 'boxplot' })).toMatchObject(result);

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
        itemStyle: { borderColor: '#61A5E8' },
        name: 'a',
        type: 'boxplot',
      },
    ],
  });

  expect(
    init({
      data: {
        header: ['c', 'a', 'b'],
        data: [
          { a: 'mon', b: 1, c: 'a' },
          { a: 'mon', b: 2, c: 'a' },
          { a: 'mon', b: 3, c: 'a' },
          { a: 'mon', b: 40, c: 'a' },
        ],
      },
      legend: 0,
      x: 1,
      y: 2,
    })
  ).toMatchObject({
    series: [
      {
        data: [[1, 1.75, 2.5, 12.25, 28]],
        itemStyle: { borderColor: '#61A5E8' },
        name: 'a',
        type: 'boxplot',
      },
      { data: [[0, 40]], itemStyle: { color: '#61A5E8' }, name: 'a', type: 'scatter' },
    ],
  });

  expect(
    init({
      data: {
        header: ['c', 'a', 'b'],
        data: [
          { a: 'mon', b: 1, c: 'a' },
          { a: 'mon', b: 2, c: 'a' },
          { a: 'mon', b: 3, c: 'a' },
          { a: 'mon', b: 40, c: 'a' },
        ],
      },
      legend: 0,
    })
  ).toMatchObject({
    series: [
      {
        data: [[1, 1.75, 2.5, 12.25, 28]],
        itemStyle: { borderColor: '#61A5E8' },
        name: 'a',
        type: 'boxplot',
      },
      { data: [[0, 40]], itemStyle: { color: '#61A5E8' }, name: 'a', type: 'scatter' },
    ],
  });
});
