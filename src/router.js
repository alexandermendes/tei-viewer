import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'landing',
            component: function (resolve) {
                require(['./pages/Landing.vue'], resolve)
            }
        },
        {
            path: '/upload',
            name: 'upload',
            component: function (resolve) {
                require(['./pages/Upload.vue'], resolve)
            }
        },
        {
            path: '/table',
            name: 'table',
            component: function (resolve) {
                require(['./pages/Table.vue'], resolve)
            }
        }
    ]
})