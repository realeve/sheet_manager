import { treemap } from './treemap';

test('treemap', () => {
  const config = {
    data: {
      data: [
        {
          a: '张三',
          b: 1,
        },
        {
          a: '李四',
          b: 3,
        },
      ],
      header: ['a', 'b'],
    },
    type: 'treemap',
  };

  const {
    series: { squareRatio },
    tooltip: { formatter },
  } = treemap(config);

  expect(squareRatio).toBeCloseTo(1.618, 2);
  expect(
    formatter({
      data: {
        name: 'a',
        value: 1,
      },
    })
  ).toBe('a:1(25.00%)');

  const option = treemap(Object.assign(config, { scale: 1 }));
  expect(option).toMatchObject({
    series: {
      type: 'treemap',
      data: [{ name: '张三', value: 1 }, { name: '李四', value: 3 }],
      squareRatio: 1,
    },
    tooltip: { trigger: 'item' },
    legend: { show: false },
    toolbox: {},
  });
});
