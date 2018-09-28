import React, { Component } from "react";
import { connect } from "dva";
import { Row, Col, Card } from "antd";

import MenuItemList from "./components/MenuItemList.jsx";
import MenuPreview from "./components/MenuPreview.jsx";
import MenuList from "./components/MenuList.jsx";

const R = require("ramda");

class VTree extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menuDetail: [],
      editMode: false,
      uid: props.uid
    };
  }

  editMenu = menuDetail => {
    this.setState({ menuDetail, editMode: true });
  };

  newMenu = () => {
    this.setState({
      editMode: false,
      menuDetail: {
        title: "",
        detail: [],
        id: 0
      }
    });
  };

  render() {
    const externalNodeType = "shareNodeType";
    const { menuDetail, editMode } = this.state;
    return (
      <Card title="菜单设置">
        <Row>
          <Col md={8} sm={24}>
            <MenuItemList externalNodeType={externalNodeType} />
          </Col>
          <Col md={8} sm={24}>
            <MenuPreview
              externalNodeType={externalNodeType}
              menuDetail={menuDetail}
              editMode={editMode}
              onNew={this.newMenu}
              uid={this.state.uid}
            />
          </Col>
          <Col md={8} sm={24}>
            <MenuList onEdit={this.editMenu} uid={this.state.uid} />
          </Col>
        </Row>
      </Card>
    );
  }
}

function mapStateToProps(state) {
  return {
    loading: state.loading.models.menu,
    ...state.table,
    uid: state.common.userSetting.uid
  };
}

export default connect(mapStateToProps)(VTree);
