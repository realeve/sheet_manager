import { sunburst, handleSunBrustData } from './sunburst';

test('handleSunBrustData', () => {
  let res = handleSunBrustData(
    [
      {
        a: '张三',
        b: 1,
      },
      {
        a: '李四',
        b: 3,
      },
    ],
    ['a', 'b']
  );
  expect(res).toMatchObject([
    { itemStyle: {}, name: '张三', value: 1 },
    { itemStyle: {}, name: '李四', value: 3 },
  ]);
});
test('sunburst', () => {
  const config = {
    data: {
      data: [
        {
          a: '张三',
          c: 'a',
          b: 1,
        },
        {
          a: '李四',
          c: 'b',
          b: 3,
        },
      ],
      header: ['a', 'c', 'b'],
    },
    type: 'sunburst',
  };

  const option = sunburst(config);
  // expect(option).toMatchObject({
  //   series: {
  //     type: 'sunburst',
  //     highlightPolicy: 'ancestor',
  //     radius: [0, '95%'],
  //     data: [{ name: '张三', value: 1, itemStyle: {} }, { name: '李四', value: 3, itemStyle: {} }],
  //     sort: null,
  //     levels: null,
  //   },
  //   tooltip: { trigger: 'item' },
  //   legend: { show: false },
  //   toolbox: {},
  // });

  expect(option).toMatchObject({
    legend: { show: false },
    series: {
      data: [
        {
          children: [{ itemStyle: {}, name: 'a', value: 1 }],
          itemStyle: {},
          name: '张三',
          value: 1,
        },
        {
          children: [{ itemStyle: {}, name: 'b', value: 3 }],
          itemStyle: {},
          name: '李四',
          value: 3,
        },
      ],
      highlightPolicy: 'ancestor',
      levels: [
        {},
        { itemStyle: { borderWidth: 2 }, label: { rotate: 'tangential' }, r: '70%', r0: '15%' },
        {
          itemStyle: { borderWidth: 3 },
          label: { padding: 3, position: 'outside', silent: false },
          r: '73%',
          r0: '70%',
        },
      ],
      radius: [0, '95%'],
      sort: null,
      type: 'sunburst',
    },
    toolbox: {},
    tooltip: { trigger: 'item' },
  });

  expect(sunburst(Object.assign(config, { border: '0' }))).toMatchObject({
    legend: { show: false },
    series: {
      data: [
        {
          children: [{ itemStyle: {}, name: 'a', value: 1 }],
          itemStyle: {},
          name: '张三',
          value: 1,
        },
        {
          children: [{ itemStyle: {}, name: 'b', value: 3 }],
          itemStyle: {},
          name: '李四',
          value: 3,
        },
      ],
      highlightPolicy: 'ancestor',
      levels: [
        {},
        { itemStyle: { borderWidth: 2 }, label: { rotate: 'tangential' }, r: '42.5%', r0: '15%' },
        { itemStyle: { borderWidth: 2 }, label: { align: 'right' }, r: '70%', r0: '42.5%' },
      ],
      radius: [0, '95%'],
      sort: null,
      type: 'sunburst',
    },
    toolbox: {},
    tooltip: { trigger: 'item' },
  });

  expect(
    sunburst({
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
      type: 'sunburst',
    })
  ).toMatchObject({
    series: {
      type: 'sunburst',
      highlightPolicy: 'ancestor',
      radius: [0, '95%'],
      data: [{ name: '张三', value: 1, itemStyle: {} }, { name: '李四', value: 3, itemStyle: {} }],
      sort: null,
      levels: null,
    },
    tooltip: { trigger: 'item' },
    legend: { show: false },
    toolbox: {},
  });
});
