import React, { Fragment } from 'react';
import { Layout, Icon } from 'antd';
import GlobalFooter from 'ant-design-pro/lib/GlobalFooter';
import { AUTHOR, CUR_COMPANY } from '@/utils/setting';
import styles from './index.less';
const { Footer } = Layout;
let links = [];

if (CUR_COMPANY === 'chengdu') {
  links = [
    {
      key: '首页',
      title: '首页',
      href: '/',
      blankTarget: true,
    },
    {
      key: '文档',
      title: '文档',
      href: '/doc',
      blankTarget: true,
    },
    {
      key: '工艺质量交互管理',
      title: '工艺质量交互管理',
      href: 'http://10.8.2.133:90',
      blankTarget: true,
    },
  ];
}

const FooterView = ({ color, hidemenu }) => (
  <Footer className={styles.footer}>
    <GlobalFooter
      links={hidemenu ? [] : links}
      copyright={
        <Fragment>
          {!hidemenu && (
            <p style={{ color: color || 'rgba(0,0,0,0.45)' }}>
              <Icon type="copyright" /> 2019 {AUTHOR}
            </p>
          )}
          <p style={{ color: color || 'rgba(0,0,0,0.45)' }}>
            Copyright <Icon type="copyright" /> 2019 CBPC All Rights Reserved
          </p>
        </Fragment>
      }
    />
  </Footer>
);
export default FooterView;
