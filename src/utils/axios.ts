import http from 'axios';
import qs from 'qs';
import * as setting from './setting';
import { notification } from 'antd';
// import router from 'umi/router';
const router = [];
export let DEV: boolean = setting.DEV;

export let host: string = setting.host;
export let uploadHost: string = setting.uploadHost;

export const codeMessage: {
  [key: number]: string;
} = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

// 判断数据类型，对于FormData使用 typeof 方法会得到 object;
let getType: (data: any) => string = data =>
  Object.prototype.toString
    .call(data)
    .match(/\S+/g)[1]
    .replace(']', '')
    .toLowerCase();

const loadUserInfo = function() {
  // 业务经办人
  let userInfo: {
    name: string;
    uid: string;
    fullname: string;
    org: string;
  } = {
    name: '',
    uid: '',
    fullname: '',
    org: '',
  };
  let user: null | string = window.localStorage.getItem('user');
  // console.log(user);
  if (user == null) {
    return {
      token: '',
    };
  }
  user = JSON.parse(user);
  window.g_axios.token = user.token;
  let extraInfo: string = atob(user.token.split('.')[1]);
  userInfo.uid = JSON.parse(extraInfo).extra.uid;

  return user;
};

// let refreshNoncer = () => {
// 此时可将引用url链接作为 url 参数请求登录，作为强校验；
// 本部分涉及用户名和密码，用户需自行在服务端用curl申请得到token，勿放置在前端;
// let url: string = window.g_axios.host + 'authorize.json?user=admin_username&psw=yourpassword';
// return http.get(url).then(res => res.data.token);
// };

let refreshNoncer =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1NDM4NTI0NDcsIm5iZiI6MTU0Mzg1MjQ0NywiZXhwIjoxNTQzODU5NjQ3LCJ1cmwiOiJodHRwOlwvXC9sb2NhbGhvc3Q6OTBcL3B1YmxpY1wvbG9naW4uaHRtbCIsImV4dHJhIjp7InVpZCI6MSwiaXAiOiIwLjAuMC4wIn19.65tBJTAMZ-i2tkDDpu9DnVaroXera4h2QerH3x2fgTw';
const saveToken = () => {
  window.localStorage.setItem(
    'user',
    JSON.stringify({
      token: window.g_axios.token,
    })
  );
};

// 自动处理token更新，data 序列化等
export let axios = option => {
  if (!window.g_axios) {
    window.g_axios = {
      host,
      token: '',
    };
  }
  // token为空时自动获取
  if (window.g_axios.token === '') {
    let user = loadUserInfo();

    if (typeof user === 'undefined' || user.token === '') {
      // refreshNoncer().then(token => {
      //   window.g_axios.token = token;
      //   saveToken();
      // });
      window.g_axios.token = refreshNoncer;
      saveToken();
    }
  }

  option = Object.assign(option, {
    headers: {
      Authorization: window.g_axios.token,
    },
    method: option.method || 'get',
  });

  return http
    .create({
      baseURL: window.g_axios.host,
      timeout: 10000,
      transformRequest: [
        function(data) {
          let dataType = getType(data);
          switch (dataType) {
            case 'object':
            case 'array':
              data = qs.stringify(data);
              break;
            default:
              break;
          }
          return data;
        },
      ],
    })(option)
    .then(({ data }) => {
      // 刷新token
      if (typeof data.token !== 'undefined') {
        window.g_axios.token = data.token;
        saveToken();
      }
      return data;
    })
    .catch(error => {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        let { data, status } = error.response;
        if (status === 401) {
          // window.g_app._store.dispatch({
          //   type: 'login?autoLogin=0'
          // });
          router.push('/unlogin');
        } else if (status === 403) {
          router.push('/403');
        } else if (status <= 504 && status >= 500) {
          router.push('/500');
        } else if (status >= 404 && status < 422) {
          router.push('/404');
        }
        const errortext = (codeMessage[status] || '') + data.msg;
        notification.error({
          message: `请求错误 ${status}: ${error.config.url}`,
          description: errortext,
          duration: 10,
        });
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
      }
      // console.log(error.config);
      return Promise.reject(error);
    });
};
