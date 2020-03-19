import {
  handler,
  validRequire,
  getPostData,
  onValidate,
  getRuleMsg,
  getUrl,
  handleOptions,
} from './lib';

// umi test ./src/components/FormCreater/lib.test.js

test('获取增删改查地址', () => {
  let url = 'a.json';
  expect(getUrl(url)).toBe(url);
  expect(getUrl({ url })).toBe(url);
});

test('数据转换处理', () => {
  expect(handler.toUpper('a')).toBe('A');
  expect(handler.toLower('A')).toBe('a');
  expect(handler.toLower('A ')).toBe('a');
  expect(handler.trim(true)).toBe(1);
  expect(handler.trim('a ')).toBe('a ');
  expect(handler.trim([1, 2])).toBe('1,2');
  expect(handler.trim({ a: 1 })).toMatchObject({ a: 1 });
});

test('判断必填字段完整性', () => {
  expect(validRequire(['a', 'b', 'c'], ['c'], { a: 2 })).toBeFalsy();
});

test('处理提交至数据库后台的数据', () => {
  expect(
    getPostData({
      config: {
        api: {
          insert: {
            param: ['uid', 'rec_time'],
            url: '1/a.json',
          },
          update: '1/b.json',
        },
      },
      params: { a: 1 },
      editMethod: 'insert',
      uid: 1,
    })
  ).toMatchObject({
    method: 'post',
    data: {
      id: '1',
      nonce: 'a',
      a: 1,
      uid: 1,
    },
  });

  expect(
    getPostData({
      config: {
        api: {
          insert: {
            url: '1/a.json',
            param: [],
          },
          update: '2/b.json',
        },
      },
      params: { a: 1 },
      editMethod: 'insert',
      uid: 1,
    })
  ).toMatchObject({ data: { a: 1, id: '1', nonce: 'a' }, method: 'post' });

  expect(
    getPostData({
      config: {
        api: { insert: '1/a.json', update: '2/b.json?param1=3' },
      },
      params: { a: 1 },
      editMethod: 'update',
      uid: 1,
    })
  ).toMatchObject({ data: { a: 1, id: '2', nonce: 'b', param1: '3' }, method: 'post' });
});

test('数据格式校验', () => {
  expect(onValidate('a')).toBeTruthy();

  expect(onValidate('1', { type: '/^\\d+$/' })).toBeTruthy();

  expect(onValidate('1820A011', 'cart')).toBeTruthy();
  expect(onValidate('1820A011', { type: 'cart' })).toBeTruthy();
  expect(onValidate('7420011A', { type: 'reel' })).toBeTruthy();
  expect(onValidate('A000A0', { type: 'gz' })).toBeTruthy();
  expect(onValidate('12', { type: 'number' })).toBeTruthy();
  expect(onValidate('12', { type: 'int' })).toBeTruthy();
  expect(onValidate('1.2', { type: 'float' })).toBeTruthy();
  expect(onValidate('1.2', { type: 'unknown' })).toBeTruthy();
});

test('生产校验提示文字', () => {
  expect(getRuleMsg({ msg: 'a' })).toBe('a');

  expect(getRuleMsg('cart', '某字段')).toContain('车号');
  expect(getRuleMsg({ type: 'cart' }, '某字段')).toContain('车号');
  expect(getRuleMsg({ type: 'reel' }, '某字段')).toContain('轴号');
  expect(getRuleMsg({ type: 'gz' }, '某字段')).toContain('冠字');
  expect(getRuleMsg({ type: 'int' }, '某字段')).toContain('数字类型');
  expect(getRuleMsg({ type: 'float' }, '某字段')).toContain('数字类型');
  expect(getRuleMsg({ type: 'number' }, '某字段')).toContain('数字类型');
  expect(getRuleMsg({ type: 'unknown' }, '某字段')).toContain('验证失败');
});

test('下拉选择选项预处理', () => {
  expect(handleOptions([{ name: 'a', value: 1 }])).toMatchObject([
    { name: 'a', value: 1, label: 'a' },
  ]);

  expect(handleOptions([{ id: 1, value: 'a' }])).toMatchObject([
    { name: 'a', value: 1, label: 'a' },
  ]);

  expect(handleOptions([{ id: 1, value: 'a' }], true)).toMatchObject([
    { name: 'a', value: 'a', label: 'a' },
  ]);
  expect(handleOptions([{ id: 1, value: 'a' }], false)).toMatchObject([
    { name: 'a', value: 1, label: 'a' },
  ]);
});
