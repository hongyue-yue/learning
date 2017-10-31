import Vue from 'vue'
import About from '../container/about'
import Element from 'element-ui'
import 'element-ui/lib/theme-default/index.css'

Vue.use(Element)
new Vue({
  el: '#app',
  template: '<About/>',
  components: { About }
  //render: h => h(About)
})
