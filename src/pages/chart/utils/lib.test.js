import lib from './lib';

describe('图表lib', () => {
  test('字符串转日期', () => {
    expect(lib.str2Date('20181221')).toBe('2018-12-21');
    expect(lib.str2Date('2018-12-21')).toBe('2018-12-21');
  });

  test('字符串转数字', () => {
    expect(lib.str2Num('2018')).toBe(2018);
    expect(lib.str2Num('2018.2')).toBe(2018.2);
  });

  test('是否是日期', () => {
    expect(lib.isDate('2018')).toBeFalsy();
    expect(lib.isDate('2018-12-21')).toBeTruthy();
    expect(lib.isDate('20181221')).toBeTruthy();
    expect(lib.isDate('0018-12-21')).toBeFalsy();
  });

  test('是否需要转换', () => {
    expect(lib.needConvertDate('2018-12-21')).toBeTruthy();
    expect(lib.needConvertDate('20181221')).toBeTruthy();
    expect(lib.needConvertDate('201812')).toBeTruthy();
    expect(lib.needConvertDate('2018-12')).toBeTruthy();
  });

  test('按键值分组', () => {
    expect(
      lib.getDataByIdx({
        key: 'a',
        data: [{ a: 1 }, { a: 2 }, { a: 3 }, { a: 4 }, { a: 1 }]
      })
    ).toEqual([1, 2, 3, 4, 1]);
  });

  test('按键值获取唯一值', () => {
    expect(
      lib.getDataByIdx({
        key: 'a',
        data: [{ a: 1 }, { a: 2 }, { a: 4 }, { a: 4 }, { a: 1 }]
      })
    ).toEqual([1, 2, 4, 4, 1]);
  });

  test('按键值获取唯一值', () => {
    expect(
      lib.getDataByKeys({
        keys: ['a', 'b'],
        data: [
          { a: 1, b: 2, c: 3, d: 4 },
          { a: 2, b: 2, c: 3, d: 4 },
          { a: 4, b: 2, c: 3, d: 4 },
          { a: 4, b: 2, c: 3, d: 4 },
          { a: 1, b: 2, c: 3, d: 4 }
        ]
      })
    ).toEqual([[1, 2], [2, 2], [4, 2], [4, 2], [1, 2]]);
  });

  test('convert HEX to RGB', () => {
    expect(lib.hex2rgb('#101010')).toEqual('16,16,16');
    expect(lib.hex2rgb('101010')).toEqual('16,16,16');
  });

  test('convert RGB to HEX', () => {
    expect(lib.rgb2hex('rgb(16,16,16)')).toEqual(['10', '10', '10']);
    expect(lib.rgb2hex('rgb(16,16,16)')).toEqual(['10', '10', '10']);
  });

  test('uniq data', () => {
    expect(lib.uniq([1, 2, 3, 4, 3, 3, 2, 1, 4])).toEqual([1, 2, 3, 4]);
  });

  test('chart height', () => {
    expect(lib.getChartHeight({ type: 'sankey' }, { series: {} })).toBe(
      '900px'
    );
    expect(lib.getChartHeight({ type: 'sunburst' }, { series: {} })).toBe(
      '900px'
    );
    expect(lib.getChartHeight({ type: 'paralell' }, { series: {} })).toBe(
      '900px'
    );
    expect(lib.getChartHeight({ type: 'bar3d' }, { series: {} })).toBe('700px');
    expect(lib.getChartHeight({ type: 'line3d' }, { series: {} })).toBe(
      '700px'
    );
    expect(lib.getChartHeight({ type: 'scatter3d' }, { series: {} })).toBe(
      '700px'
    );
    expect(lib.getChartHeight({ type: 'surface' }, { series: {} })).toBe(
      '700px'
    );
    expect(lib.getChartHeight({ type: 'bar' }, { series: {} })).toBe('500px');
    expect(
      lib.getChartHeight({ type: 'bar', height: 600 }, { series: {} })
    ).toBe('600px');
  });

  test('坐标极值刻度确定', () => {
    expect(lib.handleMinMax({ min: 22, max: 36 })).toEqual({
      min: 20,
      max: 40
    });

    expect(lib.handleMinMax({ min: 2.2, max: 3.6 })).toEqual({
      min: 2,
      max: 4
    });

    expect(lib.handleMinMax({ min: 320, max: 856 })).toEqual({
      min: 300,
      max: 900
    });
  });

  test('数据序列格式化', () => {
    expect(lib.getLegendData(['A品种', 'B品种'])).toEqual([
      {
        name: 'A品种',
        icon: 'circle'
      },
      {
        name: 'B品种',
        icon: 'circle'
      }
    ]);
  });
});
