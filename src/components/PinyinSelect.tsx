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
  options: [OptionItem] | any[];
  value?: number | string;
  onChange?: any;
  className?: any;
  [key: string]: any;
}
export interface OptionProps {
  disabled?: boolean;
  value?: string | number;
  title?: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export default function PinyinSelect(props: IProps) {
  const onFilter:
    | boolean
    | ((inputValue: string, option: React.ReactElement<OptionProps>) => any) = (
    searchText: string,
    { props: { value, children: text } }
  ) => {
    text = String(text)
      .trim()
      .toLowerCase();
    searchText = searchText.trim().toLowerCase();
    return [
      text,
      pinyin.toPinYin(text).toLowerCase(),
      pinyin.toPinYinFull(text).toLowerCase(),
    ].find(a => a.includes(searchText));
  };

  let { placeholder, options, value, onChange, className, ...prop } = props;
  console.log(value);
  return (
    <Select
      {...prop}
      showSearch
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
