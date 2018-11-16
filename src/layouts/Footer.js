import React, { Fragment } from 'react';
import { Layout, Icon } from 'antd';
import GlobalFooter from 'ant-design-pro/lib/GlobalFooter';

import styles from './index.less';
const { Footer } = Layout;
const FooterView = () => (
  <Footer className={styles.footer}>
    <GlobalFooter
      links={[
        {
          key: '首页',
          title: '首页',
          href: '/',
          blankTarget: true
        },
        {
          key: '文档',
          title: '文档',
          // title: <Icon type="github" />,
          href: '/doc',
          blankTarget: true
        },
        {
          key: '工艺质量交互管理',
          title: '工艺质量交互管理',
          href: 'http://10.8.2.133:90',
          blankTarget: true
        }
      ]}
      copyright={
        <Fragment>
          <p>
            <Icon type="copyright" /> 2019 成都印钞有限公司 印钞管理部
          </p>
          <p>
            Copyright <Icon type="copyright" /> 2019 CBPC All Rights Reserved
          </p>
        </Fragment>
      }
    />
  </Footer>
);
export default FooterView;
