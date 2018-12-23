import React from 'react';
import { connect } from 'dva';
import { Card, Select } from 'antd';
import configs from './utils/chartConfig';
import styles from './config.less';
import { formatMessage } from 'umi/locale';

const R = require('ramda');
const { Option } = Select;
class Config extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chartType: 0,
      config: R.head(configs)
    };
  }
  onChange(val) {
    this.setState({ config: configs[val] });
  }
  render() {
    let { chartType, config } = this.state;
    return (
      <Card title={formatMessage({ id: 'chart.config.default' })}>
        <Select
          value={chartType}
          size="small"
          onSelect={(value) => this.onChange(value)}
          style={{ width: 120 }}>
          {configs.map((item, idx) => (
            <Option key={item.type} value={idx}>
              {item.name}
            </Option>
          ))}
        </Select>
        <div className={styles.container}>
          <div className={styles.charttype}>
            图表类型：/chart/#type={config.type}&id=
          </div>
          <ul>
            {config.config.map((item, idx) => {
              return (
                <li key={item.key + idx}>
                  <div className={styles.tip}>
                    {idx + 1}.{item.key}
                    {item.type && <span>type:{item.type}</span>}
                  </div>

                  <div className={styles.desc}> {item.title} </div>
                  {'undefined' !== typeof item.default && (
                    <div>默认值：{item.default}</div>
                  )}
                  {item.url && (
                    <div>
                      <div className={styles.demoLink}>
                        {typeof item.url === 'string' ? (
                          <a href={item.url} target="_blank">
                            {item.url}
                          </a>
                        ) : (
                          item.url.map((url) => (
                            <a href={url} target="_blank" key={url}>
                              {url}
                            </a>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </Card>
    );
  }
}
export default Config;
