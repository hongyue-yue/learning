<template >
  <span id="select">
    <select  :value="selected"  @change="emitChange($event.target.value)">
       <option v-for="item in selectData" :value="item.value">{{item.text}}</option>
    </select>
  </span>
</template>

<script>
export default {
  name:"input",
  props:{
    selectData:Array,
    selected: {type:[String,Number]}
  },
  model: {
    prop: 'selected',
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
