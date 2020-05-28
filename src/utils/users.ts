import { systemName, DEFAULT_MENU_ID } from '@/utils/setting';
import JSEncrypt from 'jsencrypt';
import * as R from 'ramda';
const { default: priv_key } = require('./rsa/rsa_1024_priv.js');
const { default: pub_key } = require('./rsa/rsa_1024_pub.js');
const _lsKey: string = '_userSetting';
const _menu: string = '_userMenu';
const _menuId: string = '_userMenuId';
const _login: string = '_islogin';
const _menuTitle: string = '_userMenuTitle';
const CryptoJS = require('crypto-js');

const salt: string = btoa(encodeURI('8f5661a0527b538ea5b2566c9da779f4'));

/*RS
openssl genrsa -out rsa_1024_priv.pem 1024
openssl rsa -pubout -in rsa_1024_priv.pem -out rsa_1024_pub.pem
*/

const encodeRSA = values => {
  const crypt = new JSEncrypt();
  crypt.setPrivateKey(priv_key);
  return crypt.encrypt(values);
};

const decodeRSA = (ciphertext: string) => {
  const crypt = new JSEncrypt();
  crypt.setPublicKey(pub_key);
  crypt.setPrivateKey(priv_key);
  return crypt.decrypt(ciphertext);
};

const encodeStr = values => CryptoJS.AES.encrypt(JSON.stringify(values), salt);

const decodeStr = (ciphertext: string) => {
  // Decrypt
  const bytes = CryptoJS.AES.decrypt(ciphertext.toString(), salt);
  const plainText: string = bytes.toString(CryptoJS.enc.Utf8);
  return JSON.parse(plainText);
};

const saveUserSetting = (
  data,
  menuTitle = systemName,
  menu_id: string | number = DEFAULT_MENU_ID
) => {
  let obj = R.clone(data);
  let { menu } = obj.setting;
  // console.log(data, '_menuTitle');
  Reflect.deleteProperty(obj.setting, 'previewMenu');
  Reflect.deleteProperty(obj.setting, 'menu');
  let { username, password } = obj.values;
  if (username.length <= 20) {
    username = encodeRSA(username);
    password = encodeRSA(password);
  }
  obj.values = Object.assign(obj.values, { username, password });

  window.localStorage.setItem(_lsKey, encodeStr(obj));
  window.localStorage.setItem(_menu, JSON.stringify(menu));

  // console.log(menu_id);
  window.localStorage.setItem(_menuId, String(menu_id));

  window.localStorage.setItem(_menuTitle, menuTitle);
};

const getUserSetting = () => {
  let _userSetting = window.localStorage.getItem(_lsKey);
  if (_userSetting == null) {
    return {
      success: false,
    };
  }

  let menu_title = window.localStorage.getItem(_menuTitle);

  let menu: string = window.localStorage.getItem(_menu);

  let data = decodeStr(_userSetting);
  data.setting = Object.assign(data.setting, {
    menu: JSON.parse(menu),
    previewMenu: [],
    menu_title,
  });

  let { username, password } = data.values;
  if (username.length > 20) {
    username = decodeRSA(username);
    password = decodeRSA(password);
    data.values = Object.assign(data.values, { username, password });
  }
  return {
    data,
    success: true,
  };
};

const clearUserSetting = () => {
  window.localStorage.removeItem(_lsKey);
};

const saveLastRouter = (pathname: string) => {
  window.localStorage.setItem('_lastRouter', pathname);
};

const readLastRouter = () => {
  let router = window.localStorage.getItem('_lastRouter');
  return router || '/'; // == null || router === '/' ? '/menu' : router;
};

const saveLoginStatus = (status: number | string = 1) => {
  console.log('_islogin', status);
  window.localStorage.setItem(_login, String(status));
};

const getLoginStatus: () => string | number = () => {
  return window.localStorage.getItem(_login) || 0;
};

export default {
  saveUserSetting,
  getUserSetting,
  clearUserSetting,
  saveLastRouter,
  readLastRouter,
  saveLoginStatus,
  getLoginStatus,
};
