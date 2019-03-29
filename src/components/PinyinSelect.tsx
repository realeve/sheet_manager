import React from 'react';
import { Select } from 'antd';
import pinyin from '@/utils/pinyin.js';
const Option = Select.Option;

export type OptionItem = {
  value: string | number;
  name: string | number;
};

export interface IProps {
  placeholder?: string;
  options: [OptionItem];
  value?: number | string;
  onChange?: Function;
  className?: any;
}
export default function InputSelect(props: IProps) {
  const onFilter = (searchText: string, { props: { value, children: text } }) => {
    text = text.trim().toLowerCase();
    searchText = searchText.trim().toLowerCase();
    return [
      text,
      pinyin.toPinYin(text).toLowerCase(),
      pinyin.toPinYinFull(text).toLowerCase(),
    ].find(a => a.includes(searchText));
  };

  let { placeholder, options, value, onChange, className, ...prop } = props;

  return (
    <Select
      {...prop}
      showSearch
      placeholder={placeholder}
      optionFilterProp="children"
      onChange={onChange}
      value={value}
      filterOption={onFilter}
      className={className}
    >
      {options.map(({ value, name }) => (
        <Option value={value} key={value}>
          {name}
        </Option>
      ))}
    </Select>
  );
}
