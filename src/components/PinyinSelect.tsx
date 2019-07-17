import React from 'react';
import { Select } from 'antd';
import pinyin from '@/utils/pinyin.js';
import * as R from 'ramda';

const Option = Select.Option;

export type OptionItem = {
  value: string | number;
  name: string | number;
};

export interface IProps {
  placeholder?: string;
  options: OptionItem[];
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
      { props: { children: text } }
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

  return (
    <Select
      {...prop}
      showSearch
      optionFilterProp="children"
      onChange={onChange}
      value={R.isNil(value) ? [""] : value}
      filterOption={onFilter}
      className={className}
    >
      {options.map(({ value, name }: OptionItem) => (
        <Option value={value} key={R.isNil(name) ? "" : value}>
          {name}
        </Option>
      ))}
    </Select>
  );
}
