import * as lib from './lib';

describe('lib模块测试', () => {
  test('车号有效性测试', () => {
    expect(lib.isCartOrReel('1820A233')).toBe(true);
  });
});
