import userTool from './users';

test('encode and decode', () => {
  expect(userTool.getUserSetting()).toEqual({ success: false });
  expect(userTool.saveUserSetting()).toBeUndefined();
  expect(userTool.clearUserSetting()).toBeUndefined();

  expect(userTool.saveLastRouter()).toBeUndefined();
  expect(userTool.readLastRouter()).toBe('/menu');

  expect(userTool.saveLoginStatus()).toBeUndefined();
  expect(userTool.getLoginStatus()).toBe(0);
});
