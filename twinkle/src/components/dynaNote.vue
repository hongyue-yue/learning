<template>
  <div id="dyna_note">
         <div class="note_top">
            <img @click="this.back()" src="../assets/return.png" width="30" height="30" />
         </div>
         <div class="note_middle">
             <comment :com="value" v-for="(key,value) of dynamic" track-by="$index"></comment>
         </div>
         <div class="note_edit">
           <input class="in1" type="text" value="评论" v-model="comment.words">
           <input class="in2" type="button"  value="submit"  @click="this.submit()">
         </div>
  </div>
</template>

<script>
import comment from "./comment"
import { dynamicCommentsUnshift } from "../vuex/action"

export default {
  vuex:{
    getters: {
        dynamicFeed: state => state.dynamicFeed,
        user: state => state.user
    },
    actions:{
         dynamicCommentsUnshift
    }
  },
  data() {
    return {
      id:"",
      dynamic:[],
      comment:{
        url:this.user.usersImg,
        name:this.user.users,
        words:"",
        date:"",
      },
    };
  },
  created () {
    this.fetchNews(this.$route.params.id)
  },
  methods: {
        submit(){
          this.comment.date=this.getTime()
          this.dynamicCommentsUnshift(this.$route.params.id, this.comment)
          //console.log(this.newsFeed[1].comments.length)
          //this.fetchNews(this.$route.params.id)
        },
        getTime(){
          let date=new Date();
          let mon=date.getMonth()+1
          let day=date.getDate()
          let hours=date.getHours()
          let min=date.getMinutes()
          return (mon+"-"+day+" "+hours+":"+min)
        },
        back(){
          let bott=document.getElementById("bott")
          bott.style.display="inline"
          this.$route.router.go({name:'find'})
        },
        fetchNews(notesId){
           let bott=document.getElementById("bott")
           bott.style.display="none"
           for(let i=0;i<this.dynamicFeed.length;i++){
             if(this.dynamicFeed[i].id==notesId){
               this.dynamic=this.dynamicFeed[i].comments
             }
           }
        },

  },
  components: {
    comment
  }
};
</script>

<style>
#dyna_note{z-index:20;width:500px;height:700px;position:relative;}
#dyna_note .note_top{width:100%;height:50px;background-color: #eee67d;position: absolute;}
#dyna_note .note_top img{margin:10px 0 0 10px;}

#dyna_note .note_middle{width:100%;height:600px;position:absolute;top:50px;overflow:scroll;
             background-color: #edecea;}
#dyna_note .note_middle::-webkit-scrollbar {display:none}

#dyna_note .note_edit{position:absolute;bottom:0;width:100%;height:50px;}
#dyna_note .in1{width:350px;height:30px;font-size:20px;position:absolute;top:10px;left:50px;
           border-radius: 8px;border:1px solid #cacdd0 }
#dyna_note .in2{width:60px;height:30px;position:absolute;top:12px;right:15px;}
</style>
