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
    let detail = R.find(item => item.value == value)(options);
    if (R.isNil(detail)) {
      return;
    }
    setOptVal(detail.name);
  }, [options, value]);

  return (
    <PinyinSelect
      style={{ width: 150 }}
      value={optVal}
      onChange={onChange}
      options={options}
      placeholder="拼音首字母过滤"
      {...props}
    />
  );
}
