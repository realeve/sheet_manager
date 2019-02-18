import React from 'react';
import { Card, Select } from 'antd';
import configs from './utils/chartConfig';
import styles from './config.less';
import { formatMessage } from 'umi/locale';
import { TChartConfig } from './utils/lib';
import ConfigItem from './components/ConfigItem';

const R = require('ramda');
const { Option } = Select;

export interface configState {
  chartType: number;
  config: Array<{
    type: string;
    config: TChartConfig;
  }>;
}

class Config extends React.Component<{}, configState> {
  constructor(props) {
    super(props);
    this.state = {
      chartType: 0,
      config: R.head(configs),
    };
  }
  onChange(chartType: number) {
    this.setState({ config: configs[chartType], chartType });
  }
  render() {
    let { chartType, config } = this.state;
    return (
      <Card title={formatMessage({ id: 'chart.config.default' })}>
        <Select
          value={chartType}
          size="small"
          onChange={e => this.onChange(e)}
          style={{ width: 120 }}
        >
          {configs.map((item, idx) => (
            <Option key={item.type} value={idx}>
              {item.name}
            </Option>
          ))}
        </Select>
        {config.type && (
          <div className={styles.container}>
            <div className={styles.charttype}>图表类型：/chart/#type={config.type}&id=</div>
            <ul>
              {config.config.map((item, idx) => (
                <ConfigItem config={item} idx={idx} key={item.key + idx} />
              ))}
            </ul>
          </div>
        )}
      </Card>
    );
  }
}
export default Config;
