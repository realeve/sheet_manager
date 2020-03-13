import React from 'react';
import HeaderSearch from '@/components/HeaderSearch';
import { formatMessage } from 'umi/locale';
import styles from './index.less';
import * as lib from '@/utils/lib';
import router from 'umi/router';
import { useDebounce } from 'react-use';

import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

let getRouter = () => {
  let { pathname } = window.location;
  return pathname;
};

/**
 * 是否以完整版打包发布
 * 精简版在header不包含全局搜索，不含质量/生产相关的其它消息提示功能。
 * */
const FULL_MODE = BUILD_TYPE !== 'lite';

export let onSearch = value => {
  value = value.trim().toUpperCase();
  let splitStr = [' ', ','].find(item => value.includes(item));
  if (splitStr) {
    // 分割为数组
    let arr = value.split(splitStr);
    if (lib.isCart(arr[0])) {
      console.log('批量车号');
    } else if (lib.isGZ(arr[0])) {
      console.log('批量冠号');
    }
    return false;
  }

  let pathname = getRouter();

  if (lib.isCart(value)) {
    if (pathname == '/search/image') {
      router.push('/search/image#' + value);
    } else {
      router.push('/search#' + value);
    }
    return true;
  }

  if (lib.isPlate(value) || lib.isReel(value) || lib.isGZ(value)) {
    router.push('/search#' + value);
    return true;
  }

  console.log('全局搜索', value); // eslint-disable-line
  return lib.mayBeCartOrReel(value);
};

function SearchComponent() {
  let pathname = getRouter();
  console.log('当前路由:', pathname);

  const [state, setState] = useState('');
  useDebounce(
    () => {
      onSearch(state);
    },
    800,
    [state]
  );

  return (
    FULL_MODE && (
      <HeaderSearch
        className={cx('action', 'search')}
        defaultOpen={true}
        placeholder={formatMessage({
          id: 'component.globalHeader.search',
        })}
        onSearch={val => {
          console.log(val);
          setState(val.trim());
        }}
      />
    )
  );
}

export default React.memo(SearchComponent);
