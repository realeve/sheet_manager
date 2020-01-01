import React, { useState, useEffect } from 'react';

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

export const handleScope = (value, option) => {
  let item = R.find(R.propEq('value', value))(option);
  return {
    scope: (item && item.scope) || [],
    hide: (item && item.hide) || [], // 需要隐藏的字段
  };
};

const getScopeRange = detail => {
  if (!R.isNil(detail.min) && !R.isNil(detail.max)) {
    return detail.min < detail.max
      ? `[${detail.min},${detail.max}]`
      : `[${detail.max},${detail.min}]`;
  } else if (R.isNil(detail.max)) {
    return `≥${detail.min}`;
  } else {
    return `≤${detail.max}`;
  }
};

export default function formItem({
  state,
  setState,
  setFormstatus,
  keyName: key,
  cascade,
  detail: { title, type, block, defaultOption, span = 8, unReset, ...props },
  scope = [],
  setScope,
  isQueryKey = false,
}) {
  let [validateState, setValidateState] = useState(true);

  let [validateScope, setValidateScope] = useState(true);

  const isInput = ['input', 'input.number'].includes(type);

  let scopeDetail = isInput ? R.find(R.propEq('key', key))(scope) : false;

  // scope中注入一些参数
  let {
    min: __min,
    max: __max,
    key: __key,
    block: __block,
    defaultValue: __defaultValue,
    ...restScope
  } = scopeDetail || {};

  // 可能存在 min/max录错的情况
  if (typeof __min !== 'undefined' && typeof __max !== 'undefined') {
    if (__max < __min) {
      let temp = __max;
      __max = __min;
      __min = temp;
    }
  }

  useEffect(() => {
    if (!__defaultValue) {
      return;
    }
    setState(__defaultValue);
  }, [__defaultValue]);

  const onChange = (val: any, props: { [key: string]: any } = {}) => {
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

    if (isInput && scopeDetail && (typeof __min !== 'undefined' || typeof __max !== 'undefined')) {
      // input 元素需要处理数据录入范围

      if ((!R.isNil(__min) && val < __min) || (!R.isNil(__max) && val > __max)) {
        setValidateScope(false);
      } else {
        setValidateScope(true);
      }
    }

    // console.log(val, key);
    // console.log('数据变更');
  };

  const getValue = ({ mode }: { mode: 'multiple' | 'single' | null }) => {
    let val = state;
    if (mode === 'multiple') {
      return val ? val.split(',') : [];
    }
    return R.isNil(val) ? null : val;
  };

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
        {isQueryKey && <span title="索引字段">🔍</span>}
        {title}
      </span>
      <div
        className={cx(
          { 'has-error': false === validateState || false === validateScope },
          'element',
          {
            elementLarge: ['radio', 'radio.button', 'check'].includes(type), // 'select',
          }
        )}
      >
        {type === 'input.textarea' && (
          <TextArea
            style={{ width: '100%' }}
            autoSize={{ minRows: 1, maxRows: 2 }}
            value={state}
            onChange={e => onChange(e.target.value, props)}
            {...props}
          />
        )}
        {type === 'label' && <label style={{ lineHeight: '32px' }}>{state}</label>}
        {/* 处理SCOPE信息，展示数据范围  */}
        {type === 'input' && (
          <Input
            style={{ width: '100%' }}
            value={state}
            onChange={e => onChange(e.target.value, props)}
            {...props}
            placeholder={
              scopeDetail && (scopeDetail.min || scopeDetail.max)
                ? `范围: ${getScopeRange(scopeDetail)}`
                : props.placeholder || ''
            }
            allowClear={props.allowClear !== false}
            {...restScope}
          />
        )}
        {type === 'input.number' && (
          <InputNumber
            min={props.min}
            max={props.max}
            style={{ width: '100%' }}
            value={state}
            onChange={value => onChange(value, props)}
            {...props}
            placeholder={
              scopeDetail && (scopeDetail.min || scopeDetail.max)
                ? `范围: ${getScopeRange(scopeDetail)}`
                : props.placeholder || ''
            }
            {...restScope}
          />
        )}
        {type === 'datepicker' && (
          <DatePicker
            value={moment(state || moment(), props.datetype || 'YYYY-MM-DD')}
            onChange={(_, value) => onChange(value)}
            showTime={props.showTime || false}
            style={{ width: '100%' }}
            {...props}
          />
        )}
        {type === 'datepicker.month' && (
          <DatePicker.MonthPicker
            value={moment(state || moment(), props.datetype || 'YYYY-MM')}
            onChange={(_, value) => onChange(value)}
            style={{ width: '100%' }}
            {...props}
          />
        )}
        {type === 'switch' && (
          <Switch
            defaultChecked
            checked={Boolean(state)}
            onChange={value => onChange(value)}
            {...props}
          />
        )}
        {type === 'select' && (
          <PinyinSelector
            url={props.url}
            value={getValue(props)}
            onChange={(val, scopeItem) => {
              onChange(val);
              setScope(scopeItem);
            }}
            defaultOption={defaultOption}
            state={state}
            db_key={key}
            style={{ width: '100%' }}
            {...props}
            cascade={cascade}
          />
        )}
        {type === 'radio.button' && (
          <RadioButton
            value={state}
            url={props.url}
            onChange={(val, scopeItem) => {
              onChange(val);
              setScope(scopeItem);
            }}
            defaultOption={defaultOption}
            {...props}
          />
        )}
        {type === 'radio' && (
          <RadioSelector
            value={state}
            url={props.url}
            onChange={(val, scopeItem) => {
              onChange(val);
              setScope(scopeItem);
            }}
            defaultOption={defaultOption}
            {...props}
          />
        )}
        {type === 'check' && (
          <CheckSelector
            value={state}
            url={props.url}
            onChange={value => onChange(value)}
            defaultOption={defaultOption}
            {...props}
          />
        )}
        {type === 'rate' && (
          <span>
            <Rate
              tooltips={props.desc}
              value={state === '' ? 0 : state}
              onChange={value => onChange(value)}
              {...props}
            />
            {state ? <span className="ant-rate-text">{props.desc[state - 1]}</span> : ''}
          </span>
        )}

        {!validateState && props.rule ? (
          <label className="ant-form-explain">{getRuleMsg(props.rule, title)}</label>
        ) : (
          (__block || block) && (
            <label
              className="ant-form-explain"
              dangerouslySetInnerHTML={{
                __html: __block || block,
              }}
            ></label>
          )
        )}
      </div>
    </Col>
  );
}
