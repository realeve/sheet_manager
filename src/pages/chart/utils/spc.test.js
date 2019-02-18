import * as lib from './spc';

test('spc rule2', () => {
  let arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
  let dist = new Array(arr.length).fill(0);

  expect(lib.checkRule2(arr, dist, { cl: 0 })).toMatchObject(
    '0,1,1,1,1,1,1,1,1,1,0'.split(',').map(item => parseInt(item, 10))
  );

  arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
  dist = new Array(arr.length).fill(0);
  expect(lib.checkRule2(arr, dist, { cl: 5 })).toMatchObject(dist);

  arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
  dist = new Array(arr.length).fill(0);
  expect(lib.checkRule2(arr, dist, { cl: 9 })).toMatchObject(
    '1,1,1,1,1,1,1,1,1,0,0'.split(',').map(item => parseInt(item, 10))
  );

  arr = [0, 1, 2];
  dist = new Array(arr.length).fill(0);
  expect(lib.checkRule2(arr, dist, { cl: 1 })).toMatchObject([0, 0, 0]);
});

test('spc rule3', () => {
  let arr = [0, 1, 2, 3, 4, 5, 9, 8, 7];
  let dist = new Array(arr.length).fill(0);

  expect(lib.checkRule3(arr, dist)).toMatchObject(
    '1,1,1,1,1,1,1,0,0'.split(',').map(item => parseInt(item, 10))
  );

  arr = [7, 8, 9, 5, 4, 3, 2, 1, 0];
  dist = new Array(arr.length).fill(0);
  expect(lib.checkRule3(arr, dist)).toMatchObject(
    '0,0,1,1,1,1,1,1,1'.split(',').map(item => parseInt(item, 10))
  );

  arr = [7, 8, 3, 5, 4, 3, 7, 1, 0];
  dist = new Array(arr.length).fill(0);
  expect(lib.checkRule3(arr, dist)).toMatchObject(dist);

  arr = [0, 1, 2];
  dist = new Array(arr.length).fill(0);
  expect(lib.checkRule3(arr, dist)).toMatchObject(
    '0,0,0'.split(',').map(item => parseInt(item, 10))
  );
});

test('spc rule4', () => {
  let arr = [1, 2, 4, 3, 4, 3, 4, 3, 4, 3, 4, 3, 4, 3, 4, 1, 0];
  let dist = new Array(arr.length).fill(0);
  expect(lib.checkRule4(arr, dist)).toMatchObject(
    '0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0'.split(',').map(item => parseInt(item, 10))
  );

  arr = [1, 2, 4, 3, 4, 3, 4, 3, 5, 5, 4, 3, 4, 3, 4, 1, 0];
  dist = new Array(arr.length).fill(0);
  expect(lib.checkRule4(arr, dist)).toMatchObject(dist);

  arr = [1, 2, 4];
  dist = new Array(arr.length).fill(0);
  expect(lib.checkRule4(arr, dist)).toMatchObject(
    '0,0,0'.split(',').map(item => parseInt(item, 10))
  );

  arr = [1, 2, 4, 3, 4, 3, 4, 3, 4, 3, 4, 3, 4, 3];
  dist = new Array(arr.length).fill(0);
  expect(lib.checkRule4(arr, dist)).toMatchObject(dist);
});

test('spc rule5', () => {
  let arr = [0, 0, 2, 2.5, 4, 4];
  let dist = new Array(arr.length).fill(0);
  expect(
    lib.checkRule5(arr, dist, {
      cl: 0,
      sigma: 1,
    })
  ).toMatchObject('0,0,1,1,0,0'.split(',').map(item => parseInt(item, 10)));

  arr = [1, 2];
  dist = new Array(arr.length).fill(0);
  expect(lib.checkRule5(arr, dist)).toMatchObject([0, 0]);

  arr = [0, 0, -2.3, -2.5, 4, 4];
  dist = new Array(arr.length).fill(0);
  expect(
    lib.checkRule5(arr, dist, {
      cl: 0,
      sigma: 1,
    })
  ).toMatchObject('0,0,1,1,0,0'.split(',').map(item => parseInt(item, 10)));

  arr = [0, 0, 2.3, -2.5, 4, 4];
  dist = new Array(arr.length).fill(0);
  expect(
    lib.checkRule5(arr, dist, {
      cl: 0,
      sigma: 1,
    })
  ).toMatchObject(dist);
});

