import React, { useState, useEffect } from 'react';
import PinyinSelect from './PinyinSelect';
import { axios } from '@/utils/axios';
import * as R from 'ramda';
export default function PinyinSelector({ url, value, onChange, ...props }) {
  const [options, setOptions] = useState([]);
  useEffect(() => {
    if (R.isNil(url)) {
      return;
    }
    axios({ url }).then(({ data }) => {
      setOptions(data);
    });
  }, [url]);

  const [optVal, setOptVal] = useState();
  useEffect(() => {
    let detail = R.filter(item => value.includes(item.name))(options);

    if (detail.length === 0) {
      return;
    }
    let val = detail.map(({ name }) => name);
    setOptVal(val);
  }, [options, value]);

  const onSelectChange = value => {
    let detail = R.filter(item => value.includes(item.value) || value.includes(item.name))(options);
    onChange(detail.map(({ name }) => name));
  };

  return (
    <PinyinSelect
      style={{ width: 150 }}
      value={optVal}
      onChange={e => onSelectChange(e)}
      options={options}
      placeholder="拼音首字母过滤"
      mode="multiple"
      {...props}
    />
  );
}
