import dataTool from './dataTool';

test('数据处理工具', () => {
  expect(dataTool.prepareBoxplotData([[1, 2, 3, 4, 5, 20]])).toMatchObject({
    boxData: [[1, 2.25, 3.5, 4.75, 8.5]],
    outliers: [[0, 20]],
    axisData: ['0'],
  });

  // layout,boundIQR
  expect(
    dataTool.prepareBoxplotData([[1, 2, 3, 4, 5, 20]], {
      boundIQR: 1.5,
      layout: 'vertical',
    })
  ).toMatchObject({
    boxData: [[1, 2.25, 3.5, 4.75, 8.5]],
    outliers: [[0, 20].reverse()],
    axisData: ['0'],
  });

  // useExtreme
  expect(
    dataTool.prepareBoxplotData([[1, 2, 3, 4, 5, 20]], {
      boundIQR: 0,
    })
  ).toMatchObject({
    boxData: [[1, 2.25, 3.5, 4.75, 20]],
    outliers: [],
    axisData: ['0'],
  });
});
