import { init } from './scatter';

test('scatter', () => {
  let option = {
    xAxis: {},
    series: [
      {
        name: 'scatter1',
        data: [],
      },
    ],
  };
  let data = {
    header: ['a', 'b', 'c'],
    data: [
      {
        a: 1,
        b: 2,
        c: 3,
      },
    ],
  };
  let res = init(option, { scale: 1, z: 1, scattersize: 1 }, data);
  expect(res).toMatchObject({
    series: [{ data: [], name: 'scatter1' }],
    xAxis: [],
  });
  expect(res.series[0].symbolSize([0, 1, 2])).toBe(2);

  expect(init(option, { scattersize: 1 }, data)).toMatchObject({
    series: [{ data: [], name: 'scatter1', symbolSize: 1 }],
    xAxis: {},
  });
  expect(init(option, { z: 1, scattersize: 1 }, data)).toMatchObject({
    series: [{ data: [], name: 'scatter1' }],
    xAxis: {},
  });
  expect(init(option, { scattersize: 1 }, data)).toMatchObject({
    series: [{ data: [], name: 'scatter1', symbolSize: 1 }],
    xAxis: {},
  });
  expect(init(option, {}, data)).toMatchObject({
    series: [{ data: [], name: 'scatter1', symbolSize: 20 }],
    xAxis: {},
  });

  expect(
    init(
      {
        xAxis: ['a', 'b', 'c'],
        series: [
          {
            name: 'scatter1',
            data: [{}],
          },
        ],
      },
      { z: 1 },
      data
    )
  ).toMatchObject({ series: [{ data: [['a', {}, NaN]], name: 'scatter1' }], xAxis: [] });

  expect(
    init(
      {
        xAxis: ['a', 'b', 'c'],
        series: [
          {
            name: 'scatter1',
            data: new Array(101).fill([1, 2, 3]),
          },
        ],
      },
      { z: 1 },
      data
    )
  ).toMatchObject({ series: [{ large: true, name: 'scatter1' }], xAxis: [] });
});
