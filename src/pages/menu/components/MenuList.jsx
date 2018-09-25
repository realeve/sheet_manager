import React, { Component } from "react";
import { Input, Button, Popconfirm, Icon } from "antd";

import SortableTree from "react-sortable-tree";
import "react-sortable-tree/style.css";
import FileExplorerTheme from "react-sortable-tree-theme-minimal";
import * as treeUtil from "../tree-data-utils";

import * as db from "../service";
import styles from "../index.less";

const Search = Input.Search;
const R = require("ramda");
const getNodeKey = ({ treeIndex }) => treeIndex;

export default class MenuItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      expanded: true,
      treeDataLeft: [],
      shouldCopyOnOutsideDrop: false,
      menuList: [],
      searchValue: "",
      externalNodeType: props.externalNodeType
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
    let menuItem = {
      title: "菜单n",
      id: 29
    };
    treeDataLeft = treeUtil.changeNodeAtPath({
      treeData: treeDataLeft,
      path,
      getNodeKey,
      newNode: { ...node, ...menuItem }
    });
    this.setState({ treeDataLeft });
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

    return (
      <>
        <div className={styles.action}>
          <Search
            placeholder="搜索菜单项"
            defaultValue={searchValue}
            onSearch={this.filterMenuList}
            onChange={this.searchChange}
            style={{ width: "calc(80% - 10px)" }}
          />
        </div>
        <TreeList />
      </>
    );
  }
}
