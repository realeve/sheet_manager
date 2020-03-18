import * as lib from '@/utils/lib';
import * as R from 'ramda';
import qs from 'qs';
import { axios, mockData } from '@/utils/axios';
import { DEV } from '@/utils/setting';
import * as mathjs from 'mathjs';

// 处理数据
export const handler = {
  toUpper(str) {
    return String(str)
      .trim()
      .toUpperCase();
  },
  toLower(str) {
    return String(str)
      .trim()
      .toLowerCase();
  },
  trim(str) {
    let type = lib.getType(str);
    if (type === 'boolean') {
      return Number(str);
    } else if (type === 'string') {
      // return str.trim();
    } else if (type === 'array') {
      return str.join(',');
    }
    return str;
  },
};
// 从配置项中获取url
export let getUrl = obj => {
  if (typeof obj === 'string') {
    return obj;
  }
  return obj.url;
};

// 校验 required
export const validRequire = (requiredFileds, state) => {
  let status: boolean = true;
  requiredFileds.forEach(key => {
    if (R.isNil(state[key])) {
      status = false;
      console.log(key+'校验未通过',requiredFileds)
    }
  });
  return status;
};

export const getPostData = ({ config, params, editMethod, uid }) => {
  let { insert, update } = config.api;

  // 是否新增数据
  let method = editMethod === 'insert' ? insert : update;
  let { param } = method;
  let extraParam: { [key: string]: any } = {};
  if (R.type(param) === 'Array') {
    if (param.includes('uid')) {
      extraParam.uid = uid;
    }
    if (param.includes('rec_time')) {
      extraParam.rec_time = lib.now();
    }
  }
  let url = getUrl(method);
  if (!url) {
    return false;
  }
  let [id, nonce] = url.match(/(\d+)\/(\w+)/g)[0].split('/');
  // 随url自带的固定参数
  let ex = url.includes('?') ? qs.parse(url.split('?')[1]) : {};

  let axiosConfig = {
    method: 'post',
    data: { ...params, ...extraParam, ...ex, id, nonce },
  };
  return axiosConfig;
};

// 数据有效性校验
interface IRule {
  type: string;
  msg?: string;
  calc?: string;
  requires?: boolean;
}
export const onValidate = (value, rule: IRule | string) => {
  if (R.isNil(rule)) {
    return true;
  }
  let pattern: string = typeof rule !== 'string' ? rule.type : rule;

  // 执行自定义 regExp
  if (pattern && pattern.includes('/')) {
    let reg = new RegExp(eval(pattern));
    return reg.test(value);
  }

  let status: boolean = true;

  // 扩展数据校验规则
  switch (pattern) {
    case 'cart':
      status = lib.isCart(value);
      break;
    case 'reel':
      status = lib.isReel(value);
      break;
    case 'gz':
      status = lib.isGZ(value);
      break;
    case 'number':
      status = lib.isNumOrFloat(value);
      break;
    case 'int':
      status = lib.isInt(value);
      break;
    case 'float':
      status = lib.isFloat(value);
      break;
    case 'reel_cart':
      status = lib.rules.reel_cart.test(value);
      break;
    case 'reel_patch':
      status = lib.rules.reel_patch.test(value);
      break;
    case 'pallet':
      status = lib.rules.pallet.test(value);
      break;
    default:
      break;
  }

  if (!status) {
    return status;
  }

  // 处理公式校验逻辑

  return status;
};

// 生成校验提示文字
export const getRuleMsg = (rule, title = '本字段') => {
  if (rule.msg) {
    return rule.msg;
  }
  let msg = title + '验证失败';
  switch (rule.type || rule) {
    case 'cart':
      msg = title + '不是有效的车号';
      break;

    case 'reel':
      msg = title + '不是有效的轴号';
      break;

    case 'gz':
      msg = title + '不是有效的冠字号';
      break;

    case 'int':
    case 'float':
    case 'number':
      msg = title + '不是有效的数字类型';
      break;
    default:
      break;
  }
  return msg;
};

// 处理传入的options选项，适用{name,value}及{id,value}形式
export const handleOptions = (data, textVal: boolean) =>
  data.map(item => {
    // 处理只有字符串数组的情况
    if (lib.getType(item) === 'string') {
      return {
        name: item,
        value: item,
        label: item,
      };
    }

    if (item.name) {
      return { ...item, label: item.name };
    } else {
      return {
        label: item.value,
        name: item.value,
        value: textVal ? item.value : item.id,
      };
    }
  });

/**
 *   @database: { 接口管理 }
 *   @desc:     { api接口最大id }
 */
export const getSysApi = () =>
  DEV
    ? mockData({ data: [{ maxid: 12 }] })
    : axios({
        url: '/6/2b9eaaabc3.json',
      });

/**
// 更新触发器 
DROP TRIGGER IF EXISTS `api_nonce`;
delimiter ;;
CREATE TRIGGER `api_nonce` BEFORE INSERT ON `sys_api` FOR EACH ROW if isnull( new.nonce ) then
	set new.nonce = substring(MD5(RAND()*100),1,10);
end if
;;
delimiter ;
 */

