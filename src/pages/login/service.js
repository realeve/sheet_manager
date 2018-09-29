import {
    axios
} from "@/utils/axios";

/**
*   @database: { 接口管理 }
*   @desc:     { 用户登录 } 
    const { uid, psw } = params;
*/
export const getSysUser = async params => await axios({
    url: '/5/209a76b78d.json',
    params,
}).then(res => res);