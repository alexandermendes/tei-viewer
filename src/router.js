import Router from 'vue-router'
import Table from './pages/Table.vue'

Vue.use(Router)

export default new Router({
    mode: 'history',
    routes: [
        {
            path: '/:table',
            name: 'landing',
            component: Table
        },
    ]
})
