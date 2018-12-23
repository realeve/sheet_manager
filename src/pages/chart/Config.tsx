import React from 'react';
import { connect } from 'dva';
import { Card, Select } from 'antd';
import configs from './utils/chartConfig';
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
      <Card title="图表默认配置项">
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
        <div>
          图表类型：{config.type}
          <ul>
            {config.config.map((item, idx) => {
              return (
                <li key={item.key + idx} style={{ marginTop: 10 }}>
                  <div style={{ fontWeight: 'bold' }}>
                    {idx + 1}.{item.key}
                    {item.type && <span>type:{item.type}</span>}
                  </div>

                  <div>参数说明：{item.title}</div>
                  {'undefined' !== typeof item.default && (
                    <div>默认值：{item.default}</div>
                  )}
                  {item.url && (
                    <div>
                      {typeof item.url === 'string'
                        ? item.url
                        : item.url.map((url) => (
                            <a href={url} target="_blank" key={url}>
                              {url}
                            </a>
                          ))}
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
