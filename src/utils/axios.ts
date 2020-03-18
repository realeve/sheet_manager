import http from 'axios';
import qs from 'qs';
import { host } from './setting';
import { notification } from 'antd';
// import router from 'umi/router';
import router from './router';
import * as R from 'ramda';
export interface GlobalAxios {
  host: string;
  token: string;
}

declare global {
  interface Window {
    g_axios: GlobalAxios;
  }
}

let refreshNoncer =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1NDM4NTI0NDcsIm5iZiI6MTU0Mzg1MjQ0NywiZXhwIjoxNTQzODU5NjQ3LCJ1cmwiOiJodHRwOlwvXC9sb2NhbGhvc3Q6OTBcL3B1YmxpY1wvbG9naW4uaHRtbCIsImV4dHJhIjp7InVpZCI6MSwiaXAiOiIwLjAuMC4wIn19.65tBJTAMZ-i2tkDDpu9DnVaroXera4h2QerH3x2fgTw';

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

export const _commonData = {
  rows: 1,
  data: [{ affected_rows: 1, id: Math.ceil(Math.random() * 100) }],
  time: 20,
  ip: '127.0.0.1',
  title: '数据更新/插入/删除返回值',
};

// 导出数据，随机时长
export type MockFn = <T>(path: T, time?: number) => Promise<T>;
export const mock: MockFn = (path, time = Math.random() * 1000) =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve(path);
    }, time);
  });

export const mockData: <T>(data: T, time?: number) => Promise<T> = (
  data,
  time = Math.random() * 1000
) =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve(data);
    }, time);
  });

// 判断数据类型，对于FormData使用 typeof 方法会得到 object;
// export const getType: (data: any) => string = data => {
//   let type: string = typeof data;
//   if (type === 'undefined') {
//     return 'undefined';
//   }
//   if (data) {
//     type = data.constructor.name;
//   }
//   if (type.toLowerCase() === 'object') {
//     type = Object.prototype.toString
//       .call(data)
//       .slice(8, -1)
//       .toLowerCase();
//   }
//   return type.toLowerCase();
// };

export const getType: (data: any) => string = data => R.type(data).toLowerCase();

export const loadUserInfo = user => {
  if (user == null) {
    window.g_axios.token = refreshNoncer;
    saveToken();
    return {
      token: refreshNoncer,
    };
  }

  user = JSON.parse(user);
  window.g_axios.token = user.token;
  return { token: user.token };

  // let extraInfo: string = atob(user.token.split('.')[1]);
  // userInfo.uid = JSON.parse(extraInfo).extra.uid;
};

// let refreshNoncer = () => {
// 此时可将引用url链接作为 url 参数请求登录，作为强校验；
// 本部分涉及用户名和密码，用户需自行在服务端用curl申请得到token，勿放置在前端;
// let url: string = window.g_axios.host + 'authorize.json?user=admin_username&psw=yourpassword';
// return http.get(url).then(res => res.data.token);
// };

const saveToken = () => {
  window.localStorage.setItem(
    'user',
    JSON.stringify({
      token: window.g_axios.token,
    })
  );
};
export interface AxiosError {
  message: string;
  description: string;
  url: string;
  params: any;
  status?: number;
}
export const handleError = error => {
  let config = error.config || {};
  let str = config.params || config.data || {};
  let { id, nonce, ...params } = typeof str === 'string' ? qs.parse(str) : str;
  Reflect.deleteProperty(params, 'tstart2');
  Reflect.deleteProperty(params, 'tend2');
  Reflect.deleteProperty(params, 'tstart3');
  Reflect.deleteProperty(params, 'tend3');

  if (typeof error.message === 'undefined') {
    // 路由取消
    return;
  }

  config.url += `${id ? id + '/' + nonce : ''}?${qs.stringify(params)}`;
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    let { data, status } = error.response;
    if (status === 401) {
      // window.g_app._store.dispatch({
      //   type: 'login?autoLogin=0'
      // });
      router.push('/unlogin');
    }

    const errortext = (codeMessage[status] || '') + (data.msg || '');
    notification.error({
      message: `请求错误 ${status}: ${config.url}`,
      description: errortext || '',
      duration: 10,
    });
    return Promise.reject({
      status,
      message: `请求错误: ${config.url}`,
      description: `${errortext || ''}`,
      url: error.config.url || '',
      params,
    });
  } else if (error.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    // console.log(error.request);
  }
  return Promise.reject({
    message: '请求错误',
    description: error.message || '',
    url: (config && config.url) || '',
    params,
  });
};

export const handleData = ({ data }) => {
  // 刷新token
  if (typeof data.token !== 'undefined') {
    window.g_axios.token = data.token;
    saveToken();
    // 移除token
    Reflect.deleteProperty(data, 'token');
  }
  return data;
};

export const handleUrl = option => {
  if (option.url && option.url[0] === '.') {
    option.url = window.location.origin + option.url.slice(1);
  }
  return option;
};

// 自动处理token更新，data 序列化等
export let axios = option => {
  window.g_axios = window.g_axios || {
    host,
    token: '',
  };
  // token为空时自动获取
  if (window.g_axios.token === '') {
    let user: null | string = window.localStorage.getItem('user');
    loadUserInfo(user);
  }

  option = handleUrl(option);

  option = Object.assign(option, {
    headers: {
      Authorization: window.g_axios.token,
    },
    method: option.method || 'get',
  });

  return http
    .create({
      baseURL: host,
      timeout: 30 * 1000,
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
    .then(handleData)
    .catch(handleError);
};

export const jsonp = (url, data) => {
  if (!url) throw new Error('url is necessary');
  const callback = 'jsonpCallback';
  //  +
  // Math.random()
  //   .toString()
  //   .substr(9, 18);
  const JSONP = document.createElement('script');
  JSONP.setAttribute('type', 'text/javascript');

  const headEle = document.getElementsByTagName('head')[0];

  let ret = '';
  if (data) {
    if (typeof data === 'string') ret = '&' + data;
    else if (typeof data === 'object') {
      for (let key in data) ret += '&' + key + '=' + encodeURIComponent(data[key]);
    }
    ret += '&_time=' + Date.now();
  }
  JSONP.src = `${url}?callback=${callback}${ret}`;
  return new Promise((resolve, reject) => {
    window[callback] = r => {
      resolve(r);
      headEle.removeChild(JSONP);
      delete window[callback];
    };
    headEle.appendChild(JSONP);
  });
};
