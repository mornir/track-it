import Vue from 'vue'
import App from './App.vue'
import '@/assets/tailwind.css'
import '@/assets/fonts.css'

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App),
})
