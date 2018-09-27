import {
    axios
} from "../../utils/axios";

const R = require("ramda");

export const getMenuSettingByIdx = async idx => {
    return [{
            title: "Chicken",
            id: 23,
            children: [{
                    title: "Egg",
                    id: 24
                },
                {
                    title: "Test",
                    id: 25
                }
            ]
        },
        {
            title: "Test2",
            id: 26,
            children: [{
                    title: "Egg",
                    id: 24
                },
                {
                    title: "Test",
                    id: 25
                }
            ]
        }
    ]
}

/**
*   @database: { 接口管理 }
*   @desc:     { 插入菜单项 } 
    const { icon, title, url, pinyin, pinyin_full } = params;
*/
export const addBaseMenuItem = async params => await axios({
    url: '/18/2b9eaaab97.json',
    params,
}).then(res => res);

/**
*   @database: { 接口管理 }
*   @desc:     { 更新菜单项 } 
	以下参数在建立过程中与系统保留字段冲突，已自动替换:
	@id:_id. 参数说明：api 索引序号
    const { icon, title, url, pinyin, pinyin_full, _id } = params;
*/
export const setBaseMenuItem = async params => await axios({
    url: '/19/5fc349508c.json',
    params,
}).then(res => res);

/**
 *   @database: { 接口管理 }
 *   @desc:     { 查询菜单项 } 
 */
export const getBaseMenuItem = async() => await axios({
    url: '/20/b5fa4e6e6e.json'
}).then(res => res);

/**
*   @database: { 接口管理 }
*   @desc:     { 删除菜单 } 
	以下参数在建立过程中与系统保留字段冲突，已自动替换:
	@id:_id. 参数说明：api 索引序号
      */
export const delBaseMenuItem = async _id => await axios({
    url: '/21/548039aa24.json',
    params: {
        _id
    },
}).then(res => res);