import React, { useState, useEffect } from 'react';

import {
  Input,
  Col,
  Switch,
  InputNumber,
  DatePicker,
  TimePicker,
  Rate,
  notification,
  Button,
  Modal,
  Tooltip,
} from 'antd';
import PinyinSelector from './PinyinSelector';
import RadioSelector from './RadioSelector';
import RadioButton from './RadioButton';
import CheckSelector from './CheckSelector';

import { handler, onValidate, getRuleMsg } from './lib';
import * as R from 'ramda';

import { axios } from '@/utils/axios';
import SimpleList from '@/pages/Search/components/SimpleList';
import { IFieldItem } from './index';
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
    scope: item?.scope || [],
    hide: item?.hide || [], // 需要隐藏的字段
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
  dev,
  ip,
  detail: {
    title,
    type,
    block,
    defaultOption,
    span = 8,
    ignore,
    unReset,
    rule,
    increase,
    titlewidth = 120,
    calc,
    suffix,
    offset = 0,
    callback,
    hidetitle = false,
    init,
    tooltip,
    style,
    ...props
  },
  scope = [],
  setScope,
  calcValid,
  isQueryKey = false,
  formLayout,
  user,
  innerTrigger = '0',
  outterTrigger,
}: {
  detail: Partial<IFieldItem>;
  [key: string]: any;
}) {
  let [append, setAppend] = useState(null);
  const [appendShow, setAppendShow] = useState(false);

  let [validateState, setValidateState] = useState(true);

  let [validateScope, setValidateScope] = useState(true);

  const isInput = ['input', 'input.number'].includes(type);

  let scopeDetail = R.find(R.propEq('key', key))(scope);

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
    if (typeof __defaultValue === 'undefined') {
      return;
    }
    setState(__defaultValue);
  }, [__defaultValue]);

  const onChange = (val: any, props: { [key: string]: any } = {}) => {
    let value = handler.trim(val);
    let { toupper, tolower } = props;
    if (toupper) {
      value = handler.toUpper(val);
    } else if (tolower) {
      value = handler.toLower(val);
    }

    if (callback) {
      // 处理默认载入数据的场景;
      axios({
        url: callback.url,
        params: {
          [key]: value,
          uid: user.id,
          ip,
        },
      }).then(res => {
        if (res.rows == 0 && typeof rule != 'string' && rule.required) {
          notification.error({
            message: '初始数据载入错误',
            description: rule.msg,
            duration: 10,
          });
          setState(value);
          return;
        }
        setState({
          ...res.data[0],
          [key]: value,
        });
      });
    } else {
      setState(value);
    }

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
  };

  const getValue = () => {
    let val = state || '';
    if (props.mode === 'multiple') {
      return val.length === 0 ? [] : val.split(',');
    }
    return [val];
  };

  let invalidCalc = calcValid.key === key && !calcValid.status;

  let [haveHideKeys, setHaveHideKeys] = useState(false);
  useEffect(() => {
    setHaveHideKeys(
      !R.isNil((restScope.defaultOption || defaultOption || []).find(item => item.hide))
    );
  }, [restScope.defaultOption, defaultOption]);

  useEffect(() => {
    if (!(['input', 'input.number', 'label'].includes(type) && props.url)) {
      return;
    }

    // 处理默认载入数据的场景;
    axios({
      url: props.url,
      params: {
        uid: user.uid,
        ip,
      },
    }).then(res => {
      if (res.rows == 0 && typeof rule != 'string' && rule.required) {
        notification.error({
          message: '初始数据载入错误',
          description: rule.msg,
          duration: 10,
        });
        return;
      }
      setAppend(res);
      // console.log('trigger 5');
      setState(res.data[0]);
    });
  }, [innerTrigger]);

  let showTitle = title?.length > 0 && !hidetitle;
  return (
    <Col
      span={span}
      md={span}
      sm={12}
      xs={24}
      className={classNames(styles['form-item'], {
        [styles['form-center']]: type === 'radio',
        ['ant-form-item-has-error']: !validateState || invalidCalc,
        ['ant-form-item-has-warning']: !validateScope,
        [styles['form-item-vertical']]: formLayout === 'vertical',
      })}
      offset={offset}
      style={style}
    >
      {append && (
        <Modal
          title="查看详情"
          visible={appendShow}
          footer={null}
          onCancel={() => setAppendShow(false)}
          onOk={() => setAppendShow(false)}
          width={1080}
        >
          <SimpleList removeEmpty data={{ ...append, error: null }} />
        </Modal>
      )}

      {
        <span
          className={cx('title', {
            required: typeof rule != 'string' && rule?.required,
            [styles.showTitle]: showTitle,
          })}
          style={{ width: showTitle ? titlewidth : 'auto' }}
        >
          {tooltip && (
            <Tooltip title={tooltip}>
              <span>💡</span>
            </Tooltip>
          )}
          {isQueryKey && <span title="索引字段:录入所有索引字段后可点击载入历史数据">🔍</span>}
          {increase && <span title="自增字段:录入后，下次信息将按规则自动增加">⬆</span>}
          {((typeof rule != 'string' && rule?.calc) || calc) && (
            <span title="关联计算:与其它字段一起计算关联规则">🔗</span>
          )}
          {unReset && <span title="固定字段:录入后字段值保持，不清空">📌</span>}
          {showTitle ? title : ''}
        </span>
      }
      <div
        className={cx(
          { 'has-error': invalidCalc || false === validateState || false === validateScope },
          'element',
          {
            elementLarge: ['radio', 'radio.button', 'check'].includes(type), // 'select',
          }
        )}
      >
        {type === 'input.textarea' && (
          <TextArea
            style={{ width: '100%' }}
            autoSize={{ minRows: 2, maxRows: 4 }}
            value={state}
            onChange={e => {
              onChange(e.target.value, props);
            }}
            {...props}
            placeholder={hidetitle ? title : props.placeholder}
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
              hidetitle
                ? title
                : scopeDetail && (scopeDetail.min || scopeDetail.max)
                ? `范围: ${getScopeRange(scopeDetail)}`
                : props.placeholder || ''
            }
            allowClear={props.allowClear !== false && !suffix}
            {...restScope}
            suffix={
              suffix && (
                <div
                  dangerouslySetInnerHTML={{
                    __html: suffix,
                  }}
                />
              )
            }
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
              hidetitle
                ? title
                : scopeDetail && (scopeDetail.min || scopeDetail.max)
                ? `范围: ${getScopeRange(scopeDetail)}`
                : props.placeholder || ''
            }
            {...restScope}
          />
        )}
        {type === 'timepicker' && (
          <TimePicker
            value={moment(state || moment(), props.datetype || 'HH:mm:ss')}
            onChange={(_, value) => onChange(value)}
            style={{ width: '100%' }}
            {...props}
            format={props.datetype || 'HH:mm:ss'}
          />
        )}
        {type === 'datepicker' && (
          <DatePicker
            value={moment(state || moment(), props.datetype || 'YYYY-MM-DD')}
            onChange={(_, value) => onChange(value)}
            showTime={props.showTime || false}
            style={{ width: '100%' }}
            {...props}
            format={props.datetype || (props.showTime ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD')}
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
            checked={[true, 'true', '1', 1].includes(state)}
            onChange={value => onChange(value)}
            {...props}
          />
        )}
        {type === 'select' && (
          <PinyinSelector
            url={props.url}
            onChange={(val, scopeItem) => {
              onChange(val);
              scopeItem && setScope(scopeItem, haveHideKeys || scopeItem.hide);
            }}
            defaultOption={restScope.defaultOption || defaultOption}
            state={state}
            db_key={key}
            style={{ width: '100%' }}
            {...props}
            value={getValue()}
            cascade={cascade}
            outterTrigger={outterTrigger}
          />
        )}
        {type === 'radio.button' && (
          <RadioButton
            value={state}
            url={props.url}
            onChange={(val, scopeItem) => {
              onChange(val);
              scopeItem && setScope(scopeItem, haveHideKeys || scopeItem.hide);
            }}
            defaultOption={restScope.defaultOption || defaultOption}
            {...props}
            outterTrigger={outterTrigger}
          />
        )}
        {type === 'radio' && (
          <RadioSelector
            value={state}
            url={props.url}
            onChange={(val, scopeItem) => {
              onChange(val);
              scopeItem && setScope(scopeItem, haveHideKeys || scopeItem.hide);
            }}
            defaultOption={restScope.defaultOption || defaultOption}
            {...props}
            outterTrigger={outterTrigger}
          />
        )}
        {type === 'check' && (
          <CheckSelector
            value={state}
            url={props.url}
            onChange={onChange}
            defaultOption={restScope.defaultOption || defaultOption}
            {...props}
            outterTrigger={outterTrigger}
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

        {invalidCalc || (!validateState && rule) ? (
          <label className="ant-form-explain">{getRuleMsg(rule, title)}</label>
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
        {/* 开发模式显示字段值 */}
        {dev && state && (
          <label className="ant-form-explain">
            {key}:{typeof state === 'string' ? state : JSON.stringify(state)}
          </label>
        )}
        {append && (
          <Button size="small" type="primary" onClick={() => setAppendShow(true)}>
            详情
          </Button>
        )}
      </div>
    </Col>
  );
}
