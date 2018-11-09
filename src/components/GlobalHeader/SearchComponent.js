import React, { PureComponent } from 'react';
import HeaderSearch from '@/components/HeaderSearch';
import { formatMessage } from 'umi/locale';
import styles from './index.less';
import * as lib from '@/utils/lib';

import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

const R = require('ramda');

export default class GlobalHeaderRight extends PureComponent {
  getRouter = () => {
    let { pathname } = window.location;
    return pathname;
  };
  componentDidMount() {
    let pathname = this.getRouter();
    console.log(pathname);
  }

  onSearch = (value) => {
    value = value.trim();
    let splitStr = [' ', ','].find((item) => value.includes(item));
    if (splitStr) {
      // 分割为数组
      let arr = value.split(splitStr);
      if (lib.isCart(arr[0])) {
        console.log('批量车号');
      } else if (lib.isGZ(arr[0])) {
        console.log('批量冠号');
      }
      return;
    }

    if (lib.isCart(value)) {
      console.log('车号', value);
      return;
    }
    if (lib.isGZ(value)) {
      console.log('冠字', value);
      return;
    }
    if (lib.isReel(value)) {
      console.log('轴号', value);
      return;
    }

    console.log('input', value); // eslint-disable-line
  };

  // onPressEnter = value => {
  //   console.log('input', value); // eslint-disable-line
  // };

  render() {
    /**
     * 是否以完整版打包发布
     * 精简版在header不包含全局搜索，不含质量/生产相关的其它消息提示功能。
     * */
    const FULL_MODE = BUILD_TYPE !== 'lite';

    return (
      FULL_MODE && (
        <HeaderSearch
          className={cx('action', 'search')}
          defaultOpen={true}
          placeholder={formatMessage({
            id: 'component.globalHeader.search'
          })}
          onSearch={this.onSearch}
          // onPressEnter={this.onPressEnter}
        />
      )
    );
  }
}
