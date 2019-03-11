/* eslint no-undef: 0 */
/* eslint arrow-parens: 0 */
import React from 'react';
import { enquireScreen } from 'enquire-js';
import scrollScreen from 'rc-scroll-anim/lib/ScrollScreen';
import Banner2 from './Banner2';
import Banner3 from './Banner3';
import Content0 from './Content0';
import Content1 from './Content1';
import Content4 from './Content4';
import Content7 from './Content7';
import Content5 from './Content5';
import Content3 from './Content3';
import Footer0 from './Footer0';
import Point from './Point';
import {
  Banner20DataSource,
  Banner30DataSource,
  Content00DataSource,
  Content10DataSource,
  Content40DataSource,
  Content70DataSource,
  Content50DataSource,
  Content30DataSource,
  Footer00DataSource,
} from './data.source';
import './less/antMotionStyle.less';

let isMobile;
enquireScreen(b => {
  isMobile = b;
});

const { location } = window;

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isMobile,
      show: !location.port, // 如果不是 dva 2.0 请删除
    };
  }

  componentDidMount() {
    /* 如果不是 dva 2.0 请使用以下代码
    // 实现整屏滚动
    const docHeight = this.dom.getBoundingClientRect().height;
    scrollScreen.init({ docHeight });
    */
    // 适配手机屏幕;
    enquireScreen(b => {
      this.setState({ isMobile: !!b });
    });
    // dva 2.0 样式在组件渲染之后动态加载，导致滚动组件不生效；线上不影响；
    /* 如果不是 dva 2.0 请删除 start */
    if (location.port) {
      // 样式 build 时间在 200-300ms 之间;
      setTimeout(() => {
        this.setState({
          show: true,
        });
        // 实现整屏滚动
        const docHeight = this.dom.getBoundingClientRect().height;
        scrollScreen.init({ docHeight });
      }, 500);
    }
    /* 如果不是 dva 2.0 请删除 end */
  }

  render() {
    const children = [
      <Banner2
        id="Banner2_0"
        key="Banner2_0"
        dataSource={Banner20DataSource}
        isMobile={this.state.isMobile}
      />,
      <Banner3
        id="Banner3_0"
        key="Banner3_0"
        dataSource={Banner30DataSource}
        isMobile={this.state.isMobile}
      />,
      <Content0
        id="Content0_0"
        key="Content0_0"
        dataSource={Content00DataSource}
        isMobile={this.state.isMobile}
      />,
      <Content1
        id="Content1_0"
        key="Content1_0"
        dataSource={Content10DataSource}
        isMobile={this.state.isMobile}
      />,
      <Content4
        id="Content4_0"
        key="Content4_0"
        dataSource={Content40DataSource}
        isMobile={this.state.isMobile}
      />,
      <Content7
        id="Content7_0"
        key="Content7_0"
        dataSource={Content70DataSource}
        isMobile={this.state.isMobile}
      />,
      <Content5
        id="Content5_0"
        key="Content5_0"
        dataSource={Content50DataSource}
        isMobile={this.state.isMobile}
      />,
      <Content3
        id="Content3_0"
        key="Content3_0"
        dataSource={Content30DataSource}
        isMobile={this.state.isMobile}
      />,
      <Footer0
        id="Footer0_0"
        key="Footer0_0"
        dataSource={Footer00DataSource}
        isMobile={this.state.isMobile}
      />, // 导航和页尾不进入锚点区，如果需要，自行添加;
      <Point
        key="list"
        data={[
          'Banner2_0',
          'Banner3_0',
          'Content0_0',
          'Content1_0',
          'Content4_0',
          'Content7_1',
          'Content7_0',
          'Content5_0',
          'Content3_0',
          'Footer0_0',
        ]}
      />,
    ];
    return (
      <div
        className="templates-wrapper"
        ref={d => {
          this.dom = d;
        }}
      >
        {/* 如果不是 dva 2.0 替换成 {children} start */}
        {this.state.show && children}
        {/* 如果不是 dva 2.0 替换成 {children} end */}
      </div>
    );
  }
}
