import React, { Component } from "react";
import { connect } from "dva";
import { Row, Col, Card, Button } from "antd";

import * as db from "./service";
import MenuList from "./components/MenuList.jsx";
import MenuPreview from "./components/MenuPreview.jsx";

import styles from "./index.less";

const R = require("ramda");

class VTree extends Component {
  render() {
    const externalNodeType = "shareNodeType";
    return (
      <Card title="菜单设置">
        <Row>
          <Col md={8} sm={24}>
            <MenuList externalNodeType={externalNodeType} />
          </Col>
          <Col md={8} sm={24}>
            <MenuPreview externalNodeType={externalNodeType} />
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
