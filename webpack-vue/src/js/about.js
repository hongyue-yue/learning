import Vue from 'vue'
import About from '../container/about'

new Vue({
  el: '#app',
  template: '<About/>',
  components: { About }
  //render: h => h(About)
})
