import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Input } from 'antd';
import classNames from 'classnames';
import styles from './index.less';

export default class MenuSearch extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    placeholder: PropTypes.string,
    onSearch: PropTypes.func
  };

  static defaultProps = {
    onSearch: () => {},
    className: '',
    placeholder: ''
  };

  constructor(props) {
    super(props);
    this.state = {
      value: props.value
    };
  }

  static getDerivedStateFromProps({ value }, state) {
    if (value !== state.value) {
      return {
        value
      };
    }
    return null;
  }

  onChange = ({ target: { value } }) => {
    const { onChange } = this.props;
    value = value.toLowerCase();
    this.setState({ value });
    if (onChange) {
      onChange(value);
    }
  };

  render() {
    const { placeholder, collapsed, style, theme } = this.props;
    const { value } = this.state;
    const inputClass = classNames(styles[theme], {
      [styles.show]: !collapsed
    });
    return (
      <div className={inputClass} style={style}>
        <Input.Search
          ref={node => {
            this.input = node;
          }}
          value={value}
          onChange={this.onChange}
          aria-label={placeholder}
          placeholder={placeholder}
        />
      </div>
    );
  }
}
