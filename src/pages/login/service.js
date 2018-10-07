import { axios } from '@/utils/axios';
import userTool from '@/utils/users';

/**
*   @database: { 接口管理 }
*   @desc:     { 用户登录 } 
    const { uid, psw } = params;
*/
export const getSysUser = async params =>
  await axios({
    url: '/5/209a76b78d.json',
    params
  }).then(res => res);

/**
 *   @database: { 接口管理 }
 *   @desc:     { 部门列表 }
 */
export const getSysDept = async () =>
  await axios({
    url: '/27/9b520a55df.json'
  }).then(res => res);

/**
 *   @database: { 接口管理 }
 *   @desc:     { 当前用户名是否存在 }
 */
export const getSysUserExist = async username =>
  await axios({
    url: '/28/9c38509a7f.json',
    params: {
      username
    }
  }).then(res => res);

/**
*   @database: { 接口管理 }
*   @desc:     { 用户注册 } 
    const { username, fullname, psw, avatar, user_type, dept_id, menu_id, actived } = params;
*/
export const addSysUser = async params =>
  await axios({
    url: '/29/607526f43d.json',
    params
  }).then(res => res);

export const getIp = async () => await axios({ url: '/ip' });

/**
 *   @database: { 接口管理 }
 *   @desc:     { 获取帐户注册时ip }
 */
export const getSysUserIp = async username =>
  await axios({
    url: '/30/9cb633ba86.json',
    params: {
      username
    }
  }).then(res => res);

/**
*   @database: { 接口管理 }
*   @desc:     { 更新用户头像 } 
	以下参数在建立过程中与系统保留字段冲突，已自动替换:
	@id:_id. 参数说明：api 索引序号
    const { avatar, _id, username } = params;
*/
export const setSysUser = async params =>
  await axios({
    url: '/31/26695416cd.json',
    params
  }).then(res => res);

// 重新登录，处理登录后相关数据逻辑及全局状态更新
export const reLogin = async dispatch => {
  let { data, success } = userTool.getUserSetting();
  if (!success) {
    return false;
  }
  let { values } = data;
  let userInfo = await getSysUser(values);
  if (userInfo.rows > 0) {
    let userSetting = userInfo.data[0];
    userSetting.menu = JSON.parse(userSetting.menu);
    userTool.saveUserSetting({ values, setting: userSetting, autoLogin: true });
    dispatch({
      type: 'common/setStore',
      payload: {
        userSetting,
        isLogin: false
      }
    });
  }
};

/**
*   @database: { 接口管理 }
*   @desc:     { 更新用户基本信息 } 
	以下参数在建立过程中与系统保留字段冲突，已自动替换:
	@id:_id. 参数说明：api 索引序号
    const { fullname, dept_id, _id, username } = params;
*/
export const setSysUserBase = async params =>
  await axios({
    url: '/32/73bf9df9bb.json',
    params
  }).then(res => res);

/**
*   @database: { 接口管理 }
*   @desc:     { 更新密码 } 
    const { new, uid, old } = params;
*/
export const setSysUserPsw = async params =>
  await axios({
    url: '/4/63bc967cec.json',
    params
  }).then(res => res);

/**
 *   @database: { 接口管理 }
 *   @desc:     { 待激活用户列表 }
 */
export const getSysUserUnActived = async () =>
  await axios({
    url: '/33/831c282ac2.json'
  }).then(res => res);
