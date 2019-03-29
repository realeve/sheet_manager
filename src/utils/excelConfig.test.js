import * as lib from './excelConfig';

test('表头合并', () => {
  expect(
    lib.initQueryParam({
      interval: 1,
    })
  ).toMatchObject({
    interval: 2,
    autoid: false,
    mergesize: '2',
  });

  expect(
    lib.initQueryParam({
      interval: 3,
      autoid: '1',
      mergesize: '3',
    })
  ).toMatchObject({
    interval: 3,
    autoid: true,
    mergesize: '3',
  });

  // 参数合并

  let config = {
    merge: ['2-3', '0-1'],
    mergetext: ['test'],
    autoid: false,
  };

  expect(lib.handleMerge(config)).toMatchObject({
    merge: [[1, 2], [3, 4]],
    mergedRows: [1, 2, 3, 4],
    mergetext: ['test'],
  });

  config = {
    merge: '0',
    mergetext: 'test',
    mergesize: '2',
    autoid: false,
  };

  expect(lib.handleMerge(config)).toMatchObject({
    merge: [[1, 2]],
    mergedRows: [1, 2],
    mergetext: ['test'],
  });

  config = {
    autoid: true,
  };

  expect(lib.handleMerge(config)).toMatchObject({ merge: [], mergedRows: [], mergetext: [''] });

  config = {
    merge: '0',
    mergetext: 'test',
    autoid: true,
    mergesize: '2',
  };

  expect(lib.handleMerge(config)).toMatchObject({
    merge: [[2, 3]],
    mergedRows: [2, 3],
    mergetext: ['test'],
  });

  expect(lib.handleMerge({ ...config, mergev: '1' })).toMatchObject({
    merge: [[2, 3]],
    mergedRows: [2, 3],
    mergetext: ['test'],
    mergev: [1],
  });

  expect(
    lib.getParams({
      autoid: '0',
      merge: '0',
      mergetext: 'test',
    })
  ).toMatchObject({
    interval: 5,
    autoid: false,
    merge: [[1, 2]],
    mergedRows: [1, 2],
    mergetext: ['test'],
  });
});

test('纵向列合并', () => {
  expect(lib.handleMergeV('1,2,3,4')).toMatchObject([1, 2, 3, 4]);
  expect(lib.handleMergeV('1;2;3;4')).toMatchObject([1, 2, 3, 4]);
  expect(lib.handleMergeV('1-4')).toMatchObject([1, 2, 3, 4]);
  expect(lib.handleMergeV('1')).toMatchObject([1]);
  expect(lib.handleMergeV(1)).toMatchObject([1]);
  expect(lib.handleMergeV([1])).toMatchObject([1]);
  expect(lib.handleMergeV(undefined)).toMatchObject([]);
  expect(lib.handleMergeV('1,2,7-9')).toMatchObject([1, 2, 7, 8, 9]);
});
