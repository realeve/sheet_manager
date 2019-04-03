import React from 'react';
import { useOptions } from './useOptions';
import { Radio } from 'antd';
const { Group } = Radio;
export default function RadioButton({ url, value: val, onChange, defaultOption, ...props }) {
  const { options } = useOptions({ url, defaultOption });
  return (
    <Group buttonStyle="solid" value={val} onChange={onChange} {...props}>
      {options.map(({ name, value }) => (
        <Radio.Button key={value} value={value}>
          {name}
        </Radio.Button>
      ))}
    </Group>
  );
}
