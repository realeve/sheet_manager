import * as lib from '@/utils/lib';
import * as R from 'ramda';

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
      return str.trim();
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

  let axiosConfig = {
    method: 'post',
    url: getUrl(method),
    data: { ...params, ...extraParam },
  };
  return axiosConfig;
};

// 数据有效性校验
export const onValidate = (value, rule) => {
  if (R.isNil(rule)) {
    return true;
  }
  let pattern = rule;

  if (lib.getType(rule) === 'object') {
    pattern = rule.type;
  }

  // 执行自定义 regExp
  if (pattern.includes('/')) {
    let reg = new RegExp(eval(pattern));
    return reg.test(value);
  }

  let status: boolean = true;
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
    default:
      break;
  }
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
