import React, { PureComponent } from 'react';
import { Layout } from 'antd';
import DocumentTitle from 'react-document-title';
import isEqual from 'lodash/isEqual';
import memoizeOne from 'memoize-one';
import { connect } from 'dva';
import { ContainerQuery } from 'react-container-query';
import classNames from 'classnames';
import pathToRegexp from 'path-to-regexp';
import { enquireScreen, unenquireScreen } from 'enquire-js';
import SiderMenu from '@/components/SiderMenu';

import SettingDrawer from '@/components/SettingDrawer';
import logo from '../assets/logo.svg';
import Footer from './Footer';
import Header from './Header';
import Context from './MenuContext';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import userTool from '../utils/users';
import router from 'umi/router';

import menuUtil from './menuData';
import ForOThree from '@/pages/403';
import UnLogin from '@/pages/unlogin';

const { Content } = Layout;
const systemName = '某数据系统';
const R = require('ramda');

const getMenuData = ({ menu, previewMenu, location: { pathname } }) => {
  if (menu === '') {
    return [];
  }
  const previewMode = pathname === '/menu' && previewMenu.length > 0;
  return menuUtil.getMenuData(previewMode ? previewMenu : menu);
};

const getBreadcrumbList = menuData => {
  const { href, origin, search } = window.location;
  let curMenu = href.replace(origin, '');
  if (search.length) {
    curMenu = curMenu.replace(search, '');
  }
  return menuUtil.getBreadcrumbList(curMenu, menuData);
};

const query = {
  'screen-xs': {
    maxWidth: 575
  },
  'screen-sm': {
    minWidth: 576,
    maxWidth: 767
  },
  'screen-md': {
    minWidth: 768,
    maxWidth: 991
  },
  'screen-lg': {
    minWidth: 992,
    maxWidth: 1199
  },
  'screen-xl': {
    minWidth: 1200,
    maxWidth: 1599
  },
  'screen-xxl': {
    minWidth: 1600
  }
};

class BasicLayout extends PureComponent {
  constructor(props) {
    super(props);
    this.getPageTitle = memoizeOne(this.getPageTitle);
    this.getBreadcrumbNameMap = memoizeOne(this.getBreadcrumbNameMap, isEqual);
    const { menu, previewMenu } = props;
    const menuData = getMenuData(props);
    this.breadcrumbNameMap = this.getBreadcrumbNameMap(menuData);
    this.matchParamsPath = memoizeOne(this.matchParamsPath, isEqual);
    this.state = {
      menuData,
      rendering: true,
      isMobile: false,
      menu,
      previewMenu,
      pathname: props.location.pathname,
      breadcrumbList: getBreadcrumbList(menuData)
    };
  }

  static getDerivedStateFromProps(props, curState) {
    const { menu, previewMenu } = props;
    if (
      R.equals(menu, curState.menu) &&
      R.equals(previewMenu, curState.previewMenu)
    ) {
      let { pathname } = props.location;
      if (R.equals(pathname, curState.pathname)) {
        return null;
      }
      return {
        pathname,
        breadcrumbList: getBreadcrumbList(curState.menuData)
      };
    }

    const menuData = getMenuData(props);
    const breadcrumbList = getBreadcrumbList(menuData);
    return {
      menu,
      menuData,
      breadcrumbList
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;

    // 登录逻辑
    let { data, success } = userTool.getUserSetting();
    if (!success || !data.autoLogin) {
      router.push('/login');
      return;
    }

    dispatch({
      type: 'common/setStore',
      payload: {
        userSetting: data.setting
      }
    });

    // dispatch({
    //   type: "user/fetchCurrent"
    // });

    dispatch({
      type: 'setting/getSetting'
    });
    this.renderRef = requestAnimationFrame(() => {
      this.setState({
        rendering: false
      });
    });

    this.enquireHandler = enquireScreen(mobile => {
      const { isMobile } = this.state;
      if (isMobile !== mobile) {
        this.setState({
          isMobile: mobile
        });
      }
    });
  }

  componentDidUpdate(preProps) {
    // After changing to phone mode,
    // if collapsed is true, you need to click twice to display
    this.breadcrumbNameMap = this.getBreadcrumbNameMap(this.state.menuData);
    const { isMobile } = this.state;
    const { collapsed } = this.props;
    if (isMobile && !preProps.isMobile && !collapsed) {
      this.handleMenuCollapse(false);
    }
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.renderRef);
    unenquireScreen(this.enquireHandler);
  }

