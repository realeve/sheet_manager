import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Input, AutoComplete } from 'antd';
import { Icon } from '@ant-design/compatible';
import classNames from 'classnames';
import styles from './index.less';

export default class HeaderSearch extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    placeholder: PropTypes.string,
    onSearch: PropTypes.func,
    defaultActiveFirstOption: PropTypes.bool,
    options: PropTypes.array,
    defaultOpen: PropTypes.bool,
  };

  static defaultProps = {
    defaultActiveFirstOption: false,
    onSearch: () => {},
    className: '',
    placeholder: '',
    options: [],
    defaultOpen: false,
  };

  static getDerivedStateFromProps(props) {
    if ('open' in props) {
      return {
        searchMode: props.open,
      };
    }
    return null;
  }

  constructor(props) {
    super(props);
    this.state = {
      searchMode: props.defaultOpen,
      value: '',
    };
    this.input = React.createRef();
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  onChange = value => {
    const { onChange } = this.props;
    value = value.toUpperCase();
    this.setState({ value });
    if (onChange) {
      onChange(value);
    }
  };

  enterSearchMode = () => {
    this.setState({ searchMode: true }, () => {
      const { searchMode } = this.state;
      if (searchMode) {
        this.input.focus();
      }
    });
  };

  leaveSearchMode = () => {
    this.setState({
      searchMode: false,
      value: '',
    });
  };

  render() {
    const { className, placeholder, open, ...restProps } = this.props;
    const { searchMode, value } = this.state;

    return (
      <span className={classNames(className, styles.headerSearch)} onClick={this.enterSearchMode}>
        <Icon type="search" key="Icon" />
        <AutoComplete
          key="AutoComplete"
          {...restProps}
          className={classNames(styles.input, {
            [styles.show]: searchMode,
          })}
          value={value}
          onChange={this.onChange}
        >
          <Input
            ref={node => {
              this.input = node;
            }}
            aria-label={placeholder}
            placeholder={placeholder}
            onBlur={this.leaveSearchMode}
          />
        </AutoComplete>
      </span>
    );
  }
}