export const getCreate = config => {
  let res = R.compose(
    R.reject(R.propEq('key', 'ignoreIncrese')),
    R.flatten,
    R.map(item => item.detail)
  )(config.detail);

  let keyStrs = res.map(item => {
    let key = item.key;
    if (item.type.includes('date')) {
      return `  [${key}] datetime  DEFAULT (getdate()) NULL`;
    } else if (item.type === 'input.number') {
      // 字段类型
      let filedType = 'int';
      if (item.rule && item.rule.type === 'float') {
        filedType = 'float(53)';
      }
      return `  [${key}] ${filedType} DEFAULT ((0)) NULL`;
    }
    return `  [${key}] nchar(40) DEFAULT ''`;
  });

  let param = config.api.insert.param || [];
  let appendSql = '';
  if (param.includes('rec_time')) {
    appendSql += '[rec_time] datetime DEFAULT (getdate()) NULL,';
  }
  if (param.includes('uid')) {
    appendSql += '[uid] int NULL,';
  }

  // 建表SQL
  let createSql = `CREATE TABLE tbl_${config.table} (
  [id] int  IDENTITY(1,1) NOT NULL,
  ${appendSql}
  ${keyStrs.join(',\r\n')}
) ;`;

  let getDescByField = (field, title) => `
EXEC sp_addextendedproperty
'MS_Description', N'${title}',
'SCHEMA', N'dbo',
'TABLE', N'tbl_${config.table}',
'COLUMN', N'${field}';`;

  // 添加注释
  let desc = `
EXEC sp_addextendedproperty
'MS_Description', N'${config.name}',
'SCHEMA', N'dbo',
'TABLE', N'tbl_${config.table}';
${getDescByField('id', '主ID')}`;

  if (param.includes('rec_time')) {
    desc += getDescByField('rec_time', '记录时间');
  }
  if (param.includes['uid']) {
    desc += getDescByField('uid', '用户Uid');
  }
  res.forEach(item => {
    desc += getDescByField(item.key, item.title);
  });

  // 添加注释完毕

  return createSql + desc;
};

export const getApi = (config, nonce) => {
  let res = R.compose(
    R.reject(R.propEq('key', 'ignoreIncrese')),
    R.flatten,
    R.map(item => item.detail)
  )(config.detail);

  let keyStrs = res.map(item => item.key);

  let param = {
    insert: config.api.insert.param || [],
  };

  if (config.api.delete) {
    param.delete = config.api.delete.param || [];
  }
  if (config.api.update) {
    param.update = config.api.update.param || [];
  }
  if (config.api.query) {
    param.query = config.api.query.param || [];
  }

  let condition = key => ({
    where:
      param[key] && param[key].length > 0
        ? ' where ' + param[key].map(name => ` ${name}=? `).join(' and ')
        : '',
    param: (param[key] || []).join(','),
  });

  let query = `
  -- 数据载入接口
INSERT INTO sys_api ( nonce, db_id, uid, api_name, sqlstr, param,remark )
VALUES
  ( '${nonce}','2','1','${config.name}_载入','select  ${keyStrs.join(',')} from  tbl_${
    config.table
  }  ${condition('query').where}', '${condition('query').param}','' );`;

  let del = `
-- 数据接口删除
INSERT INTO sys_api ( nonce, db_id, uid, api_name, sqlstr, param,remark )
VALUES
  ( '${nonce}','2','1','${config.name}_删除','delete from  tbl_${config.table}  ${
    condition('delete').where
  }','${condition('delete').param}','' );`;

  // 先过滤条件字段
  let editKeys = keyStrs.filter(item => !(param.update || []).includes(item));
  let editStr = editKeys.map(key => `${key}=?`).join(',');
  let paramUpdate = [...editKeys, ...(param.update || [])];

  let edit = `
-- 数据更新接口
INSERT INTO sys_api ( nonce,db_id, uid, api_name, sqlstr, param,remark )
VALUES
  ( '${nonce}','2','1','${config.name}_更新','update tbl_${config.table} set ${editStr} ${
    condition('update').where
  }','${paramUpdate.join(',')}','' );`;

  // 先过滤条件字段
  let addKeys = [...keyStrs, ...(param.insert || [])];

  let addStr = addKeys.map(key => `?`).join(',');

  let add = `-- 数据增加接口
INSERT INTO sys_api ( nonce,db_id, uid, api_name, sqlstr, param ,remark)
VALUES
  ( '${nonce}','2','1','${config.name}_添加','insert into  tbl_${config.table}(${addKeys.join(
    ','
  )}) values(${addStr})','${addKeys.join(',')}','' );`;

  let review = `
-- 查询最近录入的数据
INSERT INTO sys_api ( nonce,db_id, uid, api_name, sqlstr,remark )
VALUES
  ( '${nonce}','2','1','${config.name} 近期录入信息','SELECT top 50 * FROM view_${config.table} ORDER BY 录入时间 desc','' );`;

  const load = `
  -- 历史数据载入功能
  INSERT INTO sys_api ( nonce,db_id, uid, api_name, sqlstr,param,remark )
  VALUES
    ( '${nonce}','2','1','${config.name} 载入历史数据','SELECT ${keyStrs.join(',')}  FROM tbl_${
    config.table
  } where id = ?','_id','' );`;

  return [add, del, edit, query, review, load].join('\r\n');
};

