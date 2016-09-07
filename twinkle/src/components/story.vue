<template >
  <div class="story">
     <div class="story_inner">
       <div class="story_top">
          <img :src="story.src" width="50" height="50"/>
          <div class="story_words">
             <p class="p1">{{story.name}}</p>
             <p class="p2">{{story.date}} 更新</p>
          </div>
       </div>
       <div class="story_img">
         <img :src="story.imgSrc" width="100%" height="150"/>
         <p>{{story.words}}</p>
       </div>
     </div>
  </div>
</template>

<script>
export default {
  props:{
    "story":{
      type: Object,
      required: true
    }
  },
};
</script>

<style>
.story{width:100%;margin-top:30px;}
.story_inner{width:94%;border-bottom:1px solid blue;margin:0 auto;position:relative;}


.story_words{height:50px;position:absolute;left:55px;top:0;}
.story_words p{height:25px;line-height:25px;margin:0;}
.story_words .p1{font-size:20px;color:#daa449;}
.story_words .p2{font-size:16px;color:#9497aa;}

.story_img{margin-top: 5px;}
.story_img p{ margin:12px 0; font-size: 22px;font-family: bold;}
</style>
