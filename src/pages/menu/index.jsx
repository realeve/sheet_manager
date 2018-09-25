import React, { Component } from "react";
import { connect } from "dva";
import { Row, Col, Card, Input, Tabs, Button, Divider } from "antd";

import SortableTree from "react-sortable-tree";
import "react-sortable-tree/style.css";
import FileExplorerTheme from "react-sortable-tree-theme-minimal";
// import FileExplorerTheme from "react-sortable-tree-theme-full-node-drag";
import * as treeUtil from "./tree-data-utils";
import * as db from "./service";

import styles from "./index.less";
const Search = Input.Search;

const R = require("ramda");

class VTree extends Component {
  constructor(props) {
    super(props);

    this.state = {
      expanded: true,
      treeData: [],
      treeDataLeft: [],
      shouldCopyOnOutsideDrop: false,
      menuList: [],
      searchValue: ""
    };
  }

  // 初始化数据
  initData = async () => {
    db.getMenuLeft().then(menuList => {
      this.setState({ menuList });
      this.handleMenuLeft(this.state.searchValue, menuList);
    });
    let treeData = await db.getMenuSettingByIdx();
    this.setState({ treeData });
  };

  componentDidMount() {
    this.initData();
  }

  // 菜单层级调整
  onTreeChange = treeData => {
    this.setState({ treeData });
    console.log(treeData);
  };

  // 展开所有
  expandAll = () => {
    let { expanded, treeData } = this.state;
    treeData = treeUtil.toggleExpandedForAll({ expanded, treeData });
    this.setState({ treeData, expanded: !expanded });
  };

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
    const getNodeKey = ({ treeIndex }) => treeIndex;
    let { treeDataLeft } = R.clone(this.state);
    treeDataLeft = treeUtil.removeNodeAtPath({
      treeData: treeDataLeft,
      path,
      getNodeKey
    });
    this.setState({ treeDataLeft });
  };

  render() {
    const externalNodeType = "shareNodeType";
    const {
      shouldCopyOnOutsideDrop,
      treeData,
      treeDataLeft,
      searchValue
    } = this.state;

    return (
      <Card title="菜单设置">
        <Row>
          <Col md={8} sm={24}>
            <div className={styles.action}>
              <Search
                placeholder="搜索菜单项"
                defaultValue={searchValue}
                onSearch={this.filterMenuList}
                onChange={this.searchChange}
                style={{ width: "calc(80% - 10px)" }}
              />
            </div>
            {treeDataLeft.length > 0 && (
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
                        icon="delete"
                        onClick={() => this.removeMenuItem(treeItem)}
                      />
                    ]
                  })}
                />
              </div>
            )}
            {treeDataLeft.length === 0 && (
              <div className={styles.notSearch}>未搜索到菜单项</div>
            )}
          </Col>
          <Col md={8} sm={24}>
            <div className={styles.action}>
              <Button type="primary" onClick={this.expandAll}>
                {this.state.expanded ? "全部展开" : "全部折叠"}
              </Button>
            </div>
            <div style={{ height: 500 }} className={styles.container}>
              <SortableTree
                treeData={treeData}
                onChange={this.onTreeChange}
                theme={FileExplorerTheme}
                rowHeight={32}
                dndType={externalNodeType}
                shouldCopyOnOutsideDrop={shouldCopyOnOutsideDrop}
              />
            </div>
          </Col>
        </Row>
      </Card>
    );
  }
}

function mapStateToProps(state) {
  return {
    loading: state.loading.models.menu,
    ...state.table
  };
}

export default connect(mapStateToProps)(VTree);
