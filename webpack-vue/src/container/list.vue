<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <h2>Essential Links</h2>
    <ul>
      <li><a href="https://vuejs.org" target="_blank">Core Docs list</a></li>
      <li><a href="https://forum.vuejs.org" target="_blank">Forum list</a></li>
      <li><a href="https://gitter.im/vuejs/vue" target="_blank">Gitter Chat list</a></li>
      <li><a href="https://twitter.com/vuejs" target="_blank">Twitter list</a></li>
      <br>
      <li><a href="http://vuejs-templates.github.io/webpack/" target="_blank">Docs for This Template list</a></li>
    </ul>
    <h2>Ecosystem</h2>
    <ul>
      <li><a href="http://router.vuejs.org/" target="_blank">vue-router list</a></li>
      <li><a href="http://vuex.vuejs.org/" target="_blank">vuex list</a></li>
      <li><a href="http://vue-loader.vuejs.org/" target="_blank">vue-loader list</a></li>
      <li><a href="https://github.com/vuejs/awesome-vue" target="_blank">awesome-vue</a></li>
      <li><a target="_blank">{{data | formatDateTime}}</a></li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'hello',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      data: 1494498812602,
    }
  },

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
