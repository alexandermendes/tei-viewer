import Vue from 'vue'
import App from './App.vue'
import AsyncComputed from 'vue-async-computed';

Vue.use(AsyncComputed);

/* eslint-disable no-new */
new Vue({
    el: '#app',
    template: '<App/>',
    components: { App },
})