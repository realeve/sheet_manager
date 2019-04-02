import React, { useState } from 'react';
import { useSetState } from 'react-use';
import { axios } from '@/utils/axios';
import { notification, Card, Input, Row, Col, Button, InputNumber, DatePicker } from 'antd';
import styles from './index.less';
import config from './config';
import * as R from 'ramda';
import { connect } from 'dva';
import PinyinSelector from '../PinyinSelector';
import { formatMessage } from 'umi/locale';

import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

const { TextArea } = Input;

function FormCreater({ uid }) {
  let [state, setState] = useSetState();
  let [formType, setFormType] = useState('new');
  // 设置表单初始数据
  const setFormData = data => {
    // ...
  };

  // 获取初始数据
  const getFormData = () => {
    return state;
  };

  // 从配置项中获取url
  let getUrl = obj => {
    if (typeof obj === 'string') {
      return obj;
    }
    return obj.url;
  };

  // 提交数据
  const onsubmit = async () => {
    let params = getFormData();
    let { insert, update } = config;

    // 是否新增数据
    let isAdd = formType === 'new';

    let method = isAdd ? insert : update;
    let { callback } = method;

    let axiosConfig = {
      method: 'post',
      url: getUrl(method),
      data: callback ? callback(params) : params,
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

  const onChange = (value, key, callback = e => String(e).trim()) => {
    setState({ [key]: callback(value) });
  };

  const onReset = () => {
    console.log(state);
  };

  return (
    <div className={styles.form}>
      {config.detail.map(({ title: mainTitle, detail }, idx) => (
        <Card title={`${idx + 1}.${mainTitle}`} style={{ marginBottom: 20 }} key={mainTitle}>
          <Row gutter={15}>
            {detail.map(({ title, key, type, placeholder, regExp, callback, block, ...props }) => (
              <Col span={8} md={8} sm={12} xs={24} className={styles['form-item']} key={key}>
                <span className={styles.title}>{title}</span>
                <div className={styles.element}>
                  {type === 'input' && (
                    <Input
                      style={{ width: 150 }}
                      value={state[key]}
                      onChange={e => onChange(e.target.value, key, callback)}
                      placeholder={placeholder}
                      {...props}
                    />
                  )}
                  {type === 'input.textarea' && (
                    <TextArea
                      style={{ maxWidth: 350 }}
                      autosize={{ minRows: 1, maxRows: 3 }}
                      value={state[key]}
                      onChange={e => onChange(e.target.value, key)}
                      placeholder={placeholder}
                      {...props}
                    />
                  )}
                  {type === 'input.number' && (
                    <InputNumber
                      min={props.min}
                      max={props.max}
                      style={{ width: 150 }}
                      placeholder={placeholder}
                      value={state[key]}
                      onChange={value => onChange(value, key)}
                      {...props}
                    />
                  )}
                  {type === 'datepicker' && (
                    <DatePicker
                      value={moment(state[key] || moment(), props.datetype || 'YYYY-MM-DD')}
                      defaultValue={moment()}
                      onChange={(_, value) => onChange(value, key)}
                      {...props}
                    />
                  )}
                  {type === 'select' && (
                    <PinyinSelector
                      url={props.url}
                      value={state[key]}
                      onChange={value => onChange(value, key)}
                      {...props}
                    />
                  )}
                  {block && <label className={styles.block}>{block}</label>}
                </div>
              </Col>
            ))}
            {idx === config.detail.length - 1 && (
              <Col span={24} className={styles.submit}>
                <Button type="default" onClick={onReset}>
                  {formatMessage({ id: 'form.reset' })}
                </Button>
                <Button type="primary" onClick={onsubmit} style={{ marginLeft: 20 }}>
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
