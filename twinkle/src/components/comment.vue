<template >
  <div id="com">
       <img :src="com.url"  width="50" height="50"/>
       <div class="words">
           <p class="com1">{{com.name}}</p>
           <p class="com2">{{com.date}}</p>
           <p class="com3">{{com.words}}</p>
       </div>
  </div>
</template>

<script>
export default {
  props:{
    "com":{
      type:Object,
      required:true
    },
  },
  data() {
    return {
    };
  },

  ready() {},
  methods: {},
  components: {}
};
</script>

<style>
#com{position:relative;height:110px;}
#com img{margin:10px 0 0 10px;}
.words{position:absolute;left:70px;top:10px;}
.words p{margin:0;display:block;}
.words .com1{font-size:18px;height:32px;line-height:32px;color:#d68a5a;}
.words .com2{font-size: 12px;height:20px;line-height:20px;color:#9aa2a0;}
.words .com3{font-size:18px;height:35px;line-height:35px;}
</style>
