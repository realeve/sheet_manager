export let DEV: boolean = false; // process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test';

// 前台资源部署域名，默认头像图片资源调用域名
export let config = {
  chengdu: {
    api: 'http://cdn.cdyc.cbpm:100',
    footer: '成都印钞有限公司 印钞管理部',
    systemName: '质量信息管理平台',
    uploadHost: 'http://cdn.cdyc.cbpm:100/upload/',
    host: 'http://10.8.2.133:8000',
    org: 'CDYC',
    uap: {
      active: true && !DEV, // 使用代理身份认证登录
      rtx: 'http://10.8.1.25:100/rtx/rtx_CDYC.xml',
      // login: 'http://10.8.1.27:4040/api/login',
      // dept: 'http://localhost:3030/api/depts',
      // user: 'http://localhost:3030/api/users',
      login: 'http://10.8.1.27:4040/api/login', // 登录URL
      dept: 'http://10.8.1.27:4040/api/depts', // 部门列表
      user: 'http://10.8.1.27:4040/api/users', //用户列表
    },
  },
  kunshan: {
    api: 'http://10.56.37.153:100/',
    host: 'http://10.56.37.153',
    footer: '昆山钞票纸业有限公司 企划信息部',
    systemName: '通用报表管理系统',
    uploadHost: 'http://10.56.37.153:100/upload/',
    org: 'KSCZ',
    uap: {
      active: true && !DEV, // 使用代理身份认证登录
      login: 'http://10.8.1.27:4040/api/login', // 登录URL
      dept: 'http://10.8.1.27:4040/api/depts', // 部门列表
      user: 'http://10.8.1.27:4040/api/users', //用户列表
    },
  },
};

// export const CUR_COMPANY = 'kunshan';

export const CUR_COMPANY = 'chengdu';

let defaultTitle = window.localStorage.getItem('_userMenuTitle');

export let systemName = defaultTitle || config[CUR_COMPANY].systemName;

export let AUTHOR = config[CUR_COMPANY].footer;

export let ORG = config[CUR_COMPANY].org;
export let uap = config[CUR_COMPANY].uap;

let domain: string = config[CUR_COMPANY].api;
// 后台api部署域名
let host = domain;

// 人员信息管理，头像信息上传路径
let uploadHost: string = config[CUR_COMPANY].uploadHost;

if (DEV) {
  // 上传代码时取消此处的判断
  domain = '';
  host = 'http://localhost:90/api/';
  uploadHost = '//localhost:90/public/upload/';
}

export { domain, host, uploadHost };

// 车号/轴号搜索url
export const searchUrl: string = config[CUR_COMPANY].host + '/search#';

// 图片信息搜索 Url
export const imgUrl: string = config[CUR_COMPANY].host + '/search/image#';

export const lsKeys = {
  border: '_tbl_bordered',
  calSetting: '_tbl_calc_',
};
