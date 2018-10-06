import { axios } from '@/utils/axios';

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
