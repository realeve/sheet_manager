export let DEV: boolean = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test';
export let systemName: string = '某系统名字';

// 前台资源部署域名，默认头像图片资源调用域名
let domain: string = 'http://localhost';

// 后台api部署域名
let host: string = 'http://10.8.1.25:100/api/';

// 人员信息管理，头像信息上传路径
let uploadHost: string = '//10.8.2.133/upload/';

// if (DEV)  // 上传代码时取消此处的判断
{
  domain = '';
  host = 'http://localhost:90/api/';
  uploadHost = '//localhost:90/public/upload/';
}

export { domain, host, uploadHost };

// 车号/轴号搜索url
export const searchUrl: string = 'http://10.8.2.133/search#';

// 图片信息搜索 Url
export const imgUrl: string = 'http://10.8.2.133/search/image#';

export const lsKeys = {
  border: '_tbl_bordered',
  calSetting: '_tbl_calc_',
};
