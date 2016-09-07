<template>

    <div class="top">
      <img src="../assets/images1.png" style="float:left;margin:5px 0 0 10px"/>
      <img src="../assets/images2.png" style="float:right;margin:5px 10px 0 0"
       v-on:click="comment()"/>
    </div>
    <div id="middle">
        <img src="../assets/P_01.jpg" width="500" height="200"/>
        <div class="coders">
          <img v-bind:src="user.usersImg" width="60" height="60" style="float:right" />
          <span style="margin-top:12px ">{{user.users}}</span>
          <span style="margin-top:30px ">已连续登录{{user.day}}天,{{user.person}}人访问</span>
        </div>
        <div class="space">
           <space :dynamic="value" v-for=" (key, value) of newsFeed" track-by="$index"></space>
           <span v-show="shows">加载中.....</span>
        </div>
    </div>
</template>

<script>
import space from "./space.vue"
import {newsFeedPush,newsFeedUnshift,userPush} from "../vuex/action"

export default {
  vuex: {
      getters: {
          user: state=>state.user,
          newsFeed: state => state.newsFeed
      },
      actions: {
          newsFeedPush,
          newsFeedUnshift,
          userPush
      },
    },
  data () {
    return{
      feedId:3,
      shows:false,
      color:{
         backgroundColor:'',
         transition:'backgroundColor 2s'
      },
    };
  },
  ready(){
      document.getElementById("middle").addEventListener('scroll', this.onScroll)
      //this.onScroll()
  },
  components:{
    space
  },
  methods:{
    comment(){
      let bott=document.getElementById("bott")
      bott.style.display="none"
      this.$route.router.go({name:"comments"})
    },
    onScroll(){
      if(this.checkScroll()){
        this.shows=true
        /*let arr=[]
        for(let i=0;i<2;i++){
          arr.push(this.newsFeed[i])
        }
        this.newsFeedPush(arr)*/
        /*let url=
        this.$http.get(url).then((response)=>{
          let data=response.data()
          let arr=[]
          arr=data.newsFeed
          this.newsFeedPush(arr)
        })*/
      }
    },
    /*load(){
      let url=""
      this.$http.get(url).then((response)=>{
         let data=response.data
         let obj={}
         obj=data.user
         this.userPush(obj)
         let arr=[]
         arr=data.newsFeed
         this.newsFeedPush(arr)
      })
    },*/
    checkScroll(){
      let page=document.getElementsByClassName("page")
      let lastSpaceH=page[page.length-1].offsetTop+Math.floor(page[page.length-1].offsetHeight)

      let scrollTop=document.getElementById("middle").scrollTop
      let middleH=document.getElementById("middle").clientHeight
      return (lastSpaceH<=scrollTop+middleH)?true:false
    },
  },
};
</script>

<style >
.top{
      width:100%;height:60px;position:absolute;
      top:0px;z-index:5;
    }
.top img{width:30px; height:30px;}
#middle{overflow:scroll;width:100%;height:640px;
        position:absolute;top:0;}

#middle::-webkit-scrollbar {display:none}

#middle .coders{width:70%;height:60px;z-index:2;position:absolute;top:120px;right:20px;}
#middle .coders span{float:right;font-size:16px;color:#17e8ca;
                     height:18px;line-height:18px;display:block;
                     position:absolute;right:70px;
                    }
#middle .space{width:100%;margin:20px 0 10px 0;}
.space>span{display:block;width:100%;height:28px;line-height:28px;text-align:center;
            font-size:12px;}


</style>
