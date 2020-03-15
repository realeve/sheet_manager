import React from 'react';
import { Drawer } from 'antd';
import SiderMenu from './SiderMenu';
import { getFlatMenuKeys } from './util';
import { connect } from 'dva';

const SiderMenuWrapper = props => {
  const { isMobile, menuData, collapsed, onCollapse, setting } = props;
  const flatMenuKeys = getFlatMenuKeys(menuData);

  return isMobile ? (
    <Drawer
      visible={!collapsed}
      placement="left"
      onClose={() => onCollapse(true)}
      style={{
        padding: 0,
        height: '100vh',
      }}
    >
      <SiderMenu {...{ isMobile, menuData, collapsed, onCollapse, setting } } flatMenuKeys={flatMenuKeys} collapsed={isMobile ? false : collapsed} />
    </Drawer>
  ) : (
    <SiderMenu {...props} flatMenuKeys={flatMenuKeys} />
  );
};

export default connect(({ setting }) => ({ setting }))(SiderMenuWrapper);
