import axios from 'axios';
import * as util from './setting';
import * as X2JS from 'x2js';
import * as R from 'ramda';

const x2js = new X2JS();

let { CUR_COMPANY, config } = util;

// 全局配置rtx xml文件
let rtxUrl = config[CUR_COMPANY].uapUserList;

export const init = async () => {
  let xml = await axios(rtxUrl).then(({ data }) => data);
  let document = x2js.xml2js(xml);
  return Object.values(document)[0].Database.Sys_User.Item;
};

export const getUserDetail = (userList, username) => {
  let curUser = R.find(R.propEq('_Name', username))(userList);
  if (R.isNil(curUser)) {
    return {
      uid: 0,
      username,
      rtxid: 0,
    };
  }
  return {
    uid: curUser._UserName,
    username,
    rtxid: curUser._ID,
  };
};
