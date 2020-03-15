import React, { PureComponent } from 'react';
import { Layout } from 'antd';
import styles from './index.less';
import BaseMenu from './BaseMenu';
// import * as setting from '@/utils/setting';
import { getFlatMenuKeys, getCurKey, getFlatMenu } from './util';
import { urlToList } from '../_utils/pathTools';
import MenuSearch from '@/components/HeaderSearch/menu';
import router from 'umi/router';
import SystemMenu from './SystemMenu';
import { onSearch as onCartSearch } from '../GlobalHeader/SearchComponent';
import classNames from 'classnames/bind';
import { formatMessage } from 'umi/locale';

const cx = classNames.bind(styles);

const { Sider } = Layout;
const R = require('ramda');

/**
 * 获得菜单子节点
 * @memberof SiderMenu
 */
const getDefaultCollapsedSubMenus = ({ breadcrumbList, menuData }) => {
  let selectedKeys = getCurKey(breadcrumbList);
  return {
    selectedKeys: [selectedKeys],
    openKeys: R.compose(
      R.init,
      R.uniq,
      R.tail,
      R.map(item => item.slice(1)),
      urlToList
    )(selectedKeys),
    menuData,
  };
};

export default class SiderMenu extends PureComponent {
  constructor(props) {
    super(props);
    this.flatMenuKeys = getFlatMenuKeys(props.menuData);
    const defaultState = getDefaultCollapsedSubMenus(props);
    this.state = {
      ...defaultState,
      searchValue: '',
    };
    this.flatMenu = getFlatMenu(props.menuData);
  }

  static getDerivedStateFromProps(props, state) {
    const { pathname } = state;
    if (!R.equals(props.menuData, state.menuData) && state.searchValue.length === 0) {
      let nextState = getDefaultCollapsedSubMenus(props);
      return {
        pathname: props.location.pathname,
        ...nextState,
      };
    } else if (props.nextUrl !== state.nextUrl || props.location.pathname !== pathname) {
      let nextState = getDefaultCollapsedSubMenus(props);
      return {
        pathname: props.location.pathname,
        ...nextState,
        searchValue: '',
        nextUrl: props.nextUrl,
      };
    }
    return null;
  }

  isMainMenu = key => {
    const { menuData } = this.props;
    return menuData.some(item => {
      if (key) {
        return item.key === key || item.path === key;
      }
      return false;
    });
  };

  handleOpenChange = openKeys => {
    const moreThanOne = openKeys.filter(openKey => this.isMainMenu(openKey)).length > 1;
    this.setState({
      openKeys: moreThanOne ? [openKeys.pop()] : [...openKeys],
    });
  };

  onSearch = value => {
    let { menuData } = this.props;

    // 全局车号搜索

    if (onCartSearch(value)) {
      this.setState({ menuData, searchValue: value.toUpperCase() });
      return;
    }

    value = value.toLowerCase();
    const redirectRouter = func => {
      this.timeout = setTimeout(() => {
        func();
      }, 500);
    };
    if (value.length === 0) {
      this.setState({ menuData, searchValue: '' });
      return;
    }
    let filterMenuData = R.filter(
      ({ name, pinyin, pinyin_full }) =>
        pinyin.includes(value) || pinyin_full.includes(value) || name.includes(value)
    )(this.flatMenu);

    this.setState({
      menuData: filterMenuData,
      searchValue: value,
    });

    if (filterMenuData.length === 1) {
      const [{ path }] = filterMenuData;

      if (path.length) {
        if (path.includes('http://') || path.includes('https://')) {
          redirectRouter(() => {
            window.location.href = path;
          });
          return;
        }
        redirectRouter(() => {
          router.push(path);
        });
      }
    }
  };

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  render() {
    const { logo, collapsed, fixSiderbar, setting } = this.props;
    const { selectedKeys, openKeys, searchValue } = this.state;
    const defaultProps = { selectedKeys, openKeys }; //collapsed ? {} : { selectedKeys, openKeys };
    let theme = setting.navTheme; 

    const siderClassName = cx('sider', {
      fixSiderbar,
      light: theme === 'light',
    });

    const { menuData, ...baseMenuDefaultProps } = this.props;
    return (
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        breakpoint="lg"
        width={256}
        theme={theme}
        className={siderClassName}
      >
        <div className={styles.logo} id="logo">
          <SystemMenu logo={logo} />
        </div>
        <MenuSearch
          theme={theme}
          value={searchValue}
          collapsed={collapsed}
          onChange={this.onSearch}
          placeholder={formatMessage({
            id: 'component.globalHeader.search',
          })}
          style={{ marginTop: 5 }}
        />
        <BaseMenu
          {...baseMenuDefaultProps}
          menuData={this.state.menuData}
          mode="inline"
          handleOpenChange={this.handleOpenChange}
          onOpenChange={this.handleOpenChange}
          style={{ padding: '10px 0 16px 0', width: '100%' }}
          {...defaultProps}
          theme={theme}
        />
      </Sider>
    );
  }
}
