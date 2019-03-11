import React from 'react';
import BasicLayout from './BasicLayout';
import UserLayout from './UserLayout';

class MainLayout extends React.PureComponent {
  render() {
    let pathname = this.props.location.pathname;
    if (pathname === '/') {
      return this.props.children;
    }
    return pathname.includes('/login') ? (
      <UserLayout {...this.props} />
    ) : (
      <BasicLayout {...this.props} />
    );
  }
}

export default MainLayout;
