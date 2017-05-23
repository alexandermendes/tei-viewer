import Vue from 'vue'
import App from './components/App.vue'
import BootstrapVue from 'bootstrap-vue';

Vue.use(BootstrapVue);

/* eslint-disable no-new */
new Vue({
    el: '#app',
    template: '<App/>',
    components: { App }
})