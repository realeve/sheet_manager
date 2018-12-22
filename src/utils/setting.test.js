import * as setting from './setting';

test('全局设置', () => {
  expect(setting.domain).toBe('');
  expect(setting.host).toBe('http://localhost:90/api/');
  expect(setting.uploadHost).toBe('//localhost:90/public/upload/');
});
