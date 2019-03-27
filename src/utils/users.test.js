import userTool from './users';

test('encode and decode', () => {
  expect(userTool.getUserSetting()).toEqual({ success: false });
  const userSetting = {
    values: { username: 'develop', password: '111111' },
    setting: {
      uid: 1,
      username: 'develop',
      fullname: '管理员',
      avatar: '1539863001_108003_xfaEy6g4XWAhkPK6iEZpUH1TeGaporbC.jpeg',
      user_type: 1,
      dept_name: '某部门',
      menu_title: '质量信息管理平台',
      actived: 1,
      menu: [],
      previewMenu: [],
    },
    autoLogin: true,
  };
  expect(userTool.saveUserSetting({ setting: { menu: [], previewMenu: [] } })).toBeUndefined();
  expect(userTool.clearUserSetting()).toBeUndefined();

  expect(userTool.saveUserSetting(userSetting)).toBeUndefined();
  expect(userTool.getUserSetting()).toEqual({
    data: userSetting,
    success: true,
  });
  expect(userTool.clearUserSetting()).toBeUndefined();

  expect(userTool.saveLastRouter()).toBeUndefined();
  expect(userTool.readLastRouter()).toBe('undefined');
  userTool.saveLastRouter('path');
  expect(userTool.readLastRouter()).toBe('path');
  userTool.saveLastRouter('/');
  expect(userTool.readLastRouter()).toBe('/menu');

  expect(userTool.getLoginStatus()).toBe(0);
  expect(userTool.saveLoginStatus()).toBeUndefined();
  expect(userTool.getLoginStatus()).toBe('1');
});
