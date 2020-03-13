import React, { useState, useEffect } from 'react';
import { Input } from 'antd';
import classNames from 'classnames';
import styles from './index.less';
import { useDebounce } from 'react-use';

interface IProps {
  className: string;
  placeholder: string;
  onSearch: (e: string) => void;
  value: string;
  [key: string]: any;
}

const MenuSearch = ({ placeholder, collapsed, onChange, style, theme, value }: IProps) => {
  const [state, setState] = useState(value);
  useDebounce(
    () => {
      onChange(state);
    },
    800,
    [state]
  );
  useEffect(() => {
    setState(value);
  }, [value]);

  return (
    <div
      className={classNames(styles[theme], {
        [styles.show]: !collapsed,
      })}
      style={style}
    >
      <Input.Search
        value={state}
        onChange={e => setState(e.target.value)}
        aria-label={placeholder}
        placeholder={placeholder}
      />
    </div>
  );
};

export default MenuSearch;
