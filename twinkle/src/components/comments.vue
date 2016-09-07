<template>
  <div id="comments">
        <div class="top2">
          <img src="../assets/return.png" v-on:click="back()" />
          <span v-on:click="submit()">发布</span>
        </div>
        <div class="midd">
           <span class="midd2"><img id="myimg" src="http://7xl1xg.com2.z0.glb.qiniucdn.com/Like/0025.png" width="80" height="80"/></span>
           <textarea  rows="14" cols="40" v-model="comments.words"></textarea>
        </div>
        <div class="bott">
           <div id="item">
             <ul class="express" v-bind:style="moving">
                <li class="pho">
                  <span class="pho_inner"><img src="http://7xl1xg.com2.z0.glb.qiniucdn.com/Like/0001.png" v-on:click="select($event)"/></span>
                  <span class="pho_inner"><img src="http://7xl1xg.com2.z0.glb.qiniucdn.com/Like/0002.png" v-on:click="select($event)"/></span>
                  <span class="pho_inner"><img src="http://7xl1xg.com2.z0.glb.qiniucdn.com/Like/0003.png" v-on:click="select($event)"/></span>
                  <span class="pho_inner"><img src="http://7xl1xg.com2.z0.glb.qiniucdn.com/Like/0004.png" v-on:click="select($event)"/></span>
                  <span class="pho_inner"><img src="http://7xl1xg.com2.z0.glb.qiniucdn.com/Like/0005.png" v-on:click="select($event)"/></span>
                  <span class="pho_inner"><img src="http://7xl1xg.com2.z0.glb.qiniucdn.com/Like/0006.png" v-on:click="select($event)"/></span>
                  <span class="pho_inner"><img src="http://7xl1xg.com2.z0.glb.qiniucdn.com/Like/0007.png" v-on:click="select($event)"/></span>
                  <span class="pho_inner"><img src="http://7xl1xg.com2.z0.glb.qiniucdn.com/Like/0008.png" v-on:click="select($event)"/></span>
                </li>
                <li class="pho">
                  <span class="pho_inner"><img src="http://7xl1xg.com2.z0.glb.qiniucdn.com/Like/0009.png" v-on:click="select($event)"/></span>
                  <span class="pho_inner"><img src="http://7xl1xg.com2.z0.glb.qiniucdn.com/Like/0010.png" v-on:click="select($event)"/></span>
                  <span class="pho_inner"><img src="http://7xl1xg.com2.z0.glb.qiniucdn.com/Like/0011.png" v-on:click="select($event)"/></span>
                  <span class="pho_inner"><img src="http://7xl1xg.com2.z0.glb.qiniucdn.com/Like/0012.png" v-on:click="select($event)"/></span>
                  <span class="pho_inner"><img src="http://7xl1xg.com2.z0.glb.qiniucdn.com/Like/0013.png" v-on:click="select($event)"/></span>
                  <span class="pho_inner"><img src="http://7xl1xg.com2.z0.glb.qiniucdn.com/Like/0014.png" v-on:click="select($event)"/></span>
                  <span class="pho_inner"><img src="http://7xl1xg.com2.z0.glb.qiniucdn.com/Like/0015.png" v-on:click="select($event)"/></span>
                  <span class="pho_inner"><img src="http://7xl1xg.com2.z0.glb.qiniucdn.com/Like/0016.png" v-on:click="select($event)"/></span>
                </li>
                <li class="pho">
                  <span class="pho_inner"><img src="http://7xl1xg.com2.z0.glb.qiniucdn.com/Like/0017.png" v-on:click="select($event)"/></span>
                  <span class="pho_inner"><img src="http://7xl1xg.com2.z0.glb.qiniucdn.com/Like/0018.png" v-on:click="select($event)"/></span>
                  <span class="pho_inner"><img src="http://7xl1xg.com2.z0.glb.qiniucdn.com/Like/0019.png" v-on:click="select($event)"/></span>
                  <span class="pho_inner"><img src="http://7xl1xg.com2.z0.glb.qiniucdn.com/Like/0020.png" v-on:click="select($event)"/></span>
                  <span class="pho_inner"><img src="http://7xl1xg.com2.z0.glb.qiniucdn.com/Like/0021.png" v-on:click="select($event)"/></span>
                  <span class="pho_inner"><img src="http://7xl1xg.com2.z0.glb.qiniucdn.com/Like/0022.png" v-on:click="select($event)"/></span>
                  <span class="pho_inner"><img src="http://7xl1xg.com2.z0.glb.qiniucdn.com/Like/0023.png" v-on:click="select($event)"/></span>
                  <span class="pho_inner"><img src="http://7xl1xg.com2.z0.glb.qiniucdn.com/Like/0024.png" v-on:click="select($event)"/></span>
                </li>
                <li class="pho">
                  <span class="pho_inner"><img src="http://7xl1xg.com2.z0.glb.qiniucdn.com/Like/0025.png" v-on:click="select($event)"/></span>
                  <span class="pho_inner"><img src="http://7xl1xg.com2.z0.glb.qiniucdn.com/Like/0026.png" v-on:click="select($event)"/></span>
                  <span class="pho_inner"><img src="http://7xl1xg.com2.z0.glb.qiniucdn.com/Like/0027.png" v-on:click="select($event)"/></span>
                  <span class="pho_inner"><img src="http://7xl1xg.com2.z0.glb.qiniucdn.com/Like/0001.png" v-on:click="select($event)"/></span>
                  <span class="pho_inner"><img src="http://7xl1xg.com2.z0.glb.qiniucdn.com/Like/0002.png" v-on:click="select($event)"/></span>
                  <span class="pho_inner"><img src="http://7xl1xg.com2.z0.glb.qiniucdn.com/Like/0003.png" v-on:click="select($event)"/></span>
                  <span class="pho_inner"><img src="http://7xl1xg.com2.z0.glb.qiniucdn.com/Like/0004.png" v-on:click="select($event)"/></span>
                  <span class="pho_inner"><img src="http://7xl1xg.com2.z0.glb.qiniucdn.com/Like/0005.png" v-on:click="select($event)"/></span>
                </li>
             </ul>
           </div>
          <div class="happy">
             <span v-on:click="clickScroll(1)" class="current">开心</span>
             <span v-on:click="clickScroll(2)">幸福</span>
             <span v-on:click="clickScroll(3)">难过</span>
             <span v-on:click="clickScroll(4)">愤怒</span>
          </div>
        </div>
  </div>
