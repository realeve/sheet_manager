import React from 'react';
import { useOptions } from './useOptions';
import { Radio } from 'antd';
const { Group } = Radio;
export default function RadioSelector({ url, value, onChange, defaultOption, ...props }) {
  const { options } = useOptions({ url, defaultOption });
  return <Group value={value} onChange={onChange} options={options} {...props} />;
}
