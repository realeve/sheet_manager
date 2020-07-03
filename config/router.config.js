export default [
  // 登录
  {
    path: '/login',
    component: '../layouts/',
    routes: [
      {
        path: '/login',
        component: './login',
      },
      {
        path: '/login/register',
        component: './login/register',
      },
      {
        path: '/login/forget',
        component: './login/forget',
      },
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/',
    routes: [
      {
        path: '/403',
        component: './403',
      },
      {
        path: '/unlogin',
        component: './unlogin',
      },
      {
        path: '/404',
        component: './404',
      },
      {
        path: '/500',
        component: './500',
      },
      {
        path: '/',
        component: './Home/index',
      },
      {
        path: '/home',
        component: './Home/index',
      },
      {
        path: '/menu',
        component: './menu',
      },
      {
        name: 'form',
        icon: 'form',
        path: '/form',
        routes: [
          {
            path: '/form',
            component: './Form',
          },
          {
            path: '/form/print',
            component: './Form/print',
          },
        ],
      },
      {
        name: 'chart',
        icon: 'chart',
        path: '/chart',
        routes: [
          {
            path: '/chart',
            component: './chart',
          },
          {
            path: '/chart/config',
            component: './chart/Config',
          },
        ],
      },
      {
        name: 'dashboard',
        icon: 'dashboard',
        path: '/dashboard',
        routes: [
          {
            path: '/dashboard',
            component: './dashboard',
          },
        ],
      },
      {
        name: '作业记录',
        icon: 'table',
        path: '/prod/log',
        component: './prod/log',
      },
      {
        name: 'table',
        icon: 'table',
        path: '/table',
        routes: [
          {
            path: '/table',
            component: './table',
          },
          {
            path: '/table/config',
            component: './table/Config',
          },
        ],
      },
      {
        path: '/search',
        icon: 'search',
        path: '/search',
        routes: [
          { path: '/search', component: './Search' },
          { path: '/search/image', component: './Search/image' },
        ],
      },
      {
        name: 'account',
        icon: 'user',
        path: '/account',
        routes: [
          {
            path: '/account/settings',
            name: 'settings',
            component: './Account/Settings/Info',
            routes: [
              {
                path: '/account/settings',
                redirect: '/account/settings/base',
              },
              {
                path: '/account/settings/base',
                component: './Account/Settings/BaseView',
              },
              {
                path: '/account/settings/security',
                component: './Account/Settings/SecurityView',
              },
              {
                path: '/account/settings/active',
                component: './Account/Settings/ActiveView',
              },
            ],
          },
        ],
      },
    ],
  },
];
