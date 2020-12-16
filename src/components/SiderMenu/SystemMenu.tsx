import React, { useState, useEffect } from 'react';
import { Menu, Dropdown, notification } from 'antd';
import * as dbMenu from '@/pages/menu/service';
// import { FormattedMessage } from 'umi/locale';
import { connect } from 'dva';
import userTool from '@/utils/users';
import * as R from 'ramda';
import { DEFAULT_MENU_ID, DEFAULT_MANAGER_ID } from '@/utils/setting';
import { DownCircleOutlined } from '@ant-design/icons';

const refreshMenu = (data, id = DEFAULT_MENU_ID) => {
  let menuId = window.localStorage.getItem('_userMenuId') || id;
  if (menuId == 'undefined') {
    menuId = id;
    window.localStorage.setItem('_userMenuId', String(id));
  }

  let menu = R.find(R.propEq('id', Number(menuId)))(data) || { detail: '[]' };
  return menu.detail;
};

function SystemMenu({ logo, uid, menu_title, dispatch }) {
  const [menuList, setMenuList] = useState([]);
  const [curMenuId, setCurMenuId] = useState([]);
  useEffect(() => {
    dbMenu
      .getBaseMenuList()
      .then(({ data }) => {
        setMenuList(data);

        let menu_id = R.findIndex(R.propEq('title', menu_title))(data);

        if (window.location.href.includes('/manage')) {
          menu_id = DEFAULT_MANAGER_ID;
        }
        setCurMenuId(menu_id);

        refreshMenu(data, menu_id);

        let menu = data[menu_id].detail;
        window.localStorage.setItem('_userMenu', JSON.stringify(menu));

        dispatch({
          type: 'common/setStore',
          payload: {
            userSetting: {
              menu,
              menu_title: data[menu_id].title,
            },
          },
        });
      })
      .catch(({ message, description, url }) => {
        notification.error({
          message,
          description: (
            <p>
              {description} <span>{url}</span>
            </p>
          ),
          duration: 10,
        });
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

    userTool.saveUserSetting(data, menu_title, menuList[menu_id].id);

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
      menu_id: menuList[menu_id].id,
      _id: uid,
    });
  };

  const menu = (
    <div
      style={{
        border: '1px solid #666',
        width: 200,
      }}
    >
      <Menu
        theme="dark"
        style={{ boxShadow: ' -3px 5px 2px rgba(0, 0, 0, 0.15)' }}
        selectedKeys={[String(curMenuId)]}
        onClick={onMenuClick}
      >
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
        {/* <Icon type="down" style={{ color: '#fff', marginLeft: 10 }} /> */}
        <DownCircleOutlined style={{ color: '#fff', marginLeft: 10 }} />
      </div>
    </Dropdown>
  );
}

export default connect(({ common: { userSetting } }) => ({
  uid: userSetting.uid,
  menu_title: userSetting.menu_title,
}))(SystemMenu);
