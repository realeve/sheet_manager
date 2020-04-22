import React, { Component } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Button } from 'antd';

import MenuItemList from './components/MenuItemList';
import MenuPreview from './components/MenuPreview';
import MenuList from './components/MenuList';
import ChartLink from '@/components/ChartLink';
import styles from './index.less';
import ChartConfig from '../chart/Config';
import TableConfig from '../table/Config';

import { TMenuItem } from './components/MenuItem';

interface ITreeProps {
  uid: number | string;
  loading: boolean;
  [key: string]: any;
}

interface ITreeState {
  menuDetail: TMenuItem;
  editMode: boolean;
  visible: boolean;
  tableVisible: boolean;
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
        url: '',
      },
      editMode: false,
      visible: false,
      tableVisible: false,
    };
  }

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
        url: '',
      },
    });
  };

  showCartLink = () => {
    this.setState({
      visible: true,
    });
  };

  showTableLink = () => {
    this.setState({
      tableVisible: true,
    });
  };

  render() {
    const externalNodeType: string = 'shareNodeType';
    const { menuDetail, editMode, visible, tableVisible } = this.state;
    return (
      <Card title="菜单设置">
        <Row>
          <Col md={8} sm={24}>
            <MenuItemList externalNodeType={externalNodeType} />
          </Col>
          <Col md={9} sm={24}>
            <MenuPreview
              externalNodeType={externalNodeType}
              menuDetail={menuDetail}
              editMode={editMode}
              onNew={this.reset}
              uid={this.props.uid}
            />
          </Col>
          <Col md={6} sm={24} offset={1}>
            <MenuList onEdit={this.editMenu} uid={this.props.uid} />
          </Col>
        </Row>
        <div className={styles.actions}>
          <Button onClick={this.showCartLink} type="primary">
            图表配置说明
          </Button>
          <Button onClick={this.showTableLink} type="default" style={{ marginLeft: 20 }}>
            报表配置说明
          </Button>

          <ChartLink
            visible={visible}
            panelComponent={<ChartConfig />}
            onToggle={() => {
              this.setState({ visible: false });
            }}
          />

          <ChartLink
            visible={tableVisible}
            panelComponent={<TableConfig />}
            onToggle={() => {
              this.setState({ tableVisible: false });
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
    uid: state.common.userSetting.uid,
  };
}

export default connect(mapStateToProps)(VTree);