  getContext() {
    const { location } = this.props;
    return {
      location,
      breadcrumbNameMap: this.breadcrumbNameMap
    };
  }

  /**
   * 获取面包屑映射
   * @param {Object} menuData 菜单配置
   */
  getBreadcrumbNameMap(menuData) {
    const routerMap = {};
    const mergeMenuAndRouter = data => {
      data.forEach(menuItem => {
        if (menuItem.children) {
          mergeMenuAndRouter(menuItem.children);
        }
        // Reduce memory usage
        routerMap[menuItem.path] = menuItem;
      });
    };
    mergeMenuAndRouter(menuData);
    return routerMap;
  }

  matchParamsPath = pathname => {
    const pathKey = Object.keys(this.breadcrumbNameMap).find(key =>
      pathToRegexp(key).test(pathname)
    );
    return this.breadcrumbNameMap[pathKey];
  };

  getPageTitle = pathname => {
    const currRouterData = this.matchParamsPath(pathname);
    if (!currRouterData) {
      return systemName;
    }

    return `${currRouterData.name} - ${systemName}`;
  };

  getLayoutStyle = () => {
    const { isMobile } = this.state;
    const { fixSiderbar, collapsed, layout } = this.props;
    if (fixSiderbar && layout !== 'topmenu' && !isMobile) {
      return {
        paddingLeft: collapsed ? '80px' : '256px'
      };
    }
    return null;
  };

  getContentStyle = () => {
    const { fixedHeader } = this.props;
    return {
      margin: '24px 24px 0',
      paddingTop: fixedHeader ? 64 : 0
    };
  };

  handleMenuCollapse = collapsed => {
    const { dispatch } = this.props;
    dispatch({
      type: 'global/changeLayoutCollapsed',
      payload: collapsed
    });
  };

  renderSettingDrawer() {
    // Do not render SettingDrawer in production
    // unless it is deployed in preview.pro.ant.design as demo
    const { rendering } = this.state;
    if (
      rendering ||
      (process.env.NODE_ENV === 'production' && APP_TYPE !== 'site')
    ) {
      return null;
    }
    return <SettingDrawer />;
  }

  render() {
    const {
      navTheme,
      layout: PropsLayout,
      children,
      location,
      user_type,
      isLogin
    } = this.props;
    const { isMobile, menuData, breadcrumbList } = this.state;
    const isTop = PropsLayout === 'topmenu';

    // 未登录，未在允许菜单列表中搜索到且用户身份类型>=4时，表示非法访问。
    const notAllowed = breadcrumbList.length === 0 && user_type >= 4;

    const layout = (
      <Layout>
        {menuData.length === 0 || (isTop && !isMobile) ? null : (
          <SiderMenu
            logo={logo}
            theme={navTheme}
            onCollapse={this.handleMenuCollapse}
            menuData={menuData}
            isMobile={isMobile}
            breadcrumbList={breadcrumbList}
            {...this.props}
          />
        )}
        <Layout
          style={{
            ...this.getLayoutStyle(),
            minHeight: '100vh'
          }}>
          <Header
            menuData={menuData}
            handleMenuCollapse={this.handleMenuCollapse}
            logo={logo}
            isMobile={isMobile}
            {...this.props}
          />
          <Content style={this.getContentStyle()}>
            <PageHeaderWrapper breadcrumbList={breadcrumbList}>
              {!isLogin ? <UnLogin /> : notAllowed ? <ForOThree /> : children}
            </PageHeaderWrapper>
          </Content>
          <Footer />
        </Layout>
      </Layout>
    );

    return (
      <React.Fragment>
        <DocumentTitle title={this.getPageTitle(location.pathname)}>
          <ContainerQuery query={query}>
            {params => (
              <Context.Provider value={this.getContext()}>
                <div className={classNames(params)}>{layout}</div>
              </Context.Provider>
            )}
          </ContainerQuery>
        </DocumentTitle>
        {this.renderSettingDrawer()}
      </React.Fragment>
    );
  }
}

export default connect(
  ({
    global,
    setting,
    common: {
      userSetting: { menu, previewMenu, user_type },
      isLogin
    }
  }) => ({
    collapsed: global.collapsed,
    layout: setting.layout,
    ...setting,
    menu,
    previewMenu,
    user_type,
    isLogin
  })
)(BasicLayout);
