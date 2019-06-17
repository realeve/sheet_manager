import { axios } from '@/utils/axios';
const R = require('ramda');

/**
*   @database: { 接口管理 }
*   @desc:     { 插入菜单项 } 
    const { icon, title, url, pinyin, pinyin_full } = params;
*/
export const addBaseMenuItem = params =>
  axios({
    url: '/18/2b9eaaab97.json',
    params,
  });

export const clearMenu = () => axios({ url: '/clear/23' });

/**
*   @database: { 接口管理 }
*   @desc:     { 更新菜单项 } 
	以下参数在建立过程中与系统保留字段冲突，已自动替换:
	@id:_id. 参数说明：api 索引序号
    const { icon, title, url, pinyin, pinyin_full, _id } = params;
*/
export const setBaseMenuItem = params =>
  axios({
    url: '/19/5fc349508c.json',
    params,
  });

/**
 *   @database: { 接口管理 }
 *   @desc:     { 查询菜单项 }
 */
export const getBaseMenuItem = uid =>
  axios({
    url: '/20/b5fa4e6e6e.json',
  });
// .then(res => {
//   // 管理员
//   if (uid != 1) {
//     res.data = res.data.filter(R.propEq('uid', uid));
//   }
//   return res;
// });

/**
*   @database: { 接口管理 }
*   @desc:     { 删除菜单 } 
	以下参数在建立过程中与系统保留字段冲突，已自动替换:
	@id:_id. 参数说明：api 索引序号
      */
export const delBaseMenuItem = _id =>
  axios({
    url: '/21/548039aa24.json',
    params: {
      _id,
    },
  });

/**
*   @database: { 接口管理 }
*   @desc:     { 插入菜单配置信息 } 
    const { title, detail, uid } = params;
*/
export const addBaseMenuList = params =>
  axios({
    url: '/22/48c41dde3b.json',
    params,
  });

/**
 *   @database: { 接口管理 }
 *   @desc:     { 读取菜单配置列表 }
 */
export const getBaseMenuList = () =>
  axios({
    url: '/23/dc95d5f25b/5.json',
  });

/** 数据量较大时建议使用post模式：
*
*   @database: { 接口管理 }
*   @desc:     { 修改菜单列表 } 
	以下参数在建立过程中与系统保留字段冲突，已自动替换:
	@id:_id. 参数说明：api 索引序号
    const { title, detail, _id, uid } = params;
*/
export const setBaseMenuList = params =>
  axios({
    method: 'post',
    data: {
      ...params,
      id: 24,
      nonce: '0e4f343fa7',
    },
  });

/**
*   @database: { 接口管理 }
*   @desc:     { 删除菜单列表 } 
	以下参数在建立过程中与系统保留字段冲突，已自动替换:
	@id:_id. 参数说明：api 索引序号
    const { _id, uid } = params;
*/
export const delBaseMenuList = params =>
  axios({
    url: '/25/bbbd988205.json',
    params,
  });

/**
*   @database: { 接口管理 }
*   @desc:     { 设置用户默认菜单 } 
	以下参数在建立过程中与系统保留字段冲突，已自动替换:
	@id:_id. 参数说明：api 索引序号
    const { menu_id, _id } = params;
*/
export const setSysUser = params =>
  axios({
    url: '/26/0d3c8d84a5.json',
    params,
  });
