export let DEV = true;
export let systemName = '某系统名字';

// 前台资源部署域名，默认头像图片资源调用域名
export let domain = DEV ? '' : 'http://localhost';

// 后台api部署域名
export let host = DEV ?
    "http://localhost:90/api/" :
    "http://10.8.1.25:100/api/";

// 人员信息管理，头像信息上传路径
export let uploadHost = DEV ? "//localhost/upload/" : "//10.8.2.133/upload/";

// 车号/轴号搜索url
export const searchUrl = "http://10.8.2.133/search#";

// 图片信息搜索 Url
export const imgUrl = "http://10.8.2.133/search/image#";