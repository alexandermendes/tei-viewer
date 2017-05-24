import Vue from 'vue'
import Router from 'vue-router'
import Table from './components/Table.vue'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/tables/:id',
            name: 'table',
            component: Table
        }
    ]
})
