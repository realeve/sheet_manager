import React from 'react';
import { Layout } from 'antd';
import { CopyrightOutlined } from '@ant-design/icons';
import { AUTHOR } from '@/utils/setting'; // CUR_COMPANY
import { connect } from 'dva';

const { Footer } = Layout;
const FooterView = ({ version }) => (
  <Footer
    className="footer"
    style={{
      display: 'flex',
      alignItems: 'center',
      height: 44,
      background: 'transparent',
    }}
  >
    <div>
      <CopyrightOutlined /> 2019 {AUTHOR}
    </div>
    <div style={{ marginLeft: 20 }}>
      <span>系统版本: V {version.version}</span>
      <span style={{ margin: '0 20px' }}>hash: {version.hash}</span>
      <span>发布时间: {version.date}</span>
    </div>
  </Footer>
);
export default connect(({ common }) => ({ version: common.version }))(FooterView);
