import * as lib from './lib';
import dateRanges from './ranges';

describe('lib模块', () => {
  test('车号与轴号有效性', () => {
    expect(lib.isCartOrReel('1820A233')).toBe(true);
    expect(lib.isCartOrReel('1880A233')).toBe(true);
    expect(lib.isCartOrReel('1880a233')).toBe(true);
    expect(lib.isCartOrReel('182A2233')).not.toBe(true);
    expect(lib.isCartOrReel('7720015')).not.toBe(true);
    expect(lib.isCartOrReel('7720015A')).toBe(true);
    expect(lib.isCartOrReel('7720015a')).toBe(true);
  });
  test('车号有效性', () => {
    expect(lib.isCart('1820A233')).toBe(true);
    expect(lib.isCart('1880A233')).toBe(true);
    expect(lib.isCart('1880a233')).toBe(true);
    expect(lib.isCart('182A2233')).not.toBe(true);
    expect(lib.isCart('7720015')).not.toBe(true);
  });
  test('轴号有效性', () => {
    expect(lib.isReel('7720015')).not.toBe(true);
    expect(lib.isReel('7720015A')).toBe(true);
    expect(lib.isReel('7720015a')).toBe(true);
  });

  test('日期有效性', () => {
    expect(lib.isDateTime('2018/12/25')).toBe(true);
    expect(lib.isDateTime('20181225')).toBe(true);
    expect(lib.isDateTime('2018-12-25')).toBe(true);
    expect(lib.isDateTime('2018-12-25 12:13:14')).toBe(true);

    expect(lib.isDateTime('2018A12-25 12:13:14')).not.toBe(true);
    expect(lib.isDateTime('2018-12-25 12:13')).not.toBe(true);
    expect(lib.isDateTime('201801225')).not.toBe(true);
    expect(lib.isDateTime('2018-12-25 31:22:23')).not.toBe(true);
  });

  test('number', () => {
    expect(lib.isNumOrFloat('23')).toBe(true);
    expect(lib.isNumOrFloat('0.23')).toBe(true);
    expect(lib.isNumOrFloat('+23')).toBe(true);
    expect(lib.isNumOrFloat('+0.23')).toBe(true);
    expect(lib.isNumOrFloat('-223')).toBe(true);
    expect(lib.isNumOrFloat('-2.23')).toBe(true);

    expect(lib.isNumOrFloat('-a')).not.toBe(true);
    expect(lib.isNumOrFloat('a')).not.toBe(true);
    expect(lib.isNumOrFloat('0.-a')).not.toBe(true);
    expect(lib.isNumOrFloat('0a')).not.toBe(true);
  });

  test('int', () => {
    expect(lib.isInt('23')).toBe(true);
    expect(lib.isInt('0.23')).not.toBe(true);
    expect(lib.isInt('+23')).toBe(true);
    expect(lib.isInt('+0.23')).not.toBe(true);
    expect(lib.isInt('-223')).toBe(true);
    expect(lib.isInt('-2.23')).not.toBe(true);

    expect(lib.isInt('-a')).not.toBe(true);
    expect(lib.isInt('a')).not.toBe(true);
    expect(lib.isInt('0.-a')).not.toBe(true);
    expect(lib.isInt('0a')).not.toBe(true);
  });

  test('float', () => {
    expect(lib.isFloat('23')).toBe(true);
    expect(lib.isFloat('0.23')).toBe(true);
    expect(lib.isFloat('+23')).toBe(true);
    expect(lib.isFloat('+0.23')).toBe(true);
    expect(lib.isFloat('-223')).toBe(true);
    expect(lib.isFloat('-2.23')).toBe(true);

    expect(lib.isFloat('-a')).not.toBe(true);
    expect(lib.isFloat('a')).not.toBe(true);
    expect(lib.isFloat('0.-a')).not.toBe(true);
    expect(lib.isFloat('0a')).not.toBe(true);
  });

  test('decimal', () => {
    expect(lib.hasDecimal('3.3')).toBe(true);
    expect(lib.hasDecimal('+3.3')).toBe(true);
    expect(lib.hasDecimal('-3.3')).toBe(true);
    expect(lib.hasDecimal('3')).not.toBe(true);
    expect(lib.hasDecimal('3.a')).not.toBe(true);
    expect(lib.hasDecimal('a.3')).not.toBe(true);
  });

  test('parseNumber', () => {
    expect(lib.parseNumber('3')).toBe('3');
    expect(lib.parseNumber('3.223')).toBe('3.223');
    expect(lib.parseNumber('3.2235')).toBe('3.224');
  });

  test('冠字起始号', () => {
    expect(
      lib.handleGZInfo({
        prod: '9602A',
        code: 'a2344b'
      })
    ).toEqual({
      alpha: 'A****B',
      alpha2: 'A****B',
      start: '2305',
      start2: '2305',
      end: '2344',
      end2: '2344'
    });

    expect(
      lib.handleGZInfo({
        prod: '9602A',
        code: 'a234b4'
      })
    ).toEqual({
      alpha: 'A***B',
      alpha2: 'A***B',
      start: '2305',
      start2: '2305',
      end: '2344',
      end2: '2344'
    });

    expect(
      lib.handleGZInfo({
        prod: '9602A',
        code: 'a23b44'
      })
    ).toEqual({
      alpha: 'A**B',
      alpha2: 'A**B',
      start: '2305',
      start2: '2305',
      end: '2344',
      end2: '2344'
    });

    expect(
      lib.handleGZInfo({
        prod: '9602A',
        code: 'a2c344'
      })
    ).toEqual({
      alpha: 'A*C',
      alpha2: 'A*C',
      start: '2305',
      start2: '2305',
      end: '2344',
      end2: '2344'
    });

    expect(
      lib.handleGZInfo({
        prod: '9602A',
        code: 'ac2344'
      })
    ).toEqual({
      alpha: 'AC',
      alpha2: 'AC',
      start: '2305',
      start2: '2305',
      end: '2344',
      end2: '2344'
    });

    expect(
      lib.handleGZInfo({
        prod: '9603A',
        code: 'a2c344'
      })
    ).toEqual({
      alpha: 'A*C',
      alpha2: 'A*C',
      start: '2305',
      start2: '2305',
      end: '2344',
      end2: '2344'
    });

    expect(
      lib.handleGZInfo({
        prod: '9604A',
        code: 'a2c344'
      })
    ).toEqual({
      alpha: 'A*C',
      alpha2: 'A*C',
      start: '2310',
      start2: '2310',
      end: '2344',
      end2: '2344'
    });

    expect(
      lib.handleGZInfo({
        prod: '9606A',
        code: 'a2c344'
      })
    ).toEqual({
      alpha: 'A*C',
      alpha2: 'A*C',
      start: '2310',
      start2: '2310',
      end: '2344',
      end2: '2344'
    });

    expect(
      lib.handleGZInfo({
        prod: '9606A',
        code: 'a0c014'
      })
    ).toEqual({
      alpha: 'A*B',
      start: '9980',
      end: '9999',
      alpha2: 'A*C',
      start2: '0000',
      end2: '0014'
    });

    expect(
      lib.handleGZInfo({
        prod: '9602A',
        code: 'a0c014'
      })
    ).toEqual({
      alpha: 'A*B',
      start: '9975',
      end: '9999',
      alpha2: 'A*C',
      start2: '0000',
      end2: '0014'
    });
  });
  expect(
    lib.handleGZInfo({
      prod: '9602A',
      code: 'A0C014'
    })
  ).toEqual({
    alpha: 'A*B',
    start: '9975',
    end: '9999',
    alpha2: 'A*C',
    start2: '0000',
    end2: '0014'
  });

  test('冠字', () => {
    expect(lib.isGZ('AC2322')).toBe(true);
    expect(lib.isGZ('ac2322')).toBe(true);
    expect(lib.isGZ('AC23224')).not.toBe(true);
    expect(lib.isGZ('A2C322')).toBe(true);
    expect(lib.isGZ('A23C32')).toBe(true);
    expect(lib.isGZ('A233C2')).toBe(true);
    expect(lib.isGZ('A2333C')).toBe(true);
  });

  test('千分位数字转换', () => {
    expect(lib.thouandsNum(2333)).toBe('2,333.00');
    expect(lib.thouandsNum(23334, 3)).toBe('23,334.000');
    expect(lib.thouandsNum('')).toBe('');
    expect(lib.thouandsNum(2333.1, 3)).toBe('2,333.100');
    expect(lib.thouandsNum(2333.4467, 3)).toBe('2,333.447');
  });

  test('地址栏参数', () => {
    const [tstart, tend] = dateRanges['过去一月'];
    const [ts, te] = [tstart.format('YYYYMMDD'), tend.format('YYYYMMDD')];

    expect(lib.handleUrlParams('#id=6/8d5b63370c&data_type=score')).toEqual({
      id: ['6/8d5b63370c'],
      params: {
        data_type: 'score'
      },
      dateRange: [ts, te]
    });
  });

  test('类型判断', () => {
    expect(lib.getType(23)).toBe('number');
    expect(lib.getType('23')).toBe('string');
    expect(lib.getType([])).toBe('array');
    expect(lib.getType({})).toBe('object');
    expect(lib.getType(() => {})).toBe('function');
    expect(lib.getType(null)).toBe('null');
    expect(lib.getType(typeof n)).toBe('string');
  });

  test('store存储测试', () => {
    expect(lib.setStore({ a: 1 }, { payload: { b: 2 } })).toEqual({
      a: 1,
      b: 2
    });
    expect(lib.setStore({ a: 1 }, { payload: { b: 2, c: 2 } })).toEqual({
      a: 1,
      b: 2,
      c: 2
    });
    expect(lib.setStore({ a: 1 }, { payload: { a: 2 } })).toEqual({ a: 2 });

    // throw error报错
    // expect(lib.setStore({ a: 1 }, { b: 2 })).toThrowError(/payload/);

    expect(0.1 + 0.2).toBeCloseTo(0.3);
  });
  // END
});