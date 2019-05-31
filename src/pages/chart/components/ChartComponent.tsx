import React, { Component } from 'react';
import ReactEcharts from './echarts-for-react';
import { tRender } from '../utils/lib';
interface IProp {
  renderer?: tRender;
  option: any;
  [key: string]: any;
}

/**
 * todo:
 * 1.增加group选项，数据以此做切换(2018-11-25 已完成)；
 * 2.对参数长度排序，以最长的为准做合并，避免出现 &id=a&id=a...&otherparams的情况
 */
export default class Charts extends Component<IProp> {
  static defaultProps: Partial<IProp> = {
    renderer: 'canvas',
  };
  constructor(props) {
    super(props);
    // 创建echarts实例
    this.echarts_react = React.createRef();
  }

  echarts_react = null;

  componentWillUnmount() {
    if (this.echarts_react && this.echarts_react.dispose) {
      this.echarts_react.dispose();
    }
  }

  componentDidMount() {
    console.log('componentDidMount 4')
    if (this.echarts_react && this.props.setInstance) {
      this.props.setInstance(this.echarts_react.getEchartsInstance());
    }
  }

  render() {
    let { option, renderer, ...props } = this.props;
    return (
      <ReactEcharts
        ref={e => {
          this.echarts_react = e;
        }}
        option={option}
        {...props}
        opts={{ renderer }}
      />
    );
  }
}
