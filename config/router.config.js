export default [
    // user
    {
        path: '/user',
        component: '../layouts/UserLayout',
        routes: [{
                path: '/user',
                redirect: '/user/login'
            },
            {
                path: '/user/login',
                component: './login/index'
            },
            // {
            //     path: '/user/register',
            //     component: './User/Register'
            // },
            // {
            //     path: '/user/register-result',
            //     component: './User/RegisterResult'
            // },
        ],
    },
    // app
    {
        path: '/',
        component: '../layouts/BasicLayout',
        // Routes: ['src/pages/Authorized'],
        // authority: ['admin', 'user'],
        routes: [
            // dashboard
            {
                path: '/',
                redirect: '/table'
            },
            {
                path: '/table',
                name: 'table',
                icon: 'table',
                component: './table',
            },
            {
                name: 'account',
                icon: 'user',
                path: '/account',
                routes: [{
                    path: '/account/settings',
                    name: 'settings',
                    component: './Account/Settings/Info',
                    routes: [{
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
                            path: '/account/settings/binding',
                            component: './Account/Settings/BindingView',
                        },
                        {
                            path: '/account/settings/notification',
                            component: './Account/Settings/NotificationView',
                        },
                    ],
                }, ],
            },
            {
                component: '404',
            },
            {
                component: '500',
            },
        ],
    },
];