import React, { useState, useEffect } from 'react';
import PinyinSelect from '../PinyinSelect';
import { useOptions } from './useOptions';
import * as R from 'ramda';
import { handleScope } from './FormItem';

export default function PinyinSelector({
  url,
  value,
  onChange,
  defaultOption,
  db_key,
  state,
  cascade: [cascade = false, cascadeVal = false],
  ...props
}) {
  const textVal = props.mode === 'tags';
  const [params, setParams] = useState({});

  useEffect(() => {
    if (cascade && cascadeVal) {
      setParams({
        [cascade]: cascadeVal,
      });
    }
  }, [cascade, cascadeVal]);

  const { options } = useOptions({
    url,
    defaultOption,
    params,
    textVal,
    cascade,
  });
  const [optVal, setOptVal] = useState([]);
  useEffect(() => {
    let detail = R.filter(item =>
      props.mode === 'multiple' ? value.includes(String(item.value)) : item.value == value
    )(options);

    if (detail.length === 0) {
      return;
    }
    let val = detail.map(({ name }) => name);
    setOptVal(val);
  }, [options, value, props.cascade]);

  let [selectedItems, setSelectedItems] = useState([]);

  const [option, setOption] = useState([]);

  useEffect(() => {
    let res = options.filter(o => !selectedItems.includes(o.value));
    setOption(res);
  }, [options, selectedItems]);
   
  const handleOption = value => {
    if (R.isNil(value) || props.mode !== 'tags') {
      return;
    }
    let label = R.last(value);
    if (R.isNil(label)) {
      return;
    }
    let needPush = R.filter(R.propEq('name', label))(options).length === 0;
    if (!needPush) {
      return;
    }
    let newOptions = [...options, { label, name: label, value: label }];
    setOption(newOptions);
  };

  const onMultipleChange = value => {
    let detail = R.filter(item => value.includes(item.value) || value.includes(item.name))(options);
    let val = detail.map(({ value }) => value);
    setSelectedItems(val);
    onChange(val);
  };

  const onSingleChange = value => {
    if (props.mode === 'tags') {
      handleOption(value);
      value = [R.last(value)];
    }
    onChange(value, handleScope(value, options));
  };

  let [selectVal, setSelectVal] = useState({});
  useEffect(() => {
    let nextState = props.mode !== 'tags' ? optVal : value;    
    setSelectVal(R.isNil(nextState) ? {} : { value: nextState });
  }, [value, optVal]);
   
  // 选择项变更时清除历史数据
  useEffect(()=>{
    setOptVal([])
  },[defaultOption])
  
  return (
    <PinyinSelect
      style={{ width: props.mode === 'multiple' ? 230 : 150 }}
      onChange={props.mode === 'multiple' ? onMultipleChange : onSingleChange}
      options={cascade && R.isNil(params[cascade]) ? [] : option}
      placeholder="拼音首字母过滤"
      {...props} 
      {...selectVal}
    />
  );
}
