import React from 'react';
import { useOptions } from './useOptions';
import { Radio } from 'antd';
import { handleScope } from './FormItem';

const { Group } = Radio;
export default function RadioSelector({ url, value, onChange, defaultOption, ...props }) {
  const { options } = useOptions({ url, defaultOption });
  return (
    <Group
      value={value}
      onChange={e => {
        onChange(e.target.value, handleScope(e.target.value, options));
      }}
      options={options}
      {...props}
    />
  );
}
