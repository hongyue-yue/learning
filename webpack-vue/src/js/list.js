import Vue from 'vue'
import List from '../container/list'
import './common.js'
new Vue({
  el: '#app',
  template: '<List/>',
  components: { List }
  //render: h => h(List)
})
