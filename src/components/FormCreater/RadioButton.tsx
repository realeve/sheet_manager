import React from 'react';
import { useOptions } from './useOptions';
import { Radio } from 'antd';
import { handleScope } from './FormItem';
const { Group } = Radio;
export default function RadioButton({ url, value: val, onChange, defaultOption, ...props }) {
  const { options } = useOptions({ url, defaultOption });
  return (
    <Group
      buttonStyle="solid"
      value={val}
      onChange={e => {
        onChange(e.target.value, handleScope(e.target.value, options));
      }}
      {...props}
    >
      {options.map(({ name, value }) => (
        <Radio.Button key={value} value={value}>
          {name}
        </Radio.Button>
      ))}
    </Group>
  );
}
