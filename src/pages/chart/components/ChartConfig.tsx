import React, { Component } from 'react';
import { Card, Select, Row, Col } from 'antd';
import styles from './Chart.less';
import { formatMessage } from 'umi/locale';
import { chartTypeList } from '../utils/charts';

const R = require('ramda');
const { Option } = Select;
type IHeaderItem = {
  name: string;
  value: string;
};
type IHeader = Array<IHeaderItem | string>;
interface IFiledProps {
  title: string;
  desc: string;
  value: string | number;
  onChange: (e) => void;
  header: IHeader;
}
const FieldSelector: (props: IFiledProps) => JSX.Element = ({
  title,
  desc,
  value,
  onChange,
  header
}) => (
  <Col span={8} xl={6} lg={6} md={8} sm={12} xs={24}>
    <div className={styles.selector}>
      <span>{title}</span>
      <Select
        value={value}
        size="small"
        onSelect={(value) => onChange(value)}
        style={{ width: 120 }}>
        {header.map((item: IHeaderItem | string, idx: number) =>
          typeof item === 'object' ? (
            <Option key={String(idx)} value={item.value}>
              {item.name}
            </Option>
          ) : (
            <Option key={String(idx)} value={String(idx)}>
              {item}
            </Option>
          )
        )}
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

export type TAxisName = 'type' | 'x' | 'y' | 'z' | 'legend' | 'group';
export const getParams = R.pick(['type', 'x', 'y', 'z', 'legend', 'group']);

let getChartConfig = (type) => {
  let chartType = chartTypeList.find((list) =>
    list.map(({ name, value }) => type === value)
  );
  return chartType || [];
};

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
    let { x, y, z, legend, group, type } = this.state;
    let { header } = this.props;
    let chartType = getChartConfig(type);
    chartType = chartType.map(({ name, value, icon }) => {
      return {
        name: icon ? (
          <div>
            <img src={icon} style={{ width: 24, height: 24, marginRight: 5 }} />
            {name}
          </div>
        ) : (
          name
        ),
        value
      };
    });

    return (
      <Card className={styles.chartConfig} title="图表基础设置" bordered>
        <Row gutter={16} style={{ marginTop: 10 }}>
          {chartType.length > 1 && (
            <FieldSelector
              title={formatMessage({ id: 'chart.setting.config.type' })}
              desc="图表类型"
              value={type}
              onChange={(value) => this.changeAxis('type', value)}
              header={chartType}
            />
          )}
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
