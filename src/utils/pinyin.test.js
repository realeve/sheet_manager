import pinyin from './pinyin';

describe('拼音测试', () => {
  test('汉字  的简拼是HZ', () => {
    expect(pinyin.toPinYin('汉字')).toBe('HZ');
  });

  test('汉字的拼音是HanZi', () => {
    expect(pinyin.toPinYinFull('汉字')).toBe('HanZi');
  });

  test('unknown', () => {
    expect(pinyin.toPinYin('囧,')).toBe('J');
    expect(pinyin.toPinYin('tkk 汉  字')).toBe('tkk-H-Z');
    expect(pinyin.toPinYin('012ab-AB')).toBe('012ab-AB');
    expect(pinyin.toPinYin('●')).toBe('');
  });
});
