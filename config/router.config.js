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
        redirect: '/account/settings/base',
      },
      {
        path: '/home',
        component: './Home',
      },
      {
        path: '/menu',
        component: './menu',
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
        component: './Search',
      },
      {
        name: 'account',
        icon: 'user',
        path: '/account',
        routes: [
          {
            path: '/account/center',
            name: 'center',
            component: './Account/Center/Center',
            routes: [
              {
                path: '/account/center',
                redirect: '/account/center/myarticle',
              },
              {
                path: '/account/center/myarticle',
                component: './Account/Center/Articles',
              },
              {
                path: '/account/center/aboutme',
                component: './Account/Center/Aboutme',
              },
              {
                path: '/account/center/hot',
                component: './Account/Center/Hot',
              },
            ],
          },
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
