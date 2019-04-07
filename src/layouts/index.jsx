import React from 'react';
import BasicLayout from './BasicLayout';
import UserLayout from './UserLayout';

const { registerObserver } = require('react-perf-devtool');
if (process.env.NODE_ENV === 'development') {
  // const options = {
  //   shouldLog: true,
  //   port: 8080,
  //   timeout: 12000, // Load the extension after 12 sec.
  // };

  // assign the observer to the global scope, as the GC will delete it otherwise
  window.observer = registerObserver();
}

class MainLayout extends React.PureComponent {
  render() {
    let pathname = this.props.location.pathname;
    if (pathname === '/home') {
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
