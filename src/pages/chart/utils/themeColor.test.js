import * as lib from './themeColor';
let { getColor, COLOR_PLATE_8, COLOR_PLATE_16, COLOR_PLATE_24, COLOR_PIE, COLOR_PIE_16 } = lib;
test('主题颜色', () => {
  expect(getColor(8, 'pie')).toMatchObject(COLOR_PIE);
  expect(getColor(9, 'pie')).toMatchObject(COLOR_PIE_16);
  expect(getColor(8, 'bar')).toMatchObject(COLOR_PLATE_8);
  expect(getColor(16, 'bar')).toMatchObject(COLOR_PLATE_16);
  expect(getColor(32, 'bar')).toMatchObject(COLOR_PLATE_24);
});
