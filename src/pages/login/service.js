import { axios, mock } from '@/utils/axios';
import { DEV, uploadHost, config, CUR_COMPANY, uap } from '@/utils/setting';
import userTool from '@/utils/users';
const curConfig = config[CUR_COMPANY];
const org = curConfig.org;
/**
*   @database: { 接口管理 }
*   @desc:     { 用户登录 } 
    const { username, password } = params;
*/
export const getSysUser = params =>
  axios({
    url: uap.active ? uap.login : '/5/209a76b78d.json',
    params,
  }).then(res => {
    // 采用原接口管理的信息
    if (!uap.active) {
      return res;
    }

    // 采用代理需要对结果做处理
    let {
      data: [{ success, detail: data }],
    } = res;
    let rows = 0;
    if (success) {
      rows = 1;
    }
    return {
      rows,
      data,
    };
  });

/**
 *   @database: { 接口管理 }
 *   @desc:     { 部门列表 }
 */
export const getSysDept = () =>
  DEV
    ? mock(require('@/mock/27_9b520a55df.json'))
    : axios({
        url: uap.active ? uap.dept : '/27/9b520a55df.json',
        params: { org },
      });

/**
 *   @database: { 接口管理 }
 *   @desc:     { 当前用户名是否存在 }
 */
export const getSysUserExist = username =>
  axios({
    url: '/28/9c38509a7f.json',
    params: {
      username,
    },
  });

/**
*   @database: { 接口管理 }
*   @desc:     { 用户注册 } 
    const { username, fullname, psw, avatar, user_type, dept_id, menu_id, actived, ip, sys_id, sys_uid } = params;
*/
export const addSysUser = params =>
  axios({
    url: '/29/607526f43d.json',
    params: {
      ...params,
      sys_uid: 0,
      sys_id: 1,
    },
  });

export const getIp = () => axios({ url: '/ip' });

/**
 *   @database: { 接口管理 }
 *   @desc:     { 获取帐户注册时ip }
 */
export const getSysUserIp = username =>
  axios({
    url: '/30/9cb633ba86.json',
    params: {
      username,
    },
  });

/**
*   @database: { 接口管理 }
*   @desc:     { 更新用户头像 } 
	以下参数在建立过程中与系统保留字段冲突，已自动替换:
	@id:_id. 参数说明：api 索引序号
    const { avatar, _id, username } = params;
*/
export const setSysUser = params =>
  axios({
    url: '/31/26695416cd.json',
    params,
  });

// 根据部门获取用户列表
export const getUserListBydept = dept => {
  const url = DEV ? 'http://localhost:3030/api/users' : uap.user;
  return axios({
    url,
    params: {
      org,
      dept,
    },
  });
};

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
    // userSetting.menu = JSON.parse(userSetting.menu);
    userTool.saveUserSetting({ values, setting: userSetting, autoLogin: true });
    dispatch({
      type: 'common/setStore',
      payload: {
        userSetting,
        isLogin: false,
      },
    });
    userTool.saveLoginStatus(0);
  }
};

/**
*   @database: { 接口管理 }
*   @desc:     { 更新用户基本信息 } 
	以下参数在建立过程中与系统保留字段冲突，已自动替换:
	@id:_id. 参数说明：api 索引序号
    const { fullname, dept_id, _id, username } = params;
*/
export const setSysUserBase = params =>
  axios({
    url: '/32/73bf9df9bb.json',
    params,
  });

/**
*   @database: { 接口管理 }
*   @desc:     { 更新密码 } 
    const { new, uid, old } = params;
*/
export const setSysUserPsw = params =>
  axios({
    url: '/4/63bc967cec.json',
    params,
  });

/**
 *   @database: { 接口管理 }
 *   @desc:     { 待激活用户列表 }
 */
export const getSysUserUnActived = () =>
  axios({
    url: '/33/831c282ac2.json',
  });

/**
 *   @database: { 接口管理 }
 *   @desc:     { 用户类型列表 }
 */
export const getSysUserTypes = () =>
  axios({
    url: '/34/ad64451402.json',
  });

/**
*   @database: { 接口管理 }
*   @desc:     { 用户激活 } 
	以下参数在建立过程中与系统保留字段冲突，已自动替换:
	@id:_id. 参数说明：api 索引序号
    const { user_type, _id ,menu_id} = params;
*/
export const setSysUserActive = params =>
  axios({
    url: '/35/8c99b29613.json',
    params,
  });

export const uploadFile = data =>
  axios({
    method: 'post',
    url: uploadHost,
    data,
  });

export const ip = () =>
  axios({
    url: '/ip',
  }).then(res => res.ip);