test('spc rule6', () => {
  let arr = [0, 0, 2, 2.5, 2.6, 2.7, 4, 4];
  let dist = new Array(arr.length).fill(0);
  expect(
    lib.checkRule6(arr, dist, {
      cl: 0,
      sigma: 1,
    })
  ).toMatchObject('0,0,1,1,1,1,0,0'.split(',').map(item => parseInt(item, 10)));

  arr = [1, 2];
  dist = new Array(arr.length).fill(0);
  expect(lib.checkRule6(arr, dist)).toMatchObject([0, 0]);

  arr = [0, 0, -2.3, -2.5, -2.6, -2.7, 4, 4];
  dist = new Array(arr.length).fill(0);
  expect(
    lib.checkRule6(arr, dist, {
      cl: 0,
      sigma: 1,
    })
  ).toMatchObject('0,0,1,1,1,1,0,0'.split(',').map(item => parseInt(item, 10)));

  arr = [0, 0, 2.3, -2.5, 2.6, -2.7, 4, 4];
  dist = new Array(arr.length).fill(0);
  expect(
    lib.checkRule6(arr, dist, {
      cl: 0,
      sigma: 1,
    })
  ).toMatchObject(dist);
});

test('spc rule7', () => {
  let arr = [3, 1, 1, 1.5, 1.6, 1.7, 1.1, 1.1, 1.1, 1.1, 1.1, 1.2, 1.3, 1.4, 1.5, 1.5, 3];
  let dist = new Array(arr.length).fill(0);
  expect(
    lib.checkRule7(arr, dist, {
      cl: 0,
      sigma: 2,
    })
  ).toMatchObject('0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0'.split(',').map(item => parseInt(item, 10)));

  arr = [1, 2];
  dist = new Array(arr.length).fill(0);
  expect(lib.checkRule7(arr, dist)).toMatchObject([0, 0]);

  arr = [3, 1, 1, 1.5, 1.6, -1.7, -1.1, 1.1, -1.1, 1.1, 1.1, -1.2, 1.3, 1.4, 1.5, 1.5, 3];
  dist = new Array(arr.length).fill(0);
  expect(
    lib.checkRule7(arr, dist, {
      cl: 0,
      sigma: 2,
    })
  ).toMatchObject('0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0'.split(',').map(item => parseInt(item, 10)));

  arr = [3, 1, 1, 1.5, 1.6, -1.7, -1.1, 1.1, -1.1, 1.1, 1.1, -1.2, 1.3, 1.4, 1.5, 1.5, 3];
  dist = new Array(arr.length).fill(0);
  expect(
    lib.checkRule7(arr, dist, {
      cl: 0,
      sigma: 1,
    })
  ).toMatchObject(dist);
});

test('spc rule8', () => {
  let arr = [0, 2, 2, 2, 2, 3, 3, 3, 3, 0];
  let dist = new Array(arr.length).fill(0);
  expect(
    lib.checkRule8(arr, dist, {
      cl: 0,
      sigma: 2,
    })
  ).toMatchObject('0,1,1,1,1,1,1,1,1,0'.split(',').map(item => parseInt(item, 10)));

  arr = [1, 2];
  dist = new Array(arr.length).fill(0);
  expect(lib.checkRule8(arr, dist)).toMatchObject([0, 0]);

  arr = [0, 2, -2, 2, -2, -3, 3, -3, 3, 0];
  dist = new Array(arr.length).fill(0);
  expect(
    lib.checkRule8(arr, dist, {
      cl: 0,
      sigma: 2,
    })
  ).toMatchObject('0,1,1,1,1,1,1,1,1,0'.split(',').map(item => parseInt(item, 10)));

  arr = [0, 2, 2, 2, 2, 3, 3, 3, 3, 0];
  dist = new Array(arr.length).fill(0);
  expect(
    lib.checkRule8(arr, dist, {
      cl: 0,
      sigma: 4,
    })
  ).toMatchObject(dist);
});

test('spc 处理Y轴的data异常数据', () => {
  let res = lib.handleDistData([1, 2], [0, 1]);
  expect(res[0]).toBe(1);
  expect(res[1]).toMatchObject({
    itemStyle: { normal: { borderColor: '#f23344' } },
    symbol: 'circle',
    // symbolSize: 6,
    value: 2,
  });
});

test('spc 数据生成', () => {
  let arr = [1, 2, 3];
  expect(
    lib.handleShewhartControlChart(arr, {
      cl: 2,
      lcl: 2 - 3 * 0.8165,
      ucl: 2 + 3 * 0.8165,
    })
  ).toMatchObject([1, 2, 3]);
});
