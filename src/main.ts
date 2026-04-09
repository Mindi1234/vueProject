import Vue from "vue";
import App from "./App.vue";
// @ts-ignore
import router from './routes';
// @ts-ignore
import store from './store';

import VueRouter from "vue-router";
import Vuex from "vuex";

Vue.use(VueRouter);
Vue.use(Vuex);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");