/**
 *
 * @param api 初始配置，主要是其中的param配置参数信息
 * @param nonce 该组api的nonce信息，向API管理后台数据库写入nonce参数后，数据库端不再自动生成，以此处传入的为准。
 */
export const getApiConfig = async (formConfig, nonce) => {
  let keys = ['insert', 'delete', 'update', 'query', 'table', 'load'];
  let res = {};

  let { maxid } = await getSysApi().then(res => res.data[0]);
  maxid = parseInt(maxid);
  keys.forEach((key, idx) => {
    res[key] = {
      url: `${idx + maxid}/${nonce}`,
    };
    if (formConfig.api[key] && formConfig.api[key].param) {
      res[key].param = R.clone(formConfig.api[key].param || []);
    } else if (key === 'load') {
      res[key].param = ['_id'];
    }
  });
  formConfig.api = res;
  return formConfig;
};

export const beforeSheetRender = ({ columns, ...config }) => {
  let colConfig = R.clone(columns);
  let idx = R.findIndex(R.propEq('title', 'id'))(colConfig);
  if (idx < 0) {
    return { columns, ...config };
  }
  let item = R.nth(idx, colConfig);
  let { hash } = window.location;
  let param = qs.parse(hash.slice(1));
  let id = param.id;

  item.renderer = (hotInstance, TD, row, col, prop, _id) => {
    TD.innerHTML = _id
      ? `<a href="#id=${id}&_id=${_id}"  style="text-decoration:none;margin:3px;" class="ant-btn ant-btn-primary"> 载入 </a>`
      : '';
  };
  item.title = '操作';
  // console.log(item);
  colConfig = R.update(idx, item)(colConfig);
  return { columns: colConfig, ...config };
};

export type tIncrease = 'reel_cart' | 'box_no' | 'pallet' | 'number'; // 车号-箱号-拍号-普通数字

const nextChar: (char: string, idx: number) => string = (char, idx = 0) =>
  String.fromCharCode(char.charCodeAt(idx) + 1);
/**
 * 处理纸张各类号码自增逻辑
 * @param type 处理类型
 * @param str 待处理字符串
 * @return string 处理结果
 */
export const getIncrease: (type: tIncrease, val) => string = (type, str) => {
  // 空字符串不处理
  if (String(str).trim().length === 0) {
    return str;
  }
  switch (type) {
    case 'reel_cart':
      str = str.toUpperCase();
      // 前四位数字不变
      let strHead = str.substr(0, 4);

      // 尾部字母
      let strTail = str.substr(-1);

      //车号后三位
      let cardNo = strTail === 'A' ? str.substr(5, 3) : (parseInt(str.substr(5, 3)) + 1) % 1000;

      //字母处理
      let alpha = '999B' === str.substr(-4) ? nextChar(str, 4) : str.substr(4, 1);

      // 数字进1
      let num = String(cardNo).padStart(3, '0');
      let tail = {
        A: 'B',
        B: 'A',
      };
      return strHead + alpha + num + tail[strTail];
    case 'box_no':
      // 6位箱号，自动加1
      return String(parseInt(str) + 1).padStart(6, '0');
    case 'pallet':
      let strPallet = str.substr(8);
      let strEnd = String(parseInt(strPallet) + 1).padStart(5, '0');
      return str.substr(0, 8) + strEnd;
    case 'number':
      return parseInt(str) + 1;
  }
};

/**
 * 处理需要四则运算及复杂运算的场景
 * @param state 当前数据state
 * @param fields 字段名
 * @param config 原始配置
 */
export let validCalcKeys = (state, fields, config, setCalcValid) => {
  if (fields.length === 0) {
    return false;
  }

  let cfg = R.flatten(R.map(R.prop('detail'))(config.detail));
  let _state = R.clone(state);

  let status = true;
  let len = fields.length,
    i = 0;
  while (status && i < len) {
    // 字段 key,计算规则
    let { key, calc } = fields[i];

    // 当前数据未填写时不校验;
    if ('undefined' === typeof _state[key] || String(_state[key]).length === 0) {
      break;
    }

    // 处理calc字段,先移除空格,如果双等号不存在，将等于替换为双等号;
    if (!calc.includes('==')) {
      calc = calc.replace(/=/, '==');
    }

    cfg.forEach(item => {
      let reg = new RegExp(item.title, 'g');
      calc = calc.replace(reg, item.key);

      if (calc.includes(item.key)) {
        // 未录入视为0
        if ('undefined' === typeof _state[item.key] || !lib.isNumOrFloat(_state[item.key])) {
          _state[item.key] = item.defaultValue || 0;
        }
      }
    });
    // console.log(calc, _state);

    status = mathjs.evaluate(calc, _state);
    setCalcValid({
      key,
      status,
    });
    i++;
  }

  return status;
};
