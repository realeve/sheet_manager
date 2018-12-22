import userTool from './users';

test('encode and decode', () => {
  expect(userTool.getUserSetting()).toEqual({ success: false });
  expect(userTool.clearUserSetting()).toBe(1);
  expect(userTool.readLastRouter()).toBe('/menu');
  expect(userTool.getLoginStatus()).toBe(0);
});
