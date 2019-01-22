import { radar } from './radar';

test('radar', () => {
  const config = {
    data: {
      header: ['a', 'b'],
      data: [
        {
          a: 'a1',
          b: 100,
        },
        {
          a: 'a2',
          b: 90,
        },
        {
          a: 'a3',
          b: 80,
        },
        {
          a: 'a4',
          b: 70,
        },
      ],
    },
  };

  expect(radar(config)).toMatchObject({
    legend: {
      data: [
        { icon: 'circle', name: 'a1' },
        { icon: 'circle', name: 'a2' },
        { icon: 'circle', name: 'a3' },
        { icon: 'circle', name: 'a4' },
      ],
      show: true,
    },
    radar: { indicator: [{ max: 100, name: 'b' }] },
    series: [
      {
        data: [[100]],
        name: 'a1',
        symbol: 'none',
        type: 'radar',
      },
      {
        data: [[90]],
        name: 'a2',
        symbol: 'none',
        type: 'radar',
      },
      {
        data: [[80]],
        name: 'a3',
        symbol: 'none',
        type: 'radar',
      },
      {
        data: [[70]],
        name: 'a4',
        symbol: 'none',
        type: 'radar',
      },
    ],
  });

  let appendConfig = {
    circleshape: '1',
    area: '1',
  };
  expect(radar(Object.assign(config, appendConfig))).toMatchObject({
    legend: {
      data: [
        { icon: 'circle', name: 'a1' },
        { icon: 'circle', name: 'a2' },
        { icon: 'circle', name: 'a3' },
        { icon: 'circle', name: 'a4' },
      ],
      show: true,
    },
    radar: { indicator: [{ max: 100, name: 'b' }], shape: 'circle' },
    series: [
      {
        areaStyle: { opacity: 0.2, type: 'default' },
        data: [[100]],
        name: 'a1',
        symbol: 'none',
        type: 'radar',
      },
      {
        areaStyle: { opacity: 0.2, type: 'default' },
        data: [[90]],
        name: 'a2',
        symbol: 'none',
        type: 'radar',
      },
      {
        areaStyle: { opacity: 0.2, type: 'default' },
        data: [[80]],
        name: 'a3',
        symbol: 'none',
        type: 'radar',
      },
      {
        areaStyle: { opacity: 0.2, type: 'default' },
        data: [[70]],
        name: 'a4',
        symbol: 'none',
        type: 'radar',
      },
    ],
  });
});
