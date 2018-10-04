const _lsKey = "_userSetting";
const _menu = "_userMenu";
const R = require('ramda');
const CryptoJS = require("crypto-js");
const salt = btoa(encodeURI("8f5661a0527b538ea5b2566c9da779f4"));

const encodeStr = values => CryptoJS.AES.encrypt(JSON.stringify(values), salt)

const decodeStr = ciphertext => {
    // Decrypt
    const bytes = CryptoJS.AES.decrypt(ciphertext.toString(), salt);
    const plainText = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(plainText);
}

const saveUserSetting = data => {
    let values = R.clone(data)
    let {
        menu
    } = values.setting;
    Reflect.deleteProperty(values.setting, 'previewMenu');
    Reflect.deleteProperty(values.setting, 'menu');
    window.localStorage.setItem(_lsKey, encodeStr(values));
    window.localStorage.setItem(_menu, JSON.stringify(menu));
};

const getUserSetting = () => {
    let _userSetting = window.localStorage.getItem(_lsKey);
    if (_userSetting == null) {
        return {
            success: false
        };
    }

    let menu = window.localStorage.getItem(_menu);
    let data = decodeStr(_userSetting);
    data.setting = Object.assign(data.setting, {
        menu: JSON.parse(menu),
        previewMenu: []
    })
    return {
        data,
        success: true
    };
};

const clearUserSetting = () => {
    window.localStorage.removeItem(_lsKey);
};

const saveLastRouter = pathname => {
    window.localStorage.setItem('_lastRouter', pathname)
}

const readLastRouter = () => {
    let router = window.localStorage.getItem('_lastRouter');
    return router == null || router === '/' ? '/menu' : router;
}

export default {
    saveUserSetting,
    getUserSetting,
    clearUserSetting,
    saveLastRouter,
    readLastRouter
}