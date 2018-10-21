import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Input } from 'antd';
import classNames from 'classnames';
import styles from './index.less';

export default class MenuSearch extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    placeholder: PropTypes.string,
    onSearch: PropTypes.func,
    value: PropTypes.string
  };

  static defaultProps = {
    onSearch: () => {},
    className: '',
    placeholder: '',
    value: ''
  };

  render() {
    const {
      placeholder,
      collapsed,
      style,
      theme,
      onChange,
      value
    } = this.props;
    const inputClass = classNames(styles[theme], {
      [styles.show]: !collapsed
    });
    return (
      <div className={inputClass} style={style}>
        <Input.Search
          value={value}
          onChange={onChange}
          aria-label={placeholder}
          placeholder={placeholder}
        />
      </div>
    );
  }
}
