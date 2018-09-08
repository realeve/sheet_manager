import { Menu, Icon, Spin, Dropdown, Avatar } from "antd";
import router from "umi/router";
import styles from "./LoginAvatar.less";
import * as setting from "../utils/setting";

function LoginAvatar({ avatar }) {
  const currentUser = {
    name: avatar.fullname,
    avatar: setting.domain + avatar.avatar
  };

  if (!currentUser.name || currentUser.name.length === 0) {
    return <Spin size="default" className={styles.spin} />;
  }

  const handleMenuClick = ({ key }) => {
    if (key === "login") {
      // userTool.clearUserSetting();
      router.push("/login?autoLogin=0");
      return;
    }
    if (key === "user") {
      window.location.href = "http://10.8.2.133/settings/account";
    }
  };

  const menu = (
    <Menu className={styles.menu} selectedKeys={[]} onClick={handleMenuClick}>
      <Menu.Item key="user">
        <Icon type="user" />
        个人中心
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="login">
        <Icon type="login" />
        退出登录
      </Menu.Item>
    </Menu>
  );

  return (
    <div className={styles.right}>
      <Dropdown overlay={menu}>
        <span className={`${styles.action} ${styles.account}`}>
          <Avatar
            size="large"
            className={styles.avatar}
            src={currentUser.avatar}
          />
          <span className={styles.name}>{currentUser.name}</span>
        </span>
      </Dropdown>
    </div>
  );
}

export default LoginAvatar;
