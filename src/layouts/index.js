import React, { Component } from "react";
import { connect } from "dva";
import router from "umi/router";
import userTool from "../utils/users";

import "ant-design-pro/dist/ant-design-pro.css";

import styles from "./index.less";
import Header from "./Header";
import { TransitionGroup, CSSTransition } from "react-transition-group";

import { Layout, Breadcrumb, BackTop } from "antd";
const { Content, Footer } = Layout;

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      curPageName: ""
    };
    this.handleLoginLogic();
  }

  // handle login
  handleLoginLogic() {
    let { data, success } = userTool.getUserSetting();
    if (!success || !data.autoLogin) {
      router.push("/login");
      return;
    }

    this.props.dispatch({
      type: "common/setStore",
      payload: {
        userSetting: data.setting
      }
    });
  }
  // 组件加载前更新菜单ID
  componentDidMount() {
    const { pathname } = this.props.location;
    let curPageName;
    switch (pathname) {
      case "/chart":
        curPageName = "图表";
        break;
      case "/":
      case "/index":
      default:
        curPageName = "报表";
        break;
    }
    this.setState({
      curPageName
    });
  }

  render() {
    const { location, children, userSetting } = this.props;
    if (location.pathname === "/login") {
      return (
        <TransitionGroup>
          <CSSTransition
            key={location.key}
            classNames="fade"
            timeout={{ enter: 1200, exit: 300 }}
          >
            {children}
          </CSSTransition>
        </TransitionGroup>
      );
    }

    return (
      <Layout className={styles.main}>
        <Header location={location} avatar={userSetting} />
        <TransitionGroup>
          <CSSTransition
            key={location.key}
            classNames="ani-left"
            timeout={{ enter: 400, exit: 300 }}
          >
            <Content className={styles.container}>
              <Breadcrumb className={styles.breadCrumb}>
                <Breadcrumb.Item>主页</Breadcrumb.Item>
                <Breadcrumb.Item>{this.state.curPageName}</Breadcrumb.Item>
              </Breadcrumb>
              <div className={styles.content}>{children}</div>
            </Content>
          </CSSTransition>
        </TransitionGroup>
        <BackTop />
        <Footer className={styles.footer}>
          cbpc ©2018 All rights reserved.
        </Footer>
      </Layout>
    );
  }
}

function mapStateToProps(state) {
  return {
    ...state.common
  };
}

export default connect(mapStateToProps)(Index);
