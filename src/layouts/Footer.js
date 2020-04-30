import React from 'react';
import { Layout } from 'antd';
import { Icon } from '@ant-design/compatible';
import { AUTHOR, CUR_COMPANY } from '@/utils/setting';
// import styles from './index.less';
const { Footer } = Layout;
// let links = [];

// if (CUR_COMPANY === 'chengdu') {
//   links = [
//     {
//       key: '首页',
//       title: '首页',
//       href: '/',
//       blankTarget: true,
//     },
//     {
//       key: '文档',
//       title: '文档',
//       href: '/doc',
//       blankTarget: true,
//     },
//     {
//       key: '工艺质量交互管理',
//       title: '工艺质量交互管理',
//       href: 'http://10.8.2.133:90',
//       blankTarget: true,
//     },
//   ];
// }

const FooterView = ({ hidemenu }) => (
  <Footer
    className="footer"
    style={{ display: 'flex', alignItems: 'center', height: 30, background: 'transparent' }}
  >
    <div>
      <Icon type="copyright" /> 2019 {AUTHOR}
    </div>
  </Footer>
);
export default FooterView;
