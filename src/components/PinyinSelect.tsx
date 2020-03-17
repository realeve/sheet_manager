import React from 'react';
import { Select } from 'antd';
import pinyin from '@/utils/pinyin.js';
import * as R from 'ramda';
import { FilterFunc } from 'rc-select/lib/interface/generator';

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
    | FilterFunc<{
        key: string;
        value: string;
        children: React.ReactNode;
      }> = (searchText: string, { children: text }) => {
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

  let { options,  ...prop } = props;
  
  // 使用value属性，调整受控组件
  return (
    <Select
      {...prop}
      showSearch
      optionFilterProp="children"  
      filterOption={onFilter} 
    >
      {options.map(({ value, name }: OptionItem) => (
        <Option value={value} key={R.isNil(name) ? '' : value}>
          {name}
        </Option>
      ))}
    </Select>
  );
}
