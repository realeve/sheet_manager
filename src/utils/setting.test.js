import * as setting from './setting';

test('全局设置', () => {
  expect(setting.domain).toBe('');
  expect(setting.host).toContain('/api/');
  expect(setting.uploadHost).toContain('/public/upload/');
});
