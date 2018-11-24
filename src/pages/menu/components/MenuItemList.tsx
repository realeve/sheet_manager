import React, { Component } from 'react';
import { Input, Button, Popconfirm, Icon, notification } from 'antd';

import SortableTree from 'react-sortable-tree';
import 'react-sortable-tree/style.css';
import FileExplorerTheme from 'react-sortable-tree-theme-minimal';
import * as treeUtil from './tree-data-utils';

import * as db from '../service';
import styles from '../index.less';
import MenuItem, { TMenuItem } from './MenuItem';

const Search = Input.Search;
const R = require('ramda');

interface IMenuState {
  expanded: boolean;
  treeDataLeft: Array<any>;
  shouldCopyOnOutsideDrop: boolean;
  menuList: Array<any>;
  searchValue: string;
  externalNodeType: any;
  showMenuItem: boolean;
  editMode: boolean;
  menuItem: TMenuItem | {};
  treeIndex: number | string;
}
interface IMenuProps {}

class MenuItemList extends Component<IMenuProps, IMenuState> {
  constructor(props) {
    super(props);

    this.state = {
      expanded: true,
      treeDataLeft: [],
      shouldCopyOnOutsideDrop: false,
      menuList: [],
      searchValue: '',
      externalNodeType: props.externalNodeType,
      showMenuItem: false,
      editMode: false,
      menuItem: {},
      treeIndex: null
    };
  }

  // 初始化数据
  initData = async () => {
    let { data: menuList } = await db.getBaseMenuItem();
    this.setState({ menuList });
    this.handleMenuLeft(this.state.searchValue, menuList);
  };

  componentDidMount() {
    this.initData();
  }

  // 处理左侧数据
  handleMenuLeft = (searchValue, menuList) => {
    if (searchValue.length === 0) {
      this.setState({
        treeDataLeft: menuList
      });
      return;
    }
    let treeDataLeft = R.filter(
      ({ title, pinyin, pinyin_full }) =>
        pinyin.includes(searchValue) ||
        pinyin_full.includes(searchValue) ||
        title.includes(searchValue)
    )(menuList);
    this.setState({ treeDataLeft });
  };

  // 菜单项搜索过滤
  searchChange = (e) => {
    const searchValue = e.target.value.trim();
    this.handleMenuLeft(searchValue, this.state.menuList);
    this.setState({ searchValue });
  };

  // 移除菜单项
  removeMenuItem = async ({ path }) => {
    let { treeDataLeft } = R.clone(this.state);
    let { data } = await db.delBaseMenuItem(treeDataLeft[path].id);
    if (data[0].affected_rows === 0) {
      this.noticeError();
      return;
    }
    treeDataLeft = treeUtil.removeNodeAtPath({
      treeData: treeDataLeft,
      path,
      getNodeKey: treeUtil.getNodeKey
    });

    this.setState({ treeDataLeft });
    notification.success({
      message: '系统提示',
      description: '菜单项删除成功.'
    });
  };

  // 编辑菜单项
  editMenuItem = ({ path }) => {
    let { treeDataLeft } = R.clone(this.state);
    let { treeIndex } = treeUtil.getNodeAtPath({
      treeData: treeDataLeft,
      path,
      getNodeKey: treeUtil.getNodeKey
    });
    this.setState({
      menuItem: treeDataLeft[treeIndex],
      treeIndex,
      editMode: true
    });

    this.toggleMenuItem(true);
  };

  addMenuItem = () => {
    this.setState({
      editMode: false
    });
    this.toggleMenuItem(true);
  };

  toggleMenuItem = (showMenuItem) => {
    this.setState({
      showMenuItem
    });
  };

  noticeError = () => {
    // 数据插入失败
    notification.error({
      message: '系统提示',
      description: '菜单项调整失败，请稍后重试.'
    });
  };

  changeMenuItem = async (menuItem) => {
    let { treeDataLeft, treeIndex, editMode } = this.state;
    // 如果未做任何修改，不继续更新/增加菜单项
    if (
      (editMode && R.equals(menuItem, treeDataLeft[treeIndex])) ||
      menuItem.title.length === 0 // 标题信息必须输入
    ) {
      return;
    }

    if (!editMode) {
      // 新增数据
      let { data } = await db.addBaseMenuItem(menuItem);
      if (data[0].affected_rows === 0) {
        this.noticeError();
        return;
      }
      menuItem.id = data[0].id;

      // 在开头插入数据
      let { treeData } = treeUtil.insertNode({
        treeData: treeDataLeft,
        depth: 0,
        minimumTreeIndex: 0,
        newNode: menuItem,
        getNodeKey: treeUtil.getNodeKey
      });
      treeDataLeft = treeData;
    } else {
      let params = R.pick('icon,title,url,pinyin,pinyin_full'.split(','))(
        menuItem
      );
      params._id = menuItem.id;
      await db.setBaseMenuItem(params).catch((e) => {
        this.noticeError();
      });
      // 更新结点,对于树形结构适用
      let node = treeDataLeft[treeIndex];

      treeDataLeft = treeUtil.changeNodeAtPath({
        treeData: treeDataLeft,
        path: [treeIndex],
        getNodeKey: treeUtil.getNodeKey,
        newNode: { ...node, ...menuItem }
      });
    }

    notification.success({
      message: '系统提示',
      description: '菜单项调整成功.'
    });
    //更新完毕后刷新相关状态的数据
    this.setState({
      treeDataLeft,
      menuItem
    });
    return;
  };

  render() {
    const {
      shouldCopyOnOutsideDrop,
      treeDataLeft,
      searchValue,
      externalNodeType
    } = this.state;

    const TreeList = () =>
      treeDataLeft.length === 0 ? (
        <div className={styles.notSearch}>未搜索到菜单项</div>
      ) : (
        <div
          style={{ height: 500, marginRight: 20 }}
          className={styles.container}>
          <SortableTree
            treeData={treeDataLeft}
            onChange={() => {}}
            theme={FileExplorerTheme}
            rowHeight={32}
            dndType={externalNodeType}
            shouldCopyOnOutsideDrop={shouldCopyOnOutsideDrop}
            generateNodeProps={(treeItem) => ({
              buttons: [
                <Button
                  size="small"
                  icon="edit"
                  title="编辑"
                  style={{ marginRight: 5 }}
                  onClick={() => this.editMenuItem(treeItem)}
                />,
                <Popconfirm
                  title="确定删除该菜单项?"
                  okText="是"
                  cancelText="否"
                  icon={
                    <Icon type="question-circle-o" style={{ color: 'red' }} />
                  }
                  onConfirm={() => this.removeMenuItem(treeItem)}>
                  <Button size="small" title="删除" icon="delete" />
                </Popconfirm>
              ]
            })}
          />
        </div>
      );

    let { showMenuItem, menuItem, editMode } = this.state;

    if (!editMode) {
      menuItem = {
        title: '',
        url: '',
        icon: ''
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
        <TreeList />
      </>
    );
  }
}

MenuItemList.defaultProps = {
  externalNodeType: 'shareNodeType'
};

export default MenuItemList;
