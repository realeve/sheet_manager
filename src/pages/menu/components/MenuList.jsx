import React, { Component } from "react";
import { Input, Button, Popconfirm, Icon } from "antd";

import SortableTree from "react-sortable-tree";
import "react-sortable-tree/style.css";
import FileExplorerTheme from "react-sortable-tree-theme-minimal";
import * as treeUtil from "../tree-data-utils";

import * as db from "../service";
import styles from "../index.less";
import MenuItem from "./MenuItem.jsx";

const Search = Input.Search;
const R = require("ramda");
const getNodeKey = ({ treeIndex }) => treeIndex;

class MenuList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      expanded: true,
      treeDataLeft: [],
      shouldCopyOnOutsideDrop: false,
      menuList: [],
      searchValue: "",
      externalNodeType: props.externalNodeType,
      showMenuItem: false,
      treeIndex: 0,
      editMode: false
    };
  }

  // 初始化数据
  initData = async () => {
    let menuList = await db.getMenuLeft();
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

    let treeDataLeft = R.filter(({ title }) => title.includes(searchValue))(
      menuList
    );
    this.setState({ treeDataLeft });
  };

  // 菜单项搜索过滤
  searchChange = e => {
    const searchValue = e.target.value.trim();
    this.handleMenuLeft(searchValue, this.state.menuList);
    this.setState({ searchValue });
  };

  // 移除菜单项
  removeMenuItem = ({ node, path }) => {
    let { treeDataLeft } = R.clone(this.state);
    treeDataLeft = treeUtil.removeNodeAtPath({
      treeData: treeDataLeft,
      path,
      getNodeKey
    });
    this.setState({ treeDataLeft });
  };

  // 编辑菜单项
  editMenuItem = ({ node, path }) => {
    let { treeDataLeft } = R.clone(this.state);
    let { treeIndex } = treeUtil.getNodeAtPath({
      treeData: treeDataLeft,
      path,
      getNodeKey
    });
    this.setState({
      treeIndex,
      editMode: true
    });

    console.log(treeIndex);
    this.toggleMenuItem(true);
    return;
    treeDataLeft = treeUtil.changeNodeAtPath({
      treeData: treeDataLeft,
      path,
      getNodeKey,
      newNode: { ...node, ...menuItem }
    });
    this.setState({ treeDataLeft });
  };

  addMenuItem = () => {
    this.setState({
      editMode: false,
      treeIndex: null
    });
    this.toggleMenuItem(true);
  };

  toggleMenuItem = showMenuItem => {
    this.setState({
      showMenuItem
    });
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
        <div style={{ height: 500 }} className={styles.container}>
          <SortableTree
            treeData={treeDataLeft}
            onChange={() => {}}
            theme={FileExplorerTheme}
            rowHeight={32}
            dndType={externalNodeType}
            shouldCopyOnOutsideDrop={shouldCopyOnOutsideDrop}
            generateNodeProps={treeItem => ({
              buttons: [
                <Button
                  size="small"
                  icon="edit"
                  style={{ marginRight: 5 }}
                  onClick={() => this.editMenuItem(treeItem)}
                />,
                <Popconfirm
                  title="确定删除该菜单项?"
                  okText="是"
                  cancelText="否"
                  icon={
                    <Icon type="question-circle-o" style={{ color: "red" }} />
                  }
                  onConfirm={() => this.removeMenuItem(treeItem)}
                >
                  <Button size="small" icon="delete" />
                </Popconfirm>
              ]
            })}
          />
        </div>
      );

    const { showMenuItem, treeIndex, editMode } = this.state;
    let menuItem = treeDataLeft[treeIndex];
    if (R.isNil(menuItem)) {
      menuItem = {
        title: "",
        url: "",
        icon: ""
      };
    }

    return (
      <>
        <MenuItem
          visible={showMenuItem}
          menuItem={menuItem}
          onCancel={this.toggleMenuItem}
          editMode={editMode}
        />
        <div className={styles.action}>
          <Search
            prefix={<Icon type="search" />}
            placeholder="搜索菜单项"
            defaultValue={searchValue}
            onChange={this.searchChange}
            onSearch={this.addMenuItem}
            enterButton={<Icon type="plus" />}
            style={{ width: "calc(80% - 10px)" }}
          />
        </div>
        <TreeList />
      </>
    );
  }
}

MenuList.defaultProps = {
  externalNodeType: "shareNodeType"
};

export default MenuList;
