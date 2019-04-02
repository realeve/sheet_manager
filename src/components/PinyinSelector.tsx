import React, { useState, useEffect } from 'react';
import PinyinSelect from './PinyinSelect';
import { axios } from '@/utils/axios';
import * as R from 'ramda';
export default function PinyinSelector({ url, value, onChange }) {
  const [options, setOptions] = useState([]);
  useEffect(() => {
    if (R.isNil(url)) {
      return;
    }
    axios({ url }).then(({ data }) => {
      setOptions(data);
    });
  }, [url]);
  return (
    <PinyinSelect
      style={{ width: 150 }}
      value={value}
      onChange={onChange}
      options={options}
      placeholder="拼音首字母过滤"
    />
  );
}
