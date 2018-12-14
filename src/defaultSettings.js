const colorList = [
  {
    key: 'dust',
    color: '#F5222D'
  },
  {
    key: 'volcano',
    color: '#FA541C'
  },
  {
    key: 'sunset',
    color: '#FAAD14'
  },
  {
    key: 'cyan',
    color: '#13C2C2'
  },
  {
    key: 'green',
    color: '#52C41A'
  },
  {
    key: 'daybreak',
    color: '#1890FF'
  },
  {
    key: 'geekblue',
    color: '#2F54EB'
  },
  {
    key: 'purple',
    color: '#722ED1'
  },
  {
    key: 'dark green',
    color: '#1DA57A'
  }
];

module.exports = {
  navTheme: 'dark', // theme for nav menu
  primaryColor: colorList[8].color, //'#1DA57A', //'#1890FF', // primary color of ant design
  layout: 'sidemenu', // nav menu position: sidemenu or topmenu
  contentWidth: 'Fluid', // layout of content: Fluid or Fixed, only works when layout is topmenu
  fixedHeader: false, // sticky header
  autoHideHeader: false, // auto hide header
  fixSiderbar: false // sticky siderbar
};
