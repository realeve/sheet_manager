import React, { Component } from "react";
import router from "umi/router";
import { connect } from "dva";

import { Alert, Checkbox, Layout } from "antd";
import Login from "ant-design-pro/lib/Login";
import styles from "./index.less";
import * as db from "./service";
import userTool from "../../utils/users";

const { Footer } = Layout;
const { UserName, Password, Submit } = Login;

class LoginComponent extends Component {
  state = {
    notice: "",
    autoLogin: true,
    avatar: ""
  };

  onSubmit = (err, values) => {
    this.login(values);
  };

  changeAutoLogin = e => {
    let { checked } = e.target;
    this.setState({
      autoLogin: checked
    });
    if (!checked) {
      userTool.clearUserSetting();
    }
  };

  handleAutoLogin = values => {
    if (this.state.autoLogin) {
      userTool.saveUserSetting(values);
    } else {
      userTool.clearUserSetting();
    }
  };

  async login(values) {
    let userInfo = await db.getSysUser(values);
    const autoLogin = this.state.autoLogin;

    if (userInfo.rows > 0) {
      let userSetting = userInfo.data[0];
      userSetting.menu = JSON.parse(userSetting.menu);

      this.handleAutoLogin({ values, setting: userSetting, autoLogin });
      this.props.dispatch({
        type: "common/setStore",
        payload: {
          userSetting
        }
      });
      router.push(userTool.readLastRouter());
      return;
    }

    this.setState({
      notice: "账号或密码错误！"
    });
  }

  componentDidMount() {
    let { data, success } = userTool.getUserSetting();
    let avatar = "/img/avatar.svg";
    if (!success || !data.autoLogin) {
      this.setState({
        avatar
      });
      return;
    }

    this.setState({
      avatar: data.setting.avatar
    });

    const query = this.props.location.query;
    if (query.autoLogin === "0") {
      return;
    }
    this.login(data.values);
  }

  render() {
    const loginStyle = {
      style: { float: "right" },
      href: "http://10.8.2.133/welcome/logout",
      rel: "noopener noreferrer",
      target: "_blank"
    };
    const { autoLogin, avatar } = this.state;

    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.top}>
            <div className={styles.header}>
              <div>
                {/* <img alt="logo" className={styles.logo} src="/img/logo.svg" /> */}
                <span className={styles.title}>某系统</span>
              </div>
            </div>
            {/* <div className={styles.desc}>多多益善</div> */}
          </div>
          <div className={styles.main}>
            <Login defaultActiveKey={this.state.type} onSubmit={this.onSubmit}>
              <div>
                <img alt="avatar" className={styles.avatar} src={avatar} />
                <h2 className={styles.title}>登录</h2>
                {this.state.notice && (
                  <Alert
                    style={{ marginBottom: 24 }}
                    message={this.state.notice}
                    type="error"
                    showIcon
                    closable
                  />
                )}
                <UserName
                  name="username"
                  placeholder="用户名"
                  autoComplete="false"
                />
                <Password
                  name="password"
                  placeholder="密码"
                  autoComplete="false"
                />
              </div>
              <div>
                <Checkbox checked={autoLogin} onChange={this.changeAutoLogin}>
                  自动登录
                </Checkbox>
                <a {...loginStyle}>忘记密码</a>
              </div>
              <Submit>登录</Submit>
              <div>
                <a {...loginStyle}>注册账户</a>
              </div>
            </Login>
          </div>
          <Footer className={styles.footer}>
            cbpc ©2018 All rights reserved.
          </Footer>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    ...state.common
  };
}

export default connect(mapStateToProps)(LoginComponent);
