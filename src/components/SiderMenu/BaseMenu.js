import React, { PureComponent } from 'react';
import { Menu } from 'antd';
import { Icon } from '@ant-design/compatible';
import Link from 'umi/link';
import styles from './index.less';
import { getFlatMenuKeys } from './util';

const { SubMenu } = Menu;

// Allow menu.js config icon as string or ReactNode
//   icon: 'setting',
//   icon: 'http://demo.com/icon.png',
//   icon: <Icon type="setting" />,
const getIcon = icon => {
  if (typeof icon === 'string' && icon.indexOf('http') === 0) {
    return <img src={icon} alt="icon" className={styles.icon} />;
  }
  if (typeof icon === 'string' && icon.length) {
    return <Icon type={icon} />;
  }
  return icon;
};

export default class BaseMenu extends PureComponent {
  constructor(props) {
    super(props);
    this.flatMenuKeys = getFlatMenuKeys(props.menuData);
  }

  /**
   * 获得菜单子节点
   * @memberof SiderMenu
   */
  getNavMenuItems = (menusData, parent) => {
    if (!menusData) {
      return [];
    }
    return menusData
      .filter(item => item.name && !item.hideInMenu)
      .map(item => {
        // make dom
        const ItemDom = this.getSubMenuOrItem(item, parent);
        return this.checkPermissionItem(item.authority, ItemDom);
      })
      .filter(item => item);
  };

  /**
   * get SubMenu or Item
   */
  getSubMenuOrItem = item => {
    // doc: add hideChildrenInMenu
    if (item.children && !item.hideChildrenInMenu && item.children.some(child => child.name)) {
      return (
        <SubMenu
          title={
            item.icon.length ? (
              <span>
                {getIcon(item.icon)}
                <span>{item.name}</span>
              </span>
            ) : (
              item.name
            )
          }
          key={item.key}
        >
          {this.getNavMenuItems(item.children)}
        </SubMenu>
      );
    }
    return <Menu.Item key={item.key}>{this.getMenuItemPath(item)}</Menu.Item>;
  };

  /**
   * 判断是否是http链接.返回 Link 或 a
   * Judge whether it is http link.return a or Link
   * @memberof SiderMenu
   */
  getMenuItemPath = item => {
    const name = item.name; //formatMessage({ id: item.locale });
    const itemPath = this.conversionPath(item.path);
    const icon = getIcon(item.icon);
    const { target } = item;
    // Is it a http link
    if (/^https?:\/\//.test(itemPath)) {
      return (
        <a href={itemPath} target={target}>
          {icon}
          <span>{name}</span>
        </a>
      );
    }
    const { location, isMobile, onCollapse } = this.props;
    return (
      <Link
        to={itemPath}
        target={target}
        replace={itemPath === location.pathname}
        onClick={
          isMobile
            ? () => {
                onCollapse(true);
              }
            : undefined
        }
      >
        {icon}
        <span>{name}</span>
      </Link>
    );
  };

  // permission to check
  checkPermissionItem = (authority, ItemDom) => {
    const { Authorized } = this.props;
    if (Authorized && Authorized.check) {
      const { check } = Authorized;
      return check(authority, ItemDom);
    }
    return ItemDom;
  };

  conversionPath = path => {
    // bug fix 20190309
    if (path && path.indexOf('http') >= 0) {
      return path;
    }
    return `/${path || ''}`.replace(/\/+/g, '/');
  };

  render() {
    let { openKeys, theme, mode, selectedKeys, handleOpenChange, style, menuData } = this.props;
    const needOpenKeys = openKeys ? { openKeys } : {};
    const defaultProps = {
      theme,
      mode,
      selectedKeys,
      style,
      key: 'Menu',
      className: mode === 'horizontal' ? 'top-nav-menu' : '',
    };
    return (
      <Menu
        onOpenChange={handleOpenChange}
        // openKeys={openKeys || ['']}
        {...needOpenKeys}
        {...defaultProps}
      >
        {this.getNavMenuItems(menuData)}
      </Menu>
    );
  }
}
