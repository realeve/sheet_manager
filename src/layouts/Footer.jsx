import React, { Fragment } from "react";
import { Layout, Icon } from "antd";
import GlobalFooter from "ant-design-pro/lib/GlobalFooter";

import styles from "./index.less";
const { Footer } = Layout;
const FooterView = () => (
  <Footer className={styles.footer}>
    <GlobalFooter
      links={[
        {
          key: "Pro 首页",
          title: "Pro 首页",
          href: "https://pro.ant.design",
          blankTarget: true
        },
        {
          key: "github",
          title: <Icon type="github" />,
          href: "https://github.com/ant-design/ant-design-pro",
          blankTarget: true
        },
        {
          key: "Ant Design",
          title: "Ant Design",
          href: "https://ant.design",
          blankTarget: true
        }
      ]}
      copyright={
        <Fragment>
          Copyright <Icon type="copyright" /> 2018 CBPC All Rights Reserved
        </Fragment>
      }
    />
  </Footer>
);
export default FooterView;
