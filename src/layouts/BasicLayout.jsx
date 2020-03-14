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

// import SettingDrawer from '@/components/SettingDrawer';

import { SettingDrawer } from '@ant-design/pro-layout';
import logo from '../assets/logo.svg';
import Footer from './Footer';
// import Header from './Header';
import Context from './MenuContext';
import { DateRangePicker } from '@/components/QueryCondition';
import ToggleMenu from '@/components/GlobalHeader/ToggleMenu';
// import userTool from '../utils/users';
// import router from 'umi/router';

import menuUtil from './menuData';
import ForOThree from '@/pages/403';
import UnLogin from '@/pages/unlogin';
import * as lib from '@/utils/setting';

const { Content } = Layout;
const R = require('ramda');

const getMenuData = ({ menu, previewMenu, location: { pathname } }) => {
  if (menu === '' || R.isNil(menu)) {
    return [];
  }
  const previewMode = pathname === '/menu' && previewMenu.length > 0;
  return menuUtil.getMenuData(previewMode ? previewMenu : menu);
};

const getBreadcrumbList = menuData => {
  const { href, origin } = window.location;
  let curMenu = href.replace(origin, '');
  // console.log(curMenu);
  // , search
  // if (search.length) {
  //   curMenu = curMenu.replace(search, '');
  // }
  return menuUtil.getBreadcrumbList(decodeURI(curMenu), menuData);
};

const query = {
  'screen-xs': {
    maxWidth: 575,
  },
  'screen-sm': {
    minWidth: 576,
    maxWidth: 767,
  },
  'screen-md': {
    minWidth: 768,
    maxWidth: 991,
  },
  'screen-lg': {
    minWidth: 992,
    maxWidth: 1199,
  },
  'screen-xl': {
    minWidth: 1200,
    maxWidth: 1599,
  },
  'screen-xxl': {
    minWidth: 1600,
  },
};

class BasicLayout extends PureComponent {
  constructor(props) {
    super(props);
    // this.getPageTitle = memoizeOne(this.getPageTitle);
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
      breadcrumbList: getBreadcrumbList(menuData),
      nextUrl: '',
      settings: {},
    };
    // this.renderRef = React.createRef();
  }

  static getDerivedStateFromProps(props, curState) {
    const { menu, previewMenu } = props;

    const { href, origin } = window.location;
    let nextUrl = href.replace(origin, '');
    if (
      nextUrl !== curState.nextUrl ||
      (R.equals(menu, curState.menu) && R.equals(previewMenu, curState.previewMenu))
    ) {
      let { pathname } = props.location;
      if (nextUrl !== curState.nextUrl || !R.equals(pathname, curState.pathname)) {
        return {
          pathname,
          nextUrl,
          breadcrumbList: getBreadcrumbList(curState.menuData),
        };
      }
      return null;
    }

    const menuData = getMenuData(props);
    const breadcrumbList = getBreadcrumbList(menuData);
    return {
      menu,
      menuData,
      breadcrumbList,
    };
  }

  componentDidMount() {
    // console.log('componentDidMount 10');

    this.enquireHandler = enquireScreen(mobile => {
      const { isMobile } = this.state;
      if (isMobile !== mobile) {
        this.setState({
          isMobile: mobile,
        });
      }
    });
  }

  componentWillUnmount() {
    unenquireScreen(this.enquireHandler);
  }

  getContext() {
    const { location } = this.props;
    return {
      location,
      breadcrumbNameMap: this.breadcrumbNameMap,
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
      return lib.systemName;
    }

    return `${currRouterData.name} - ${lib.systemName}`;
  };

  getLayoutStyle = () => {
    const { isMobile } = this.state;
    const { fixSiderbar, collapsed, layout } = this.props;
    if (fixSiderbar && layout !== 'topmenu' && !isMobile) {
      return {
        paddingLeft: collapsed ? '80px' : '256px',
      };
    }
    return null;
  };

  getContentStyle = () => {
    const { fixedHeader } = this.props;
    return {
      margin: '12px 12px 0',
      paddingTop: fixedHeader ? 64 : 0,
    };
  };

  handleMenuCollapse = collapsed => {
    // console.log(collapsed);
    const { dispatch } = this.props;
    // console.log(collapsed, '手工调整');
    dispatch({
      type: 'global/changeLayoutCollapsed',
      payload: collapsed,
    });
  };

  render() {
    const {
      navTheme,
      layout: PropsLayout,
      children,
      location,
      hidemenu,
      user_type,
      dateType = ['none'],
      isLogin,
    } = this.props;
    const { isMobile, menuData, breadcrumbList, nextUrl } = this.state;
    const isTop = PropsLayout === 'topmenu';

    // 未登录，未在允许菜单列表中搜索到且用户身份类型>=4时，表示非法访问。
    const notAllowed = breadcrumbList.length === 0 && user_type >= 4;

    const dateStyle = isMobile
      ? {
          paddingBottom: 10,
        }
      : { position: 'fixed', right: 20, top: 20, zIndex: 10 };

    const layout = (
      <Layout>
        {hidemenu || menuData.length === 0 || (isTop && !isMobile) ? null : (
          <SiderMenu
            logo={logo}
            theme={navTheme}
            onCollapse={this.handleMenuCollapse}
            menuData={menuData}
            isMobile={isMobile}
            breadcrumbList={breadcrumbList}
            nextUrl={nextUrl}
            {...this.props}
          />
        )}
        <Layout
          style={{
            ...this.getLayoutStyle(),
            minHeight: '100vh',
          }}
        >
          <Content style={this.getContentStyle()}>
            {['/table', '/chart'].includes(location.pathname) &&
              this.props.selectList.length + this.props.textAreaList.length === 0 &&
              dateType[0] !== 'none' && (
                <DateRangePicker
                  refresh={true}
                  dispatch={this.props.dispatch}
                  dateRange={this.props.dateRange}
                  style={dateStyle}
                />
              )}
            {isMobile && <ToggleMenu style={{ position: 'fixed', right: 10, top: 10 }} />}
            {notAllowed ? <ForOThree /> : !hidemenu && !isLogin ? <UnLogin /> : children}

            <SettingDrawer
              settings={this.state.settings}
              onSettingChange={settings => this.setState({ settings })}
            />
          </Content>
          <Footer hidemenu={hidemenu} />
        </Layout>
      </Layout>
    );

    return (
      <React.Fragment>
        <DocumentTitle title={this.getPageTitle(location.pathname)} />
        <ContainerQuery query={query}>
          {params => (
            <Context.Provider value={this.getContext()}>
              <div className={classNames(params)}>{layout}</div>
            </Context.Provider>
          )}
        </ContainerQuery>
      </React.Fragment>
    );
  }
}
// process.env.NODE_ENV === 'production' &&

export default connect(
  ({
    global,
    setting,
    common: {
      dateType,
      userSetting: { menu, previewMenu, user_type },
      isLogin,
      hidemenu,
      dateRange,
      selectList,
      textAreaList,
    },
  }) => ({
    dateType,
    collapsed: global.collapsed,
    layout: setting.layout,
    ...setting,
    menu,
    previewMenu,
    user_type,
    isLogin,
    hidemenu,
    dateRange,
    selectList,
    textAreaList,
  })
)(BasicLayout);
