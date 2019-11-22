import React, { useState } from 'react';

import { Input, Col, Switch, InputNumber, DatePicker, Rate } from 'antd';
import PinyinSelector from './PinyinSelector';
import RadioSelector from './RadioSelector';
import RadioButton from './RadioButton';
import CheckSelector from './CheckSelector';

import { handler, onValidate, getRuleMsg } from './lib';
import * as R from 'ramda';

import styles from './index.less';
import classNames from 'classnames/bind';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

const cx = classNames.bind(styles);
const { TextArea } = Input;

export default function formItem({
  state,
  setState,
  setFormstatus,
  keyName: key,
  cascade,
  detail: { title, type, block, defaultOption, span = 8, ...props },
}) {
  let [validateState, setValidateState] = useState(null);

  const onChange = (val: any, key: string, props: { [key: string]: any } = {}) => {
    let value = handler.trim(val);
    let { toupper, tolower, rule } = props;
    if (toupper) {
      value = handler.toUpper(val);
    } else if (tolower) {
      value = handler.toLower(val);
    }
    setState(value);
    // 录入状态判断
    let status = onValidate(value, rule);
    setValidateState(status);
    setFormstatus(status);
    console.log(val, key);
    // console.log('数据变更');
  };

  const getValue = (props, key: string) => {
    let val = state;
    if (props.mode === 'multiple') {
      return val ? val.split(',') : [];
    }
    return R.isNil(val) ? null : val;
  };

  // const FormFields = ({ type }) => {
  //   switch (type) {
  //     case 'input':
  //       return (
  //         <Input
  //           style={{ width: '100%' }}
  //           value={state}
  //           onChange={e => onChange(e.target.value, key, props)}
  //           {...props}
  //         />
  //       );
  //     case 'input.textarea':
  //       return (
  //         <TextArea
  //           style={{ width: '100%' }}
  //           autoSize={{ minRows: 1, maxRows: 2 }}
  //           value={state}
  //           onChange={e => onChange(e.target.value, key, props)}
  //           {...props}
  //         />
  //       );

  //     case 'input.number':
  //       return (
  //         <InputNumber
  //           min={props.min}
  //           max={props.max}
  //           style={{ width: '100%' }}
  //           value={state}
  //           onChange={value => onChange(value, key, props)}
  //           {...props}
  //         />
  //       );

  //     case 'datepicker':
  //       return (
  //         <DatePicker
  //           value={moment(state || moment(), props.datetype || 'YYYY-MM-DD')}
  //           onChange={(_, value) => onChange(value, key)}
  //           style={{ width: '100%' }}
  //           {...props}
  //         />
  //       );
  //     case 'select':
  //       return (
  //         <PinyinSelector
  //           url={props.url}
  //           value={getValue(props, key)}
  //           onChange={value => onChange(value, key)}
  //           defaultOption={defaultOption}
  //           state={state}
  //           db_key={key}
  //           style={{ width: '100%' }}
  //           {...props}
  //         />
  //       );

  //     case 'switch':
  //       return (
  //         <Switch
  //           defaultChecked
  //           checked={Boolean(state)}
  //           onChange={value => onChange(value, key)}
  //           {...props}
  //         />
  //       );

  //     case 'radio.button':
  //       return (
  //         <RadioButton
  //           value={state}
  //           url={props.url}
  //           onChange={e => onChange(e.target.value, key)}
  //           defaultOption={defaultOption}
  //           {...props}
  //         />
  //       );

  //     case 'radio':
  //       return (
  //         <RadioSelector
  //           value={state}
  //           url={props.url}
  //           onChange={e => onChange(e.target.value, key)}
  //           defaultOption={defaultOption}
  //           {...props}
  //         />
  //       );
  //     case 'check':
  //       return (
  //         <CheckSelector
  //           value={state}
  //           url={props.url}
  //           onChange={value => onChange(value, key)}
  //           defaultOption={defaultOption}
  //           {...props}
  //         />
  //       );
  //     case 'rate':
  //       return (
  //         <span>
  //           <Rate
  //             tooltips={props.desc}
  //             value={state === '' ? 0 : state}
  //             onChange={value => onChange(value, key)}
  //             {...props}
  //           />
  //           {state ? <span className="ant-rate-text">{props.desc[state - 1]}</span> : ''}
  //         </span>
  //       );

  //     default:
  //       return null;
  //   }
  // };

  return (
    <Col
      span={span}
      md={span}
      sm={12}
      xs={24}
      className={classNames(styles['form-item'], { [styles['form-center']]: type === 'radio' })}
    >
      <span
        className={cx('title', {
          required: props.rule && props.rule.required,
        })}
      >
        {title}
      </span>
      <div className={cx({ 'has-error': false === validateState }, 'element')}>
        {type === 'input' && (
          <Input
            style={{ width: '100%' }}
            value={state}
            onChange={e => onChange(e.target.value, key, props)}
            {...props}
          />
        )}
        {type === 'input.textarea' && (
          <TextArea
            style={{ width: '100%' }}
            autoSize={{ minRows: 1, maxRows: 2 }}
            value={state}
            onChange={e => onChange(e.target.value, key, props)}
            {...props}
          />
        )}
        {type === 'input.number' && (
          <InputNumber
            min={props.min}
            max={props.max}
            style={{ width: '100%' }}
            value={state}
            onChange={value => onChange(value, key, props)}
            {...props}
          />
        )}
        {type === 'datepicker' && (
          <DatePicker
            value={moment(state || moment(), props.datetype || 'YYYY-MM-DD')}
            onChange={(_, value) => onChange(value, key)}
            style={{ width: '100%' }}
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
            style={{ width: '100%' }}
            {...props}
            cascade={cascade}
          />
        )}
        {type === 'switch' && (
          <Switch
            defaultChecked
            checked={Boolean(state)}
            onChange={value => onChange(value, key)}
            {...props}
          />
        )}
        {type === 'radio.button' && (
          <RadioButton
            value={state}
            url={props.url}
            onChange={e => onChange(e.target.value, key)}
            defaultOption={defaultOption}
            {...props}
          />
        )}
        {type === 'radio' && (
          <RadioSelector
            value={state}
            url={props.url}
            onChange={e => onChange(e.target.value, key)}
            defaultOption={defaultOption}
            {...props}
          />
        )}
        {type === 'check' && (
          <CheckSelector
            value={state}
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
              value={state === '' ? 0 : state}
              onChange={value => onChange(value, key)}
              {...props}
            />
            {state ? <span className="ant-rate-text">{props.desc[state - 1]}</span> : ''}
          </span>
        )}

        {!validateState && props.rule ? (
          <label className="ant-form-explain">{getRuleMsg(props.rule, title)}</label>
        ) : (
          block && <label className="ant-form-explain">{block}</label>
        )}
      </div>
    </Col>
  );
}
