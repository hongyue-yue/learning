<template >
  <span id="input">
    <input type="checkbox" :checked="checked"  @change="emitChange($event.target.checked)">
  </span>
</template>

<script>
export default {
  name:"input",
  props:{
    checked:Boolean,
  },
  model: {
    prop: 'checked',
    event: 'change'
  },
  methods: {
      emitChange(value){
          this.$emit('change', value);
      }
  }
}
</script>

<style>
</style>