</template>

<script>
import { newsFeedUnshift } from "../vuex/action"

export default {
  vuex:{
        getters: {
           user:state=>state.user,
           newsFeed: state => state.newsFeed
        },
        actions: {
           newsFeedUnshift
    },
  },
  data() {
      return {
           moving:{
                   transform: 'translateX(0px)'
                 },
           comments:{
                  id:"",
                  src:this.user.usersImg,
                  friend:this.user.users,
                  date:"",
                  words:"",
                  praNumber:"",
                  shaNumber:"",
                  comNumber:"",
                  image:[{url:""}],
                  like:[],
                 comments:[],
                 }
         };
  },
  ready(){

  },
  methods: {
    submit(){
        let myimg=document.getElementById("myimg")
        this.comments.image[0].url=myimg.src
        this.comments.date=this.getDays()
        this.comments.id=Math.floor(Math.random()*100)
        this.newsFeedUnshift(this.comments)
        //console.log(this.newsFeed[0].image[0].url)
        this.back()
    },
    select(e){
        let curr= e.target||e.path[0]
        let url=curr.src
        document.getElementById("myimg").src=url

    },
    clickScroll(num){
        let x=500*(num-1)
        let ha=document.getElementsByClassName("happy")[0]
        let sp=ha.getElementsByTagName("span")
        for(let i=0;i<sp.length;i++){
          sp[i].className=""
        }
        sp[num-1].className="current"
        this.move(x)
        //console.log(this.comments.image.url)
    },
    move (x) {
            this.moving = {
                transform: `translateX(${-x}px)`
            }
        },
    back(){
        let bott=document.getElementById("bott")
        bott.style.display="inline"
        this.$route.router.go({name:'friends'})
    },

    getDays(){
        let date=new Date()
        let mon=date.getMonth()+1
        let day=date.getDate()
        return (mon+"-"+day)
    },
  },
};
</script>

<style>
#comments{z-index:20;width:500px;height:700px;position:relative;}
.top2{width:100%;height:50px;background-color:#f0ef79;}
.top2 img{width:30px;height:30px;margin:10px 0 0 20px;}
.top2 span{width:60px;height:50px;line-height: 50px;float:right;
           margin-right:10px;text-align:center;font-size:18px;color:#407fc8;}
.bott{width:100%;height:300px;position:absolute;bottom:0;border-top:1px solid #c2c7c2}
ul,li{margin:0;padding:0}
li{float:left;display:block;}
#item{width:100%;height:240px;overflow:hidden}
/*#item::-webkit-scrollbar {display:none}*/
.bott .express{height:240px;width:2500px;transition-property: transform;
               transition-duration: .3s;transition-timing-function:ease-out;}
/*::-webkit-scrollbar {display:none}*/
.pho{width:500px;height:240px;}
.pho_inner{width:25%;height:120px;line-height:120px;display:block;float:left;text-align:center;}

.express img{width:100px;height:100px;}
.bott .happy{width:100%;position:absolute;bottom:0;}
.bott .happy span{display:block;width:25%;height:60px;line-height:60px;
                  text-align:center;float:left;background-color:#7d7b81;
                  font-size:22px;}
.current{color:#407fc8;}
.midd{margin-top: 20px;position:relative}

.midd2{margin-left: 10px;width: 80px;height:80px;display:block;}

.midd textarea{position:absolute;right:10px;top:0;}

</style>
