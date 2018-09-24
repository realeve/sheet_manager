import React, { Component } from "react";
import { connect } from "dva";
import { Row, Col, Card, Tabs } from "antd";

import SortableTree from "react-sortable-tree";
import "react-sortable-tree/style.css";
import FileExplorerTheme from "react-sortable-tree-theme-minimal";
// import FileExplorerTheme from "react-sortable-tree-theme-full-node-drag";

import styles from "./index.less";

class VTree extends Component {
  constructor(props) {
    super(props);

    this.state = {
      treeData: [
        {
          title: "Chicken",
          expanded: true,
          id: 23,
          children: [
            { title: "Egg", id: 24 },
            {
              title: "Test",
              id: 25
            }
          ]
        },
        {
          title: "Test2",
          id: 26,
          children: [
            { title: "Egg", id: 24 },
            {
              title: "Test",
              id: 25
            }
          ]
        }
      ]
    };
  }

  onTreeChange = treeData => {
    this.setState({ treeData });
    console.log(treeData);
  };

  render() {
    return (
      <Card title="菜单设置">
        <Row>
          <Col md={8} sm={24}>
            <div style={{ height: 500 }} className={styles.container}>
              <SortableTree
                treeData={this.state.treeData}
                onChange={this.onTreeChange}
                theme={FileExplorerTheme}
                rowHeight={35}
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
