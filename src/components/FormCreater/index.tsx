import React, { useState, useEffect } from 'react';
import { useSetState } from 'react-use';
import { connect } from 'dva';
import {
  notification,
  Card,
  Input,
  Row,
  Col,
  Button,
  Switch,
  InputNumber,
  DatePicker,
  Rate,
} from 'antd';
import styles from './index.less';
import classNames from 'classnames/bind';
import PinyinSelector from './PinyinSelector';
import RadioSelector from './RadioSelector';
import RadioButton from './RadioButton';
import CheckSelector from './CheckSelector';
import { axios } from '@/utils/axios';
import { handler, validRequire, getPostData, onValidate, getRuleMsg } from './lib';
import { formatMessage } from 'umi/locale';
import * as R from 'ramda';
import moment from 'moment';
import 'moment/locale/zh-cn';
const cx = classNames.bind(styles);
const { TextArea } = Input;

moment.locale('zh-cn');

function FormCreater({ uid, config, dispatch }) {
  let [state, setState] = useSetState();
  let [editMethod, setEditMethod] = useState('insert');
  let [validateState, setValidateState] = useSetState();

  // 初始化空数据，获取必填字段
  let [fields, setFields] = useState({});
  let [requiredFileds, setRequiredFileds] = useState([]);

  // config改变后初始化表单数据
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
    dispatch({
      type: 'common/setStore',
      payload: {
        curPageName: config.name,
      },
    });
  }, [config]);

  // 表单字段当前状态判断
  const [formstatus, setFormstatus] = useState(false);
  useEffect(() => {
    // 必填字段状态校验
    let required = validRequire(requiredFileds, state);
    let validStatus = Object.values(validateState).filter(item => !item).length == 0;
    setFormstatus(validStatus && required);
  }, [state]);

  // 当前数据提交状态，提交时禁止重复提交
  const [submitting, setSubmitting] = useState(false);

  const formInstance = {
    set(data) {
      // 设置表单初始数据
      setState(data);
    },
    get() {
      // 获取初始数据
      return {
        ...fields,
        ...state,
      };
    },
    reset() {
      setState(fields);
    },
  };

  // 提交数据
  const onsubmit = async () => {
    if (submitting) {
      return;
    }
    // 必填数据是否填写
    let status = validRequire(requiredFileds, state);
    if (!status) {
      notification.error({
        message: '系统提示',
        description: '必填字段校验失败',
      });
    }

    let params = formInstance.get();
    let axiosConfig = getPostData({ config, params, editMethod, uid });
    console.log(axiosConfig);
    return;
    setSubmitting(true);
    let {
      data: [{ affected_rows }],
    } = await axios(axiosConfig);
    setSubmitting(false);
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
    let formData = formInstance.get();
    let params = R.pick(uniqKey, formData);

    let {
      data: [initData],
    } = await axios({ url, params });
    formInstance.set(initData);
  };

  // 根据索引字段删除数据，建议用一个字段作为索引
  const onDelete = async () => {
    let { uniqKey, delete: url } = config;
    let formData = formInstance.get();
    let params = R.pick(uniqKey, formData);

    let {
      data: [affected_rows],
    } = await axios({ url, params });
    notity(affected_rows);
  };

  const onChange = (val: any, key: string, props: { [key: string]: any } = {}) => {
    console.log(key, val);
    let value = handler.trim(val);
    let { toupper, tolower, rule } = props;
    if (toupper) {
      value = handler.toUpper(val);
    } else if (tolower) {
      value = handler.toLower(val);
    }
    setState({ [key]: value });
    console.log(value);
    // 录入状态判断
    let status = onValidate(value, rule);
    setValidateState({ [key]: status });
    setFormstatus(status);
  };

  const onReset = () => {
    formInstance.reset();
  };

  return (
    <div className={styles.form}>
      {config.detail.map(({ title: mainTitle, detail }, idx) => (
        <Card title={`${idx + 1}.${mainTitle}`} style={{ marginBottom: 20 }} key={mainTitle}>
          <Row gutter={15}>
            {detail.map(({ title, key, type, block, defaultOption, ...props }) => (
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
                      value={
                        props.mode === 'multiple'
                          ? state[key]
                            ? state[key].split(',')
                            : []
                          : state[key]
                      }
                      onChange={value => onChange(value, key)}
                      defaultOption={defaultOption}
                      {...props}
                    />
                  )}
                  {type === 'switch' && (
                    <Switch
                      defaultChecked
                      checked={Boolean(state[key])}
                      onChange={value => onChange(value, key)}
                      {...props}
                    />
                  )}
                  {type === 'radio.button' && (
                    <RadioButton
                      value={state[key]}
                      url={props.url}
                      onChange={e => onChange(e.target.value, key)}
                      defaultOption={defaultOption}
                      {...props}
                    />
                  )}
                  {type === 'radio' && (
                    <RadioSelector
                      value={state[key]}
                      url={props.url}
                      onChange={e => onChange(e.target.value, key)}
                      defaultOption={defaultOption}
                      {...props}
                    />
                  )}
                  {type === 'check' && (
                    <CheckSelector
                      value={state[key]}
                      url={props.url}
                      onChange={value => onChange(value, key)}
                      defaultOption={defaultOption}
                      {...props}
                    />
                  )}
                  {type === 'rate' && (
                    <span>
                      <Rate
                        tooltips={props.desc}
                        value={state[key] === '' ? 0 : state[key]}
                        onChange={value => onChange(value, key)}
                        {...props}
                      />
                      {state[key] ? (
                        <span className="ant-rate-text">{props.desc[state[key] - 1]}</span>
                      ) : (
                        ''
                      )}
                    </span>
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
                  loading={submitting}
                >
                  {formatMessage({ id: 'form.submit' })}
                </Button>
                <Button
                  type="danger"
                  onClick={onDelete}
                  disabled={!formstatus}
                  style={{ marginLeft: 20 }}
                  loading={submitting}
                >
                  {formatMessage({ id: 'form.delete' })}
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
