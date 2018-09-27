import React, { Component } from "react";
import { Button } from "antd";

import SortableTree from "react-sortable-tree";
import "react-sortable-tree/style.css";
import FileExplorerTheme from "react-sortable-tree-theme-minimal";

import * as treeUtil from "./tree-data-utils";
import * as db from "../service";
import styles from "../index.less";

class MenuPreview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: true,
      treeData: [],
      shouldCopyOnOutsideDrop: false,
      externalNodeType: props.externalNodeType
    };
  }

  // 初始化数据
  initData = async () => {
    let treeData = await db.getMenuSettingByIdx();
    this.setState({ treeData });
  };

  componentDidMount() {
    this.initData();
  }

  // 菜单层级调整
  onTreeChange = treeData => {
    this.setState({ treeData });
    console.log("菜单项调整：", treeData);
  };

  // 展开所有
  expandAll = () => {
    let { expanded, treeData } = this.state;
    treeData = treeUtil.toggleExpandedForAll({ expanded, treeData });
    this.setState({ treeData, expanded: !expanded });
  };

  render() {
    const { externalNodeType, shouldCopyOnOutsideDrop, treeData } = this.state;
    return (
      <>
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
      </>
    );
  }
}

MenuPreview.defaultProps = {
  externalNodeType: "shareNodeType"
};

export default MenuPreview;
