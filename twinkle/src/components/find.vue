<template>
    <div id="sto">
       <div class="nav-story">
         <span v-on:click="slide(1)">动态</span>
         <span v-on:click="slide(2)">故事</span>
       </div>
        <span class="nav-moving" v-bind:style="move"></span>
    </div>
    <div class="dyna" v-bind:style="moveSceond">
      <div id="dynamic">
        <dynamic :dyna="value" v-for="(key, value) of dynamicFeed"  track-by="$index"></dynamic>
      </div>
      <div id="story">
        <story :story="value" v-for="(key, value) of storyFeed" track-by="$index"></story>
      </div>
    </div>
</template>

<script>
import dynamic from './dynamic.vue'
import story from './story.vue'
import { dynamicFeedPush,storyFeedPush } from '../vuex/action'

export default {
  vuex:{
    getters:{
        dynamicFeed: state => state.dynamicFeed,
        storyFeed: state => state.storyFeed
    },
    actions:{
       dynamicFeedPush,
       storyFeedPush
    }
  },
  data() {
    return {
      move: {
              transform:'translateX(190px)'
            },
      moveSceond: {
            transform:'translateX(0px)'
      },
    };
  },
  ready() {
     document.getElementById("story").addEventListener('scroll',this.storyScroll)
     /*this.onload()*/
  },
  components: {
      dynamic,
      story
  },
  methods: {
    /*onload(){
      let url=
      this.$http.get(url).then((response)=>{
        let data=response.data()
        let dyArr=[]
        let stArr=[]
        dyArr=data.dynamicFeed
        stArr=data.storyFeed
        this.dynamicFeedPush(dyArr)
        this.storyFeedPush(atArr)
      })
    },*/
    storyScroll(){
      if(this.checkScroll("story","story")){
        let arr=[]
        for(let i=0;i<this.storyFeed.length;i++){
          arr.push(this.storyFeed[i])
        }
        this.storyFeedPush(arr)
        /*this.onload()*/
      }
    },
    checkScroll(claName,id){
      let page=document.getElementsByClassName(claName)
      let lastSpaceH=page[page.length-1].offsetTop+Math.floor(page[page.length-1].offsetHeight)

      let scrollTop=document.getElementById(id).scrollTop
      let middleH=document.getElementById(id).clientHeight
      //console.log(lastSpaceH)
      //console.log(scrollTop+middleH)
      return (lastSpaceH<=scrollTop+middleH)?true:false
    },
    moving (x) {
          this.move = {
              transform: `translateX(${x+190}px)`
          }
    },
    run(y) {
          this.moveSceond={
            transform: `translateX(${-y}px)`
          }
    },
    slide(num,name){
          let x=100*(num-1)
          let y=500*(num-1)
          this.moving(x)
          this.run(y)
    },


}
}
</script>

<style >
#sto{
       width:100%;height:60px;position:absolute;
       top:0px;z-index:5;background-color: #e8f45e;
      }
#sto .nav-story{margin-left:150px;height:55px;width:200px}
#sto .nav-story span{
                width:100px;height:55px;line-height:50px;display:block;float:left;
                font-size:18px;text-align:center;
               }
#sto .nav-moving{
            position:absolute;background-color: blue;
            height: 5px;width:20px;border-radius: 4px;
            transition-property: transform;
            transition-duration: .3s;
            transition-timing-function: ease-out;
           }

.dyna{
      position:absolute;top:60px;width:1000px;height:580px;
      transition-property: transform;
      transition-duration: .3s;
      transition-timing-function: ease-out;
     }
#dynamic{
         width:500px;height:580px;overflow:scroll;
         position:absolute;top:0;left:0;
         }
#dynamic::-webkit-scrollbar {display:none}

#story{
       width:500px;height:580px;overflow:scroll;
       position:absolute;top:0;left:500px;
      }
#story::-webkit-scrollbar {display:none}
</style>
