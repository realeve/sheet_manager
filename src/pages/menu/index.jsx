import React, { Component } from "react";
import { connect } from "dva";
import { Row, Col, Card } from "antd";

import MenuItemList from "./components/MenuItemList.jsx";
import MenuPreview from "./components/MenuPreview.jsx";
import MenuList from "./components/MenuList.jsx";
import * as db from "./service";

class VTree extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menuDetail: [],
      editMode: false,
      uid: props.uid,
      menuList: []
    };
  }

  componentDidMount() {
    this.initData();
  }

  initData = async () => {
    let { data } = await db.getBaseMenuList();
    let menuList = data.map(item => {
      item.detail = JSON.parse(item.detail);
      return item;
    });
    this.setState({
      menuList
    });
  };

  editMenu = async (menuDetail, mode) => {
    if (mode === "edit") {
      this.setState({ menuDetail, editMode: true });
    } else if (mode === "del") {
      this.reset();
    }
  };

  reset = () => {
    this.setState({
      editMode: false,
      menuDetail: {
        title: "",
        detail: [],
        id: 0
      }
    });
    this.initData();
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
              onNew={this.reset}
              uid={this.state.uid}
            />
          </Col>
          <Col md={8} sm={24}>
            <MenuList
              onEdit={this.editMenu}
              uid={this.state.uid}
              menuList={this.state.menuList}
            />
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
