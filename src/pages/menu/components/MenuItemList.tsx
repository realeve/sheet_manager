import React, { Component } from 'react';
import { Input, notification } from 'antd';
import { Icon } from '@ant-design/compatible';
import { connect } from 'dva';
import * as treeUtil from './tree-data-utils';
import * as db from '../service';
import styles from '../index.less';
import MenuItem, { TMenuItem } from './MenuItem';
import TreeList from './TreeList';

import router from 'umi/router';

const Search = Input.Search;
const R = require('ramda');

export type TMenuList = Array<TMenuItem>;

interface IMenuItem extends TMenuItem {
  _id?: string | number;
}

interface IMenuState {
  searchValue: string;
  showMenuItem: boolean;
  editMode: boolean;
  menuItem: TMenuItem;
  treeIndex: number | string;
}

interface IMenuProps {
  externalNodeType: string;
  [key: string]: any;
}

@connect(({ common: { userSetting }, menu: { menuItemList, treeDataLeft } }) => ({
  userSetting,
  menuItemList,
  treeDataLeft,
}))
class MenuItemList extends Component<IMenuProps, IMenuState> {
  constructor(props) {
    super(props);
    this.state = {
      searchValue: '',
      showMenuItem: false,
      editMode: false,
      menuItem: { icon: '', title: '', url: '', id: 0, detail: '' },
      treeIndex: null,
    };
  }

  // 菜单项搜索过滤
  searchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue: string = e.target.value.trim();
    let treeDataLeft = this.props.menuItemList;
    if (searchValue.length) {
      treeDataLeft = R.filter(
        ({ title, pinyin, pinyin_full }) =>
          pinyin.includes(searchValue) ||
          pinyin_full.includes(searchValue) ||
          title.includes(searchValue)
      )(treeDataLeft);
    }
    this.setState({ searchValue });
    this.props.dispatch({
      type: 'menu/setStore',
      payload: {
        treeDataLeft,
      },
    });
  };

  // 编辑菜单项
  editMenuItem: ({ path: string }) => void = ({ path }) => {
    let { treeDataLeft } = R.clone(this.props);
    let { treeIndex } = treeUtil.getNodeAtPath({
      treeData: treeDataLeft,
      path,
      getNodeKey: treeUtil.getNodeKey,
    });
    this.setState({
      menuItem: treeDataLeft[treeIndex],
      treeIndex,
      editMode: true,
    });

    this.toggleMenuItem(true);
  };

  addMenuItem = () => {
    this.setState({
      editMode: false,
    });
    this.toggleMenuItem(true);
  };

  toggleMenuItem = showMenuItem => {
    this.setState({
      showMenuItem,
    });
  };

  noticeError = () => {
    // 数据插入失败
    notification.error({
      message: '系统提示',
      description: '菜单项调整失败，请稍后重试.',
    });
  };

  changeMenuItem: (menuitem: TMenuItem) => void = async menuItem => {
    let { treeIndex, editMode } = this.state;
    let { treeDataLeft } = this.props;
    // 如果未做任何修改，不继续更新/增加菜单项
    if (
      (editMode && R.equals(menuItem, treeDataLeft[treeIndex])) ||
      menuItem.title.length === 0 // 标题信息必须输入
    ) {
      return;
    }

    if (!editMode) {
      // 新增数据

      menuItem.uid = this.props.userSetting.uid;

      let { data } = await db.addBaseMenuItem(menuItem);
      if (data[0].affected_rows === 0) {
        this.noticeError();
        return;
      }
      menuItem.id = data[0].id;

      // 在开头插入数据
      let { treeData }: { treeData: TMenuList } = treeUtil.insertNode({
        treeData: treeDataLeft,
        depth: 0,
        minimumTreeIndex: 0,
        newNode: menuItem,
        getNodeKey: treeUtil.getNodeKey,
      });
      treeDataLeft = treeData;
    } else {
      let params: IMenuItem = R.pick('icon,title,url,pinyin,pinyin_full'.split(','))(menuItem);
      params._id = menuItem.id;

      await db.setBaseMenuItem(params).catch(e => {
        this.noticeError();
      });
      // 更新结点,对于树形结构适用
      let node: IMenuItem = treeDataLeft[treeIndex];

      treeDataLeft = treeUtil.changeNodeAtPath({
        treeData: treeDataLeft,
        path: [treeIndex],
        getNodeKey: treeUtil.getNodeKey,
        newNode: { ...node, ...menuItem },
      });
    }

    notification.success({
      message: '系统提示',
      description: '菜单项调整成功.',
    });
    //更新完毕后刷新相关状态的数据
    this.setState({
      menuItem,
    });
    this.props.dispatch({
      type: 'menu/setStore',
      payload: {
        treeDataLeft,
      },
    });
  };

  render() {
    const { searchValue } = this.state;
    const { userSetting, treeDataLeft } = this.props;

    // 普通用户（非超管，管理员）不允许编辑菜单
    if (userSetting.user_type > 2) {
      router.push('/403');
    }

    let { showMenuItem, menuItem, editMode } = this.state;

    if (!editMode) {
      menuItem = {
        id: 0,
        title: '',
        url: '',
        icon: '',
        detail: '',
      };
    }

    return (
      <>
        <MenuItem
          visible={showMenuItem}
          menuItem={menuItem}
          onCancel={this.toggleMenuItem}
          editMode={editMode}
          onChange={this.changeMenuItem}
        />
        <p className={styles.title}>1.菜单项列表</p>
        <div className={styles.action}>
          <Search
            prefix={<Icon type="search" />}
            placeholder="搜索菜单项(支持拼音检索)"
            defaultValue={searchValue}
            onChange={this.searchChange}
            onSearch={this.addMenuItem}
            enterButton={<Icon type="plus" />}
          />
        </div>
        <TreeList
          treeDataLeft={treeDataLeft}
          editMenuItem={this.editMenuItem}
          uid={userSetting.uid}
          dispatch={this.props.dispatch}
        />
      </>
    );
  }
}

export default MenuItemList;
