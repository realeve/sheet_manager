import React, { useState, useEffect } from 'react';
import { useSetState } from 'react-use';
import { axios } from '@/utils/axios';
import {
  notification,
  Card,
  Input,
  Row,
  Col,
  Button,
  Switch,
  Radio,
  InputNumber,
  DatePicker,
} from 'antd';
import styles from './index.less';
import * as R from 'ramda';
import { connect } from 'dva';
import PinyinSelector from '../PinyinSelector';
import { formatMessage } from 'umi/locale';
import * as lib from '@/utils/lib';
import moment from 'moment';
import 'moment/locale/zh-cn';
import classNames from 'classnames/bind';
moment.locale('zh-cn');
const cx = classNames.bind(styles);

const { TextArea } = Input;

const handler = {
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

function FormCreater({ uid, config }) {
  let [state, setState] = useSetState();
  let [formType, setFormType] = useState('new');
  let [validateState, setValidateState] = useSetState();

  // 初始化空数据，获取必填字段
  let [fields, setFields] = useState({});
  let [requiredFileds, setRequiredFileds] = useState([]);
  useEffect(() => {
    let requiredFileds = [];
    let fields = {};
    config.detail.forEach(({ detail }) => {
      detail.forEach(item => {
        if (item.rule && item.rule.required) {
          requiredFileds.push(item.key);
        }
        fields[item.key] = '';
        // 如果有日期选择组件，记录初始化数据
        if (item.type === 'datepicker') {
          setState({ [item.key]: moment().format(item.datetype || 'YYYY-MM-DD') });
        }
        setValidateState({ [item.key]: true });
      });
    });

    setFields(fields);
    setRequiredFileds(requiredFileds);
  }, [config]);

  const [formstatus, setFormstatus] = useState(false);
  useEffect(() => {
    // 必填字段状态校验
    let required = validRequire();
    setFormstatus(formstatus && required);
  }, [state]);

  // 设置表单初始数据
  const setFormData = data => {
    setState(data);
  };

  // 获取初始数据
  const getFormData = () => {
    return {
      ...fields,
      ...state,
    };
  };

  // 从配置项中获取url
  let getUrl = obj => {
    if (typeof obj === 'string') {
      return obj;
    }
    return obj.url;
  };

  // 校验 required
  const validRequire = () => {
    let status: boolean = true;
    requiredFileds.forEach(key => {
      if (R.isNil(state[key])) {
        status = false;
      }
    });
    return status;
  };

  // 提交数据
  const onsubmit = async () => {
    // 必填数据是否填写
    let status = validRequire();
    if (!status) {
      notification.error({
        message: '系统提示',
        description: '必填字段校验失败',
      });
    }

    let params = getFormData();
    let { insert, update } = config;

    // 是否新增数据
    let isAdd = formType === 'new';

    let method = isAdd ? insert : update;
    let { extra } = method;
    let extraParam: { [key: string]: any } = {};
    if (R.type(extra) === 'Object') {
      if (extra.uid) {
        extraParam.uid = uid;
      }
      if (extra.rec_time) {
        extraParam.rec_time = lib.now();
      }
    }

    let axiosConfig = {
      method: 'post',
      url: getUrl(method),
      data: { ...params, ...extraParam },
    };
    console.log(axiosConfig);
    return;
    let {
      data: [{ affected_rows }],
    } = await axios(axiosConfig);
    notity(affected_rows);
  };

  const notity = affected_rows => {
    if (affected_rows == 0) {
      notification.error({
        message: '系统提示',
        description: '提交失败.',
      });
    }
    notification.success({
      message: '系统提示',
      description: '提交成功.',
    });
  };

  // 索引字段(通过校验后)改变时，如车号等，载入初始数据用于更新
  const loadHistoryData = async () => {
    let { uniqKey, query: url } = config;
    let formData = getFormData();
    let params = R.pick(uniqKey, formData);

    let {
      data: [initData],
    } = await axios({ url, params });
    setFormData(initData);
  };

  // 根据索引字段删除数据，建议用一个字段作为索引
  const onDelete = async () => {
    let { uniqKey, delete: url } = config;
    let formData = getFormData();
    let params = R.pick(uniqKey, formData);

    let {
      data: [affected_rows],
    } = await axios({ url, params });
    notity(affected_rows);
  };

  // 数据有效性校验
  const onValidate = (value, rule) => {
    if (R.isNil(rule)) {
      return true;
    }
    let pattern = rule;
    let status: boolean = true;

    if (lib.getType(rule) === 'object') {
      pattern = rule.type;
    }

    // 执行自定义 regExp
    if (pattern.includes('/')) {
      let reg = new RegExp(eval(rule));
      status = reg.test(value);
    }

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

  const onChange = (val: any, key: string, props: { [key: string]: any } = {}) => {
    let value = handler.trim(val);
    let { toupper, tolower, rule } = props;
    if (toupper) {
      value = handler.toUpper(val);
    } else if (tolower) {
      value = handler.toLower(val);
    }
    setState({ [key]: value });

    // 录入状态判断
    let status = onValidate(value, rule);
    setValidateState({ [key]: status });
    setFormstatus(status);
  };

  const onReset = () => {
    setState(fields);
  };

  // 生成校验提示文字
  const getRuleMsg = (rule, title) => {
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

  return (
    <div className={styles.form}>
      {config.detail.map(({ title: mainTitle, detail }, idx) => (
        <Card title={`${idx + 1}.${mainTitle}`} style={{ marginBottom: 20 }} key={mainTitle}>
          <Row gutter={15}>
            {detail.map(({ title, key, type, block, ...props }) => (
              <Col span={8} md={8} sm={12} xs={24} className={styles['form-item']} key={key}>
                <span
                  className={cx('title', {
                    required: props.rule && props.rule.required,
                  })}
                >
                  {title}
                </span>
                <div className={cx({ 'has-error': !validateState[key] }, 'element')}>
                  {type === 'input' && (
                    <Input
                      style={{ width: 180 }}
                      value={state[key]}
                      onChange={e => onChange(e.target.value, key, props)}
                      {...props}
                    />
                  )}
                  {type === 'input.textarea' && (
                    <TextArea
                      style={{ maxWidth: 300 }}
                      autosize={{ minRows: 1, maxRows: 3 }}
                      value={state[key]}
                      onChange={e => onChange(e.target.value, key, props)}
                      {...props}
                    />
                  )}
                  {type === 'input.number' && (
                    <InputNumber
                      min={props.min}
                      max={props.max}
                      style={{ width: 180 }}
                      value={state[key]}
                      onChange={value => onChange(value, key, props)}
                      {...props}
                    />
                  )}
                  {type === 'datepicker' && (
                    <DatePicker
                      value={moment(state[key] || moment(), props.datetype || 'YYYY-MM-DD')}
                      onChange={(_, value) => onChange(value, key)}
                      {...props}
                    />
                  )}
                  {type === 'select' && (
                    <PinyinSelector
                      url={props.url}
                      value={state[key] ? state[key].split(',') : []}
                      onChange={value => onChange(value, key)}
                      {...props}
                    />
                  )}
                  {type === 'switch' && (
                    <Switch
                      defaultChecked
                      checked={Boolean(state[key])}
                      {...props}
                      onChange={value => onChange(value, key)}
                    />
                  )}

                  {!validateState[key] && props.rule ? (
                    <label className="ant-form-explain">{getRuleMsg(props.rule, title)}</label>
                  ) : (
                    block && <label className="ant-form-explain">{block}</label>
                  )}
                </div>
              </Col>
            ))}
            {idx === config.detail.length - 1 && (
              <Col span={24} className={styles.submit}>
                <Button type="default" onClick={onReset} disabled={!formstatus}>
                  {formatMessage({ id: 'form.reset' })}
                </Button>
                <Button
                  type="primary"
                  onClick={onsubmit}
                  disabled={!formstatus}
                  style={{ marginLeft: 20 }}
                >
                  {formatMessage({ id: 'form.submit' })}
                </Button>
              </Col>
            )}
          </Row>
        </Card>
      ))}
    </div>
  );
}

export default connect(({ common: { userSetting } }) => ({
  uid: userSetting.uid,
}))(FormCreater);
