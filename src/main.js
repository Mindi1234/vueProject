import Vue from 'vue'
import App from './App.vue'
import store from './components/store'
import router from './components/routes'

Vue.config.productionTip = false

new Vue({
  store,
  router,
  render: h => h(App),
}).$mount('#app')
