import React, { Component } from 'react';
import { Button, Row, Col, Card } from 'antd';
import * as db from '../services/tableCalc';
import styles from './TableCalc.less';
import * as setting from '../utils/setting';
import * as libMath from '../utils/math';
import VFiledsSelector from './FieldsSelector';
import { formatMessage } from 'umi/locale';

import VTable from './Table.jsx';

const dataOperator = libMath.dataOperator;

const R = require('ramda');
class TableCalc extends Component {
  constructor(props) {
    super(props);
    this.state = db.initState(props);
  }

  // 返回的值即是当前需要setState的内容
  static getDerivedStateFromProps(props, state) {
    // if (R.equals(props.dataSrc, state.dataSrc)) {
    //   return null; //{ loading: props.loading };
    // }
    return db.updateState(props, state);
  }

  fieldsChange = async (fieldList) => {
    let { groupList, operatorList } = this.state;
    fieldList = R.sort((a, b) => a - b)(fieldList);
    if (groupList.length === 0) {
      operatorList = [0];
    }
    await this.setState({
      fieldList,
      operatorList
    });
    this.saveFieldsSetting();
  };

  operatorChange = async (operatorList) => {
    await this.setState({
      operatorList
    });
    this.saveFieldsSetting();
  };

  groupChange = async (groupList) => {
    let { operatorList } = this.state;
    groupList = R.sort((a, b) => a - b)(groupList);
    if (groupList.length === 0) {
      operatorList = [0];
    }
    await this.setState({
      groupList,
      operatorList
    });
    this.saveFieldsSetting();
  };

  // 将分组字段，计算字段存储至本地
  saveFieldsSetting = () => {
    let { groupList, operatorList, fieldList, dataSrc } = this.state;
    let key = setting.lsKeys.calSetting + dataSrc.api_id;
    window.localStorage.setItem(
      key,
      JSON.stringify({ groupList, operatorList, fieldList })
    );
  };

  groupData = () => {
    let dataSource = db.getDataSourceWithState(this.state);
    this.setState({ dataSource });
  };

  render() {
    let {
      fieldHeader,
      groupHeader,
      fieldList,
      operatorList,
      groupList,
      dataSource,
      loading,
      subTitle
    } = this.state;
    return (
      <div>
        <Card title={formatMessage({ id: 'table.config.base' })} bordered>
          <Row gutter={16} style={{ marginTop: 10 }}>
            <Col span={8}>
              <VFiledsSelector
                title={formatMessage({ id: 'table.config.groupby' })}
                desc={formatMessage({ id: 'table.config.groupby.desc' })}
                header={fieldHeader}
                onChange={this.fieldsChange}
                checkedList={fieldList}
              />
            </Col>
            <Col span={8}>
              <VFiledsSelector
                title={formatMessage({ id: 'table.config.calc' })}
                desc={formatMessage({ id: 'table.config.calc.desc' })}
                header={groupHeader}
                onChange={this.groupChange}
                checkedList={groupList}
              />
            </Col>
            <Col span={8}>
              <VFiledsSelector
                title={formatMessage({ id: 'table.config.calctype' })}
                header={dataOperator}
                onChange={this.operatorChange}
                checkedList={operatorList}
              />
              <p
                style={{
                  borderTop: '1px solid #e9e9e9',
                  marginTop: 5,
                  paddingTop: 5
                }}>
                计数：统计分组字段出现的次数;
                <br />
                中位数：按顺序排列的一组数据中居于中间位置的数;
                <br />
                标准方差：表示数据离散程度;
                <br />
                变异系数：标准偏差 ÷ 平均值，比较离散程度时消除量纲的影响;
                <br />
                众数：该列中出现次数最多的数据;
              </p>
            </Col>
          </Row>
          <div className={styles.action}>
            <Button type="primary" onClick={this.groupData}>
              {formatMessage({ id: 'table.config.calculate' })}
            </Button>
            {/* <Button>重置</Button> */}
          </div>
        </Card>
        <VTable dataSrc={dataSource} loading={loading} subTitle={subTitle} />
      </div>
    );
  }
}

TableCalc.defaultProps = {
  dataSrc: {
    data: [],
    title: '',
    rows: 0,
    time: '0ms',
    header: []
  },
  loading: false,
  cartLinkPrefix: setting.searchUrl,
  actions: false,
  subTitle: ''
};

export default TableCalc;
