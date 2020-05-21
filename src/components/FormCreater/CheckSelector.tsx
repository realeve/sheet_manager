import React from 'react';
import { useOptions } from './useOptions';
import { Checkbox } from 'antd';
const { Group } = Checkbox;
export default function CheckSelector({
  url,
  value,
  outterTrigger,
  onChange,
  defaultOption,
  ...props
}) {
  const { options } = useOptions({ url, defaultOption });
  return (
    <Group
      value={typeof value == 'string' ? value.split(',') : value} //.map(item => Number(item)) : []}
      onChange={onChange}
      options={options}
      {...props}
    />
  );
}
