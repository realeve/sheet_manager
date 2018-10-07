import React, { PureComponent } from 'react';
import { Layout } from 'antd';
import pathToRegexp from 'path-to-regexp';
import classNames from 'classnames';
import Link from 'umi/link';
import styles from './index.less';
import BaseMenu, { getMenuMatches } from './BaseMenu';
import * as setting from '@/utils/setting';
import { getFlatMenuKeys, getCurKey } from './util';
import { urlToList } from '../_utils/pathTools';
const { Sider } = Layout;
const R = require('ramda');
/**
 * 获得菜单子节点
 * @memberof SiderMenu
 */
const getDefaultCollapsedSubMenus = ({ breadcrumbList }) => {
  let selectedKeys = getCurKey(breadcrumbList);
  return {
    selectedKeys: [selectedKeys],
    openKeys: R.compose(
      R.init,
      R.uniq,
      R.tail,
      R.map(item => item.slice(1)),
      urlToList
    )(selectedKeys)
  };
};

export default class SiderMenu extends PureComponent {
  constructor(props) {
    super(props);
    this.flatMenuKeys = getFlatMenuKeys(props.menuData);
    this.state = getDefaultCollapsedSubMenus(props);
  }

  static getDerivedStateFromProps(props, state) {
    const { pathname } = state;
    if (props.location.pathname !== pathname) {
      let nextState = getDefaultCollapsedSubMenus(props);
      return {
        pathname: props.location.pathname,
        ...nextState
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
    const moreThanOne =
      openKeys.filter(openKey => this.isMainMenu(openKey)).length > 1;
    this.setState({
      openKeys: moreThanOne ? [openKeys.pop()] : [...openKeys]
    });
  };

  render() {
    const { logo, collapsed, onCollapse, fixSiderbar, theme } = this.props;
    const { selectedKeys, openKeys } = this.state;
    const defaultProps = collapsed ? {} : { selectedKeys, openKeys };
    const siderClassName = classNames(styles.sider, {
      [styles.fixSiderbar]: fixSiderbar,
      [styles.light]: theme === 'light'
    });

    return (
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        breakpoint="lg"
        onCollapse={onCollapse}
        width={256}
        theme={theme}
        className={siderClassName}>
        <div className={styles.logo} id="logo">
          <Link to="/">
            <img src={logo} alt="logo" />
            <h1>{setting.systemName}</h1>
          </Link>
        </div>
        <BaseMenu
          {...this.props}
          mode="inline"
          handleOpenChange={this.handleOpenChange}
          onOpenChange={this.handleOpenChange}
          style={{ padding: '16px 0', width: '100%' }}
          {...defaultProps}
        />
      </Sider>
    );
  }
}
