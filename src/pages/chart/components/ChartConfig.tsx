import React, { Component } from 'react';
import { Card, Select, Row, Col } from 'antd';
import styles from './Chart.less';
import { formatMessage } from 'umi/locale';
import { cursorTo } from 'readline';

const R = require('ramda');
const { Option } = Select;

interface IFiledProps {
  title: string;
  desc: string;
  value: string | number;
  onChange: (e) => void;
  header: Array<string>;
}
const FieldSelector: (props: IFiledProps) => JSX.Element = ({
  title,
  desc,
  value,
  onChange,
  header
}) => (
  <Col span={8} xl={6} lg={6} md={8} sm={12} xs={24}>
    <div className={styles.container}>
      <span>{title}</span>
      <Select
        value={value}
        size="small"
        onSelect={(value) => onChange(value)}
        style={{ width: 180 }}>
        {header.map((item, idx) => (
          <Option key={String(idx)} value={String(idx)}>
            {item}
          </Option>
        ))}
      </Select>
    </div>
    <p className={styles.desc}>{desc}</p>
  </Col>
);

interface IConfigProps {
  header: Array<string>;
  params: {
    x?: string;
    y?: string;
    z?: string;
    legend?: string;
    group?: string;
    [key: string]: string;
  };
  onChange: (key: string, val: string) => void;
}

export interface IConfigState {
  x: string;
  y: string;
  z: string;
  legend: string;
  group: string;
  [key: string]: string;
}

export type TAxisName = 'x' | 'y' | 'z' | 'legend' | 'group';

const getParams = R.pick(['x', 'y', 'z', 'legend', 'group']);

export default class ChartConfig extends Component<IConfigProps, IConfigState> {
  constructor(props) {
    super(props);
    let state: IConfigState = getParams(this.props.params);
    this.state = state;
  }

  static getDerivedStateFromProps(props, state) {
    let nextState = getParams(props.params);
    let curState = getParams(state);
    if (R.equals(nextState, curState)) {
      return null;
    }
    return nextState;
  }

  changeAxis = this.props.onChange;

  render() {
    let { x, y, z, legend, group } = this.state;
    let { header } = this.props;

    return (
      <Card className={styles.chartConfig} title="图表基础设置" bordered>
        <Row gutter={16} style={{ marginTop: 10 }}>
          {x && (
            <FieldSelector
              title={formatMessage({ id: 'chart.setting.config.xAxis' })}
              desc="X轴所在数据列"
              value={x}
              onChange={(value) => this.changeAxis('x', value)}
              header={header}
            />
          )}
          {y && (
            <FieldSelector
              title={formatMessage({ id: 'chart.setting.config.yAxis' })}
              desc="Y轴所在数据列"
              value={y}
              onChange={(value) => this.changeAxis('y', value)}
              header={header}
            />
          )}
          {z && (
            <FieldSelector
              title={formatMessage({ id: 'chart.setting.config.zAxis' })}
              desc="Z轴所在数据列"
              value={z}
              onChange={(value) => this.changeAxis('z', value)}
              header={header}
            />
          )}
          {legend && (
            <FieldSelector
              title={formatMessage({ id: 'chart.setting.config.legend' })}
              desc="legend序列所在数据列"
              value={legend}
              onChange={(value) => this.changeAxis('legend', value)}
              header={header}
            />
          )}
          {group && (
            <FieldSelector
              title={formatMessage({ id: 'chart.setting.config.group' })}
              desc="数据分组所在数据列"
              value={group}
              onChange={(value) => this.changeAxis('group', value)}
              header={header}
            />
          )}
        </Row>
      </Card>
    );
  }
}
