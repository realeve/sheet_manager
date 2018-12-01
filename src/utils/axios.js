import http from 'axios';
import qs from 'qs';
import * as setting from './setting';
import { notification } from 'antd';
import { codeMessage } from './request';

export let DEV = setting.DEV;

export let host = setting.host;
export let uploadHost = setting.uploadHost;

// 判断数据类型，对于FormData使用 typeof 方法会得到 object;
let getType = (data) =>
  Object.prototype.toString
    .call(data)
    .match(/\S+/g)[1]
    .replace(']', '')
    .toLowerCase();

const loadUserInfo = function() {
  // 业务经办人
  let userInfo = {
    name: '',
    uid: '',
    fullname: '',
    org: ''
  };
  let user = window.localStorage.getItem('user');
  if (user == null) {
    return {
      token: ''
    };
  }
  user = JSON.parse(user);
  window.g_axios.token = user.token;
  let extraInfo = atob(user.token.split('.')[1]);
  userInfo.uid = JSON.parse(extraInfo).extra.uid;

  return user;
};

let refreshNoncer = async () => {
  // 此时可将引用url链接作为 url 参数请求登录，作为强校验；
  // 本部分涉及用户名和密码，用户需自行在服务端用curl申请得到token，勿放置在前端;
  let url = window.g_axios.host + 'authorize.json?user=develop&psw=111111';
  return await http.get(url).then((res) => res.data.token);
};

const saveToken = () => {
  window.localStorage.setItem(
    'user',
    JSON.stringify({
      token: window.g_axios.token
    })
  );
};

// 自动处理token更新，data 序列化等
export let axios = async (option) => {
  if (!window.g_axios) {
    window.g_axios = {
      host,
      token: ''
    };
  }
  // token为空时自动获取
  if (window.g_axios.token === '') {
    let user = loadUserInfo();

    if (typeof user === 'undefined' || user.token === '') {
      window.g_axios.token = await refreshNoncer();
      saveToken();
    }
  }

  option = Object.assign(option, {
    headers: {
      Authorization: window.g_axios.token
    },
    method: option.method ? option.method : 'get'
  });

  return await http
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
        }
      ]
    })(option)
    .then(({ data }) => {
      // 刷新token
      if (typeof data.token !== 'undefined') {
        window.g_axios.token = data.token;
        saveToken();
      }
      return data;
    })
    .catch((error) => {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);

        const errortext =
          codeMessage[error.response.status] ||
          JSON.stringify(error.response.data);
        notification.error({
          message: `请求错误 ${error.response.status}: ${error.config.url}`,
          description: errortext
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
      console.log(error.config);
      return Promise.reject(error);
    });
};
