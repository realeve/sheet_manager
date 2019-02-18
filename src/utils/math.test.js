import * as lib from './math';

test('groupArr', () => {
  const data = [
    { data_type: 'score', data_count: 0 },
    { data_type: 'score', data_count: 1 },
    { data_type: 'score', data_count: 1 },
    { data_type: 'score', data_count: 1 },
    { data_type: 'score', data_count: 1 },
    { data_type: 'score', data_count: 2 },
  ];
  const config = {
    groupFields: [0],
    calFields: [0],
    dataSrc: {
      data,
      header: ['data_type', 'data_count'],
    },
    fieldHeader: [{ label: 'data_type', value: 0 }],
    groupHeader: [{ label: 'data_count', value: 0 }],
  };

  expect(lib.groupArr({ ...config, operatorList: [0] })).toMatchObject({
    data: [['score', 6]],
    header: ['data_type', '计数'],
  });

  expect(
    lib.groupArr({
      groupFields: [],
      calFields: [0],
      dataSrc: {
        data,
        header: ['data_type', 'data_count'],
      },
      fieldHeader: [{ label: 'data_type', value: 0 }],
      groupHeader: [{ label: 'data_count', value: 0 }],
      operatorList: [0],
    })
  ).toMatchObject({
    data: [['score', 6]],
    header: ['data_type', '计数'],
  });

  expect(
    lib.groupArr({
      groupFields: [],
      calFields: [0],
      dataSrc: {
        data: [
          { data_type: 'score', data_count: 0 },
          { data_type: 'score', data_count: 1 },
          { data_type: 'score', data_count: 1 },
          { data_type: 'height', data_count: 1 },
          { data_type: 'height', data_count: 1 },
          { data_type: 'height', data_count: 2 },
        ],
        header: ['data_type', 'data_count'],
      },
      fieldHeader: [{ label: 'data_type', value: 0 }],
      groupHeader: [{ label: 'data_count', value: 0 }],
      operatorList: [0],
    })
  ).toMatchObject({ data: [['score', 3], ['height', 3]], header: ['data_type', '计数'], rows: 2 });

  expect(lib.groupArr({ ...config, operatorList: [0] })).toMatchObject({
    data: [['score', 6]],
    header: ['data_type', '计数'],
  });

  expect(lib.groupArr({ ...config, operatorList: [1] })).toMatchObject({
    data: [['score', 6]],
    header: ['data_type', 'data_count(求和)'],
  });
  expect(lib.groupArr({ ...config, operatorList: [2] })).toMatchObject({
    data: [['score', '1.000']],
    header: ['data_type', 'data_count(平均值)'],
  });
  expect(lib.groupArr({ ...config, operatorList: [3] })).toMatchObject({
    data: [['score', 2]],
    header: ['data_type', 'data_count(最大值)'],
  });
  expect(lib.groupArr({ ...config, operatorList: [4] })).toMatchObject({
    data: [['score', 0]],
    header: ['data_type', 'data_count(最小值)'],
  });
  expect(lib.groupArr({ ...config, operatorList: [5] })).toMatchObject({
    data: [['score', 1]],
    header: ['data_type', 'data_count(中位数)'],
  });
  expect(lib.groupArr({ ...config, operatorList: [6] })).toMatchObject({
    data: [['score', '0.577']],
    header: ['data_type', 'data_count(标准方差)'],
  });
  expect(lib.groupArr({ ...config, operatorList: [7] })).toMatchObject({
    data: [['score', '0.577']],
    header: ['data_type', 'data_count(变异系数)'],
  });
  expect(lib.groupArr({ ...config, operatorList: [8] })).toMatchObject({
    data: [['score', 1]],
    header: ['data_type', 'data_count(众数)'],
  });

  const dataSrc = {
    data,
    header: ['data_type', 'data_count'],
    rows: 0,
  };
  expect(lib.groupArr({ dataSrc })).toMatchObject(dataSrc);

  expect(
    lib.restoreDataSrc({
      data: [
        {
          col_0: 0,
        },
      ],
      header: ['id'],
    })
  ).toMatchObject({ data: [{ id: 0 }], header: ['id'] });

  expect(
    lib.groupArr({
      groupFields: [0],
      calFields: [0],
      dataSrc: {
        data: [
          { data_type: 'score', data_count: 1 },
          { data_type: 'score', data_count: 1 },
          { data_type: 'score', data_count: 1 },
          { data_type: 'score', data_count: 2 },
          { data_type: 'score', data_count: 2 },
          { data_type: 'score', data_count: 2 },
        ],
        header: ['data_type', 'data_count'],
      },
      fieldHeader: [{ label: 'data_type', value: 0 }],
      groupHeader: [{ label: 'data_count', value: 0 }],
      operatorList: [8],
    })
  ).toMatchObject({
    data: [['score', '']],
    header: ['data_type', 'data_count(众数)'],
  });
});

test('计算SPC', () => {
  let res = {
    cl: 2,
    lcl: -2.243,
    ucl: 6.243,
  };
  expect(lib.getSPC([0, 1, 2, 3, 4])).toMatchObject(res);
  expect(lib.getSPC([0, 1, 2, 3, 4], 3)).toMatchObject(res);
});
