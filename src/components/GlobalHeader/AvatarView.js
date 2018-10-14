import React from 'react';
import { FormattedMessage } from 'umi/locale';

import { Menu, Icon, Spin, Dropdown, Avatar } from 'antd';

import styles from './AvatarView.less';

function AvatarView({ userSetting, onMenuClick }) {
  if (!userSetting.fullname) {
    return <Spin size="small" style={{ marginLeft: 8, marginRight: 8 }} />;
  }
  const FULL_MODE = BUILD_TYPE !== 'lite';

  const menu = (
    <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
      {FULL_MODE && (
        <Menu.Item key="userCenter">
          <Icon type="user" />
          <FormattedMessage
            id="menu.account.center"
            defaultMessage="account center"
          />
        </Menu.Item>
      )}
      <Menu.Item key="userinfo">
        <Icon type="setting" />
        <FormattedMessage
          id="menu.account.settings"
          defaultMessage="account settings"
        />
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout">
        <Icon type="logout" />
        <FormattedMessage id="menu.account.logout" defaultMessage="logout" />
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown overlay={menu}>
      <span className={`${styles.action} ${styles.account}`}>
        <Avatar
          // size="small"
          className={styles.avatar}
          src={userSetting.avatar}
          alt="avatar"
        />
        <span className={styles.name}>{userSetting.fullname}</span>
      </span>
    </Dropdown>
  );
}

export default AvatarView;
