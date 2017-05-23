import 'bootstrap';
import Vue from 'vue'
import './assets/style/app.scss'
import App from './components/App.vue'

/* eslint-disable no-new */
new Vue({
    el: '#app',
    template: '<App/>',
    components: { App }
})