import React, { Component } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Button } from 'antd';

import MenuItemList from './components/MenuItemList';
import MenuPreview from './components/MenuPreview';
import MenuList from './components/MenuList';
import ChartLink from '@/components/ChartLink';
import * as db from './service';
import styles from './index.less';

import { TMenuList } from './components/MenuItemList';
import { TMenuItem } from './components/MenuItem';

interface ITreeProps {
  uid: number | string;
  loading: boolean;
  [key: string]: any;
}

interface ITreeState {
  menuDetail: TMenuItem;
  editMode: boolean;
  uid: number | string;
  menuList: TMenuList;
  visible: boolean;
}

class VTree extends Component<ITreeProps, ITreeState> {
  constructor(props) {
    super(props);
    this.state = {
      menuDetail: {
        id: 0,
        detail: [],
        title: '',
        icon: '',
        url: ''
      },
      editMode: false,
      uid: props.uid,
      menuList: [],
      visible: false
    };
  }

  componentDidMount() {
    this.initData();
  }

  initData = async () => {
    let { data } = await db.getBaseMenuList();
    let menuList = data.map((item) => {
      item.detail = JSON.parse(item.detail);
      return item;
    });
    this.setState({
      menuList
    });
  };

  editMenu = async (menuDetail, mode: 'edit' | 'del') => {
    if (mode === 'edit') {
      this.setState({ menuDetail, editMode: true });
    } else if (mode === 'del') {
      this.reset();
    }
  };

  reset = () => {
    this.setState({
      editMode: false,
      menuDetail: {
        id: 0,
        detail: [],
        title: '',
        icon: '',
        url: ''
      }
    });
    this.initData();
  };

  showCartLink = () => {
    this.setState({
      visible: true
    });
  };

  render() {
    const externalNodeType: string = 'shareNodeType';
    const { menuDetail, editMode, visible, uid } = this.state;
    return (
      <Card title="菜单设置">
        <Row>
          <Col md={8} sm={24}>
            <MenuItemList
              externalNodeType={externalNodeType}
              dispatch={this.props.dispatch}
            />
          </Col>
          <Col md={8} sm={24}>
            <MenuPreview
              externalNodeType={externalNodeType}
              menuDetail={menuDetail}
              editMode={editMode}
              onNew={this.reset}
              uid={uid}
            />
          </Col>
          <Col md={8} sm={24}>
            <MenuList
              onEdit={this.editMenu}
              uid={uid}
              menuList={this.state.menuList}
            />
          </Col>
        </Row>
        <div className={styles.actions}>
          <Button onClick={this.showCartLink} type="primary">
            图表链接生成
          </Button>
          <ChartLink
            visible={visible}
            onToggle={() => {
              this.setState({ visible: false });
            }}
          />
        </div>
      </Card>
    );
  }
}

function mapStateToProps(state) {
  return {
    loading: state.loading.models.menu,
    uid: state.common.userSetting.uid
  };
}

export default connect(mapStateToProps)(VTree);
