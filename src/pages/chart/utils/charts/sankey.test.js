import { sankey } from './sankey';

test('sankey', () => {
  const data = {
    data: [
      {
        a: '1',
        b: '2',
        c: '3',
      },
    ],
    header: ['a', 'b', 'c'],
  };

  let config = {
    data,
    sequence: '0,1,2',
    vertical: 1,
  };

  let sankeyOption = {
    data: [{ name: '1' }, { name: '2' }],
    focusNodeAdjacency: false,
    itemStyle: { normal: { borderColor: '#aaa', borderWidth: 1 } },
    layout: 'none',
    lineStyle: { normal: { color: 'source', curveness: 0.5 } },
    type: 'sankey',
  };
  let res = {
    series: [
      {
        ...sankeyOption,
        label: { position: 'top' },
        orient: 'vertical',
        links: [{ source: '1', target: '2', value: 3 }],
      },
    ],
    tooltip: { trigger: 'item', triggerOn: 'mousemove' },
  };

  expect(sankey(config)).toMatchObject(res);
  expect(
    sankey({
      data,
      vertical: 0,
    })
  ).toMatchObject({
    series: [
      {
        ...sankeyOption,
        label: { position: 'right' },
        orient: 'horizontal',
        links: [{ source: '1', target: '2', value: 3 }],
      },
    ],
  });

  expect(
    sankey({
      data,
      vertical: 0,
      sequence: '0,1',
    })
  ).toMatchObject({
    series: [
      {
        ...sankeyOption,
        label: { position: 'right' },
        orient: 'horizontal',
        links: [{ source: '1', target: '2', value: NaN }],
      },
    ],
  });

  expect(
    sankey({
      data: {
        data: [
          {
            a: '1',
            b: '2',
            c: '3',
          },
          {
            a: '1',
            b: '2',
            c: '3',
          },
        ],
        header: ['a', 'b', 'c'],
      },
      vertical: 0,
    })
  ).toMatchObject({
    series: [
      {
        ...sankeyOption,
        label: { position: 'right' },
        orient: 'horizontal',
        links: [{ source: '1', target: '2', value: 6 }],
      },
    ],
  });

  expect(
    sankey({
      data: {
        data: [
          {
            a: 'a1',
            b: 'a2',
            c: 3,
          },
          {
            a: 'a2',
            b: 'a2',
            c: 3,
          },
        ],
        header: ['a', 'b', 'c'],
      },
      vertical: 0,
    })
  ).toMatchObject({
    series: [
      {
        data: [{ name: 'a1' }, { name: 'a2' }, { name: 'a2(b)' }],
        links: [{ source: 'a1', target: 'a2', value: 3 }, { source: 'a2', target: 'a2', value: 3 }],
      },
    ],
  });
});
