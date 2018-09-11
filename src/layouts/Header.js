import { Menu, Icon } from "antd";
import Link from "umi/link";

import { Layout } from "antd";
import styles from "./header.less";
import LoginAvatar from "./LoginAvatar";
import * as setting from "../utils/setting";
const { Header } = Layout;

function HeaderMenu({ location, avatar }) {
  const linkList = [
    {
      url: "/table/#id=7/d0e509c803",
      title: "数据报表",
      icon: "table"
    },
    {
      url:
        "/chart#id=6/8d5b63370c&data_type=score&x=3&y=4&legend=2&type=line&smooth=1&id=6/8d5b63370c&data_type=dom_loaded&x=3&y=4&legend=2&type=line&smooth=1",
      title: "数据图表",
      icon: "area-chart"
    }
  ];
  return (
    <Header className={styles.header}>
      <div className={styles.logo}>{setting.systemName}</div>
      <Menu
        selectedKeys={[location.pathname]}
        mode="horizontal"
        theme="dark"
        className={styles.menu}
      >
        {linkList.map(({ url, title, icon }, key) => (
          <Menu.Item key={key}>
            <Link to={url}>
              <Icon type={icon} />
              {title}
            </Link>
          </Menu.Item>
        ))}
      </Menu>
      <LoginAvatar avatar={avatar} />
    </Header>
  );
}

export default HeaderMenu;
