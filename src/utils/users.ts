import { systemName } from '@/utils/setting';

const _lsKey: string = '_userSetting';
const _menu: string = '_userMenu';
const _login: string = '_islogin';
const _menuTitle: string = '_userMenuTitle';

const R = require('ramda');
const CryptoJS = require('crypto-js');
const salt: string = btoa(encodeURI('8f5661a0527b538ea5b2566c9da779f4'));

const encodeStr = values => CryptoJS.AES.encrypt(JSON.stringify(values), salt);

const decodeStr = (ciphertext: string) => {
  // Decrypt
  const bytes = CryptoJS.AES.decrypt(ciphertext.toString(), salt);
  const plainText: string = bytes.toString(CryptoJS.enc.Utf8);
  return JSON.parse(plainText);
};

const saveUserSetting = (data, menuTitle = systemName) => {
  let values = R.clone(data);
  let { menu } = values.setting;
  console.log(data, '_menuTitle');
  Reflect.deleteProperty(values.setting, 'previewMenu');
  Reflect.deleteProperty(values.setting, 'menu');
  window.localStorage.setItem(_lsKey, encodeStr(values));
  window.localStorage.setItem(_menu, JSON.stringify(menu));
  window.localStorage.setItem(_menuTitle, menuTitle);
};

const getUserSetting = () => {
  let _userSetting = window.localStorage.getItem(_lsKey);
  if (_userSetting == null) {
    return {
      success: false,
    };
  }

  let menu: string = window.localStorage.getItem(_menu);
  let data = decodeStr(_userSetting);
  data.setting = Object.assign(data.setting, {
    menu: JSON.parse(menu),
    previewMenu: [],
  });
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
  return router == null || router === '/' ? '/menu' : router;
};

const saveLoginStatus = (status: number | string = 1) => {
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
