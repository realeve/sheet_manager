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
  Icon,
  Popconfirm,
  Drawer,
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

import { Controlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import beautify from 'js-beautify';

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

  let [modalVisible, setModalVisible] = useState(false);

  let [formConfig, setFormConfig] = useState(config);

  let [loadOption, setLoadOption] = useState({ url: null, params: {} });

  // config改变后初始化表单数据
  useEffect(() => {
    let requiredFileds = [];
    let fields = {};
    formConfig.detail.forEach(({ detail }) => {
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
        curPageName: formConfig.name,
      },
    });
  }, [formConfig]);

  const [beautyConfig, setBeautyConfig] = useState('{}');
  useEffect(() => {
    const beautyOption = {
      indent_size: 2,
      wrap_line_length: 80,
      jslint_happy: true,
    };
    const code = beautify(JSON.stringify(formConfig), beautyOption);
    setBeautyConfig(code);
  }, [formConfig]);

  useEffect(() => {
    setFormConfig(config);
  }, [config]);

  // 表单字段当前状态判断
  const [formstatus, setFormstatus] = useState(false);
  useEffect(() => {
    if (!Object.keys(state).length) {
      setFormstatus(false);
      return;
    }
    // 必填字段状态校验
    let required = validRequire(requiredFileds, state);
    let validStatus = Object.values(validateState).filter(item => !item).length == 0;
    setFormstatus(validStatus && required);
  }, [state]);

  // 历史数据载入
  useEffect(() => {
    let { api } = formConfig;
    // api不存在，历史记录查询接口不存在，当前为更新模式
    if (!api || !api.query) {
      return;
    }
    loadHistoryData(api.query);
  }, [state]);

  // 索引字段(通过校验后)改变时，如车号等，载入初始数据用于更新
  const loadHistoryData = async ({ param, url }) => {
    if (!param) {
      return;
    }
    // 如果不存在 query或没有param时（无查询主键）返回
    let params = R.pick(param)(state);
    if (Object.keys(params).length !== param.length) {
      // 观测参数未设置完全
      return;
    }

    // 查询参数不变更时禁止提交查询
    if (R.equals(params, loadOption.params)) {
      return;
    }

    let option = {
      url,
      params,
    };
    setLoadOption(option);
  };

  useEffect(() => {
    if (!loadOption.url) {
      return;
    }

    axios(loadOption).then(({ data }) => {
      if (data.length === 0) {
        return;
      }

      // 载入历史数据
      // setState(data[0]);
      formInstance.set(data[0]);
      setEditMethod('update');
    });
  }, [loadOption.params]);

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
  const onsubmit = async (editType = editMethod) => {
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
    let axiosConfig = getPostData({ config, params, editMethod: editType, uid });
    console.log('插入/更新数据', axiosConfig);

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
    onReset();
  };

  // 根据索引字段删除数据，建议用至少一个字段作为索引，推荐用_id(需在查询中一并附带)
  const onDelete = async () => {
    let { api } = config;
    if (!api || !api.delete || !api.delete.param) {
      return;
    }
    let { param, url } = api.delete;
    let params = R.pick(param, state);
    let {
      data: [affected_rows],
    } = await axios({ url, params });
    console.log('删除数据', { url, params });
    notity(affected_rows);
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

    // console.log('数据变更');
  };

  const onReset = () => {
    formInstance.reset();
    // 重置编辑状态
    setEditMethod('insert');
  };

  const getValue = (props, key: string) => {
    let val = state[key];
    if (props.mode === 'multiple') {
      return val ? val.split(',') : [];
    }
    return R.isNil(val) ? null : val;
  };

  const showModal = () => {
    setModalVisible(true);
  };

  const handleConfig = () => {
    try {
      let configStr = JSON.parse(beautyConfig);
      setFormConfig(configStr);
    } catch (e) {
      notification.error({
        message: '系统提示',
        description: '格式异常，不是有效的JSON数据，请仔细检查',
      });
    }
  };

  const pStyle = {
    fontSize: 16,
    color: 'rgba(0,0,0,0.85)',
    lineHeight: '24px',
    display: 'block',
    marginBottom: 16,
  };
  return (
    <div>
      <Drawer
        placement="right"
        closable={false}
        visible={modalVisible}
        width="450px"
        onClose={() => setModalVisible(false)}
        bodyStyle={{ padding: 20 }}
      >
        <p style={{ ...pStyle, marginBottom: 24 }}>表单配置项</p>
        <div>
          <p>自定义报表时，可参考该配置</p>
          <p>
            在insert接口设置的param字段，如果设置rec_time,uid，系统自动将当前用户uid以及rec_time作为提交字段向后台提交。
          </p>
        </div>
        <CodeMirror
          value={beautyConfig}
          options={{
            mode: 'javascript',
            lineNumbers: true,
            styleActiveLine: true,
            matchBrackets: true,
            theme: 'material',
          }}
          className={styles.code}
          onBeforeChange={(editor, data, value) => {
            setBeautyConfig(value);
          }}
        />
        <div style={{ marginTop: 20 }}>
          <Button type="primary" onClick={handleConfig}>
            预览
          </Button>
        </div>
      </Drawer>
      <div className={styles.form}>
        {formConfig.detail.map(({ title: mainTitle, detail }, idx) => (
          <Card
            title={
              <span>
                {idx + 1}.{mainTitle}
                {idx === 0 && (
                  <Icon style={{ paddingLeft: 10 }} type="question-circle-o" onClick={showModal} />
                )}
              </span>
            }
            style={{ marginBottom: 20 }}
            key={mainTitle}
          >
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
                        value={getValue(props, key)}
                        onChange={value => onChange(value, key)}
                        defaultOption={defaultOption}
                        state={state}
                        db_key={key}
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
              {idx === formConfig.detail.length - 1 && (
                <Col span={24} className={styles.submit}>
                  <Button type="default" onClick={onReset} disabled={!formstatus}>
                    {formatMessage({ id: 'form.reset' })}
                  </Button>
                  {editMethod === 'update' && (
                    <Button
                      type="danger"
                      onClick={onsubmit}
                      disabled={!formstatus}
                      style={{ marginLeft: 20 }}
                      loading={submitting}
                    >
                      {formatMessage({ id: 'form.update' })}
                    </Button>
                  )}
                  <Button
                    type="primary"
                    onClick={() => onsubmit('insert')}
                    disabled={!formstatus}
                    style={{ marginLeft: 20 }}
                    loading={submitting}
                  >
                    {formatMessage({ id: 'form.submit' })}
                  </Button>
                  {formConfig.api.delete && (
                    <Popconfirm
                      title="确定删除本条数据?"
                      onConfirm={onDelete}
                      okText="是"
                      cancelText="否"
                    >
                      <Button
                        type="danger"
                        disabled={!formstatus}
                        style={{ marginLeft: 20 }}
                        loading={submitting}
                      >
                        {formatMessage({ id: 'form.delete' })}
                      </Button>
                    </Popconfirm>
                  )}
                </Col>
              )}
            </Row>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default connect(({ common: { userSetting } }) => ({
  uid: userSetting.uid,
}))(FormCreater);
