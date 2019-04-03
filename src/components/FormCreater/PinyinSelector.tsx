import React, { useState, useEffect } from 'react';
import PinyinSelect from '../PinyinSelect';
import { useOptions } from './useOptions';
import * as R from 'ramda';
export default function PinyinSelector({ url, value, onChange, defaultOption, ...props }) {
  const { options } = useOptions({ url, defaultOption });
  const [optVal, setOptVal] = useState();
  useEffect(() => {
    let detail = R.filter(item =>
      props.mode === 'multiple' ? value.includes(String(item.value)) : item.value == value
    )(options);

    if (detail.length === 0) {
      return;
    }
    let val = detail.map(({ name }) => name);
    setOptVal(val);
  }, [options, value]);

  const onSelectChange = value => {
    let detail = R.filter(item => value.includes(item.value) || value.includes(item.name))(options);
    let val = detail.map(({ value }) => value);
    setSelectedItems(val);
    onChange(val);
  };

  let [selectedItems, setSelectedItems] = useState([]);
  const filteredOptions = options.filter(o => !selectedItems.includes(o.value));

  return (
    <PinyinSelect
      style={{ width: props.mode === 'multiple' ? 230 : 150 }}
      value={optVal}
      onChange={props.mode === 'multiple' ? onSelectChange : onChange}
      options={filteredOptions}
      placeholder="拼音首字母过滤"
      {...props}
    />
  );
}
