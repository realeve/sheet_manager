import React from 'react';
import BasicLayout from './BasicLayout';
import UserLayout from './UserLayout';

class MainLayout extends React.PureComponent {
  render() {
    return this.props.location.pathname.includes('/login') ? (
      <UserLayout {...this.props} />
    ) : (
      <BasicLayout {...this.props} />
    );
  }
}

export default MainLayout;
