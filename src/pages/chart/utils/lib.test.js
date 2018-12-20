import lib from './lib';

describe('图表lib', () => {
  test('字符串转日期', () => {
    expect(lib.str2Date('20181221')).toBe('2018-12-21');
    expect(lib.str2Date('2018-12-21')).toBe('2018-12-21');
  });

  test('字符串转数字', () => {
    expect(lib.str2Num('2018')).toBe(2018);
    expect(lib.str2Num('2018.2')).toBe('2018.2');
  });
});
