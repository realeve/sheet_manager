// https://umijs.org/config/

import pageRoutes from './config/router.config';
import defaultSettings from './src/defaultSettings';
console.log(defaultSettings.primaryColor);
export default {
  plugins: [
    [
      'umi-plugin-react',
      {
        dva: {
          hmr: true
        },
        antd: true, // antd 默认不开启，如有使用需自行配置
        // routes: {
        //   exclude: [
        //     /models\//,
        //     /services\//,
        //     /components\//,
        //     /utils\//,
        //     /service\.js/
        //   ]
        // },
        locale: {
          enable: false, // default false
          default: 'zh-CN', // default zh-CN
          baseNavigator: false // default true, when it is true, will use `navigator.language` overwrite default
        },
        dynamicImport: {
          loadingComponent: './components/PageLoading/Loading1.jsx'
        },
        targets: ['ie11']
      }
    ]
  ],
  define: {
    APP_TYPE: process.env.APP_TYPE || '',
    BUILD_TYPE: process.env.BUILD_TYPE || 'full'
  },
  // 路由配置
  routes: pageRoutes,
  // Theme for antd
  // https://ant.design/docs/react/customize-theme-cn
  theme: {
    'primary-color': defaultSettings.primaryColor
  },
  ignoreMomentLocale: true,
  lessLoaderOptions: {
    javascriptEnabled: true
  },
  manifest: {
    name: 'ant-design-pro',
    background_color: '#FFF',
    description:
      'An out-of-box UI solution for enterprise applications as a React boilerplate.',
    display: 'standalone',
    start_url: '/index.html',
    icons: [
      {
        src: '/favicon.png',
        sizes: '48x48',
        type: 'image/png'
      }
    ]
  },
  cssnano: {
    mergeRules: false
  }
};
