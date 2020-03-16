import { MenuTheme } from 'antd/es/menu/MenuContext';

const colorList = [
  {
    key: 'dust',
    color: '#F5222D',
  },
  {
    key: 'volcano',
    color: '#FA541C',
  },
  {
    key: 'sunset',
    color: '#FAAD14',
  },
  {
    key: 'cyan',
    color: '#13C2C2',
  },
  {
    key: 'green',
    color: '#1da57a',
  },
  {
    key: 'daybreak',
    color: '#1890FF',
  },
  {
    key: 'geekblue',
    color: '#2F54EB',
  },
  {
    key: 'purple',
    color: '#722ED1',
  },
  {
    key: 'dark green',
    color: '#1DA57A',
  },
];

export type ContentWidth = 'Fluid' | 'Fixed';

export interface Settings {
  /**
   * theme for nav menu
   */
  navTheme: MenuTheme | 'realDark' | undefined;
  /**
   * nav menu position: `sidemenu` or `topmenu`
   */
  layout: 'sidemenu' | 'topmenu';
  /**
   * layout of content: `Fluid` or `Fixed`, only works when layout is topmenu
   */
  contentWidth: ContentWidth;

  /**
   * sticky header
   */
  fixedHeader: boolean;
  /**
   * sticky siderbar
   */
  fixSiderbar: boolean;
  menu: { locale?: boolean; defaultOpenAll?: boolean };
  title: string;
  // Your custom iconfont Symbol script Url
  // eg：//at.alicdn.com/t/font_1039637_btcrd5co4w.js
  // 注意：如果需要图标多色，Iconfont 图标项目里要进行批量去色处理
  // Usage: https://github.com/ant-design/ant-design-pro/pull/3517
  iconfontUrl: string;
  primaryColor: string;
  colorWeak?: boolean;
  autoHideHeader?: boolean;
}

const defaultSettings: Settings = {
  navTheme: 'dark',
  layout: 'sidemenu',
  contentWidth: 'Fluid',
  fixedHeader: false,
  fixSiderbar: false,
  menu: {
    locale: true,
  },
  title: 'Ant Design Pro',
  iconfontUrl: '',
  autoHideHeader: false, // auto hide header
  primaryColor: '#1da57a',
};
export default defaultSettings;
