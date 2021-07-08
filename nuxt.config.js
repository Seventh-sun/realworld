module.exports = {
    router: {
        linkActiveClass: 'active',
        extendRoutes ( routes, resolve ) {
            routes.splice(0)

            routes.push(...[
                {
                    path: '/',
                    component: resolve(__dirname, 'pages/layout/'),
                    children: [
                        {
                            path: '',
                            name: 'home',
                            component: resolve(__dirname, 'pages/home/')
                        },
                        {
                            path: 'editor/:slug?',
                            name: 'editor',
                            props: true,
                            component: resolve(__dirname, 'pages/editor/')
                        },
                        {
                            path: 'setting',
                            name: 'setting',
                            component: resolve(__dirname, 'pages/setting/')
                        },
                        {
                            path: 'login',
                            name: 'login',
                            component: resolve(__dirname, 'pages/login/')
                        },
                        {
                            path: 'register',
                            name: 'register',
                            component: resolve(__dirname, 'pages/login/')
                        },
                        {
                            path: 'article/:slug',
                            name: 'article',
                            component: resolve(__dirname, 'pages/article/')
                        },
                        {
                            path: 'profile/:username',
                            name: 'profile',
                            component: resolve(__dirname, 'pages/profile/')
                        }
                    ]
                },
            ])
        }
    },
    plugins: [
        '~/plugins/request.js',
        '~/plugins/dayjs.js'
    ]
}