import React, { useState, useEffect } from 'react';
import { Menu, Dropdown, Icon } from 'antd';
import * as dbMenu from '@/pages/menu/service';
// import { FormattedMessage } from 'umi/locale';
import { connect } from 'dva';
import userTool from '@/utils/users';
import * as R from 'ramda';
import styles from './SystemMenu.less';

function SystemMenu({ logo, uid, menu_title, dispatch }) {
  const [menuList, setMenuList] = useState([]);
  const [curMenuId, setCurMenuId] = useState([]);
  useEffect(() => {
    dbMenu.getBaseMenuList().then(({ data }) => {
      setMenuList(data);
      let menu_id = R.findIndex(R.propEq('title', menu_title))(data);
      setCurMenuId(menu_id);
    });
  }, []);

  // 切换系统名称及菜单
  const onMenuClick = ({ key: menu_id }) => {
    // if (menu_id === '-1') {
    //   return;
    // }

    // 当前id
    setCurMenuId(menu_id);

    let menu = JSON.parse(menuList[menu_id].detail);
    let menu_title = menuList[menu_id].title;

    let { data } = userTool.getUserSetting();
    data.setting.menu = menu;
    userTool.saveUserSetting(data, menu_title);

    dispatch({
      type: 'common/setStore',
      payload: {
        userSetting: {
          menu,
          menu_title,
        },
      },
    });

    dbMenu.setSysUser({
      menu_id,
      _id: uid,
    });
  };

  const menu = (
    <div className={styles.syslist}>
      <Menu selectedKeys={[String(curMenuId)]} onClick={onMenuClick}>
        {menuList.map(({ title }, id) => (
          <Menu.Item key={String(id)}>{title}</Menu.Item>
        ))}
      </Menu>
    </div>
  );
  return (
    <Dropdown overlay={menu}>
      <div>
        <img src={logo} alt="logo" />
        <h1>{menu_title}</h1>
        <Icon type="down" style={{ color: '#fff', marginLeft: 10 }} />
      </div>
    </Dropdown>
  );
}

export default connect(({ common: { userSetting } }) => ({
  uid: userSetting.uid,
  menu_title: userSetting.menu_title,
}))(SystemMenu);
