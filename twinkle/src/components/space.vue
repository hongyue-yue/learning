<template >
   <div class="page">
      <img :src="dynamic.src" width="50" height="50">
      <div class="right">
        <p class="p1">{{dynamic.friend}}</p>
        <p class="p2">{{dynamic.date}}</p>
        <p class="p3">{{dynamic.words}}</p>
        <div class="ul1">
           <span v-for="img in dynamic.image"><img :src="img.url" :width="img.width" :height="img.height"/></span>
        </div>
        <div class="star">
          <span v-link="{'name': 'newsNote', params: {id: dynamic.id}}"><img src="../assets/compile.png" width="20" height="20"/>{{dynamic.comNumber}}</span>
          <span><img src="../assets/star.png" width="20" height="20"/>{{dynamic.shaNumber}}</span>
          <span><img src="../assets/praise.png" width="20" height="20"/>{{dynamic.praNumber}}</span>
        </div>
        <div class="bottom" v-show="bottShow">
          <div class="ul2">
             <span v-for="face in dynamic.like"><img :src="face.url" width="20%" height="90"/></span>
          </div>
          <div class="person">
            <p v-for="com in comments" track-by="$index"><span>{{com.name}}</span>{{com.words}}</p>
          </div>
          <span v-show="moreShow" v-link="{'name': 'newsNote', params: {id: dynamic.id}}">想看更多....</span>
        </div>
      </div>
   </div>
</template>

<script>
export default {
      props:{
        "dynamic":{
          type: Object,
          required: true
        }
      },
      data(){
        return{
          comments:[],
          bottShow:true,
          moreShow:true,

        };
      },
  created() {
     this.load()
  },
  methods: {
    note(){
      let bott=document.getElementById("bott")
      bott.style.display="none"
      //console.log(this.dynamic.id)
    },
    filter(){
      for(let i=0;i<=2;i++){
        this.comments.push(this.dynamic.comments[i])
      }
    },
    load(){
      if(this.dynamic.like.length==0&&this.dynamic.comments.length==0){
        this.bottShow=false
      }else if(this.dynamic.comments.length<=3){
        this.moreShow=false
      }
      this.filter()
      //console.log(this.comments)
    },
  },
};
</script>

<style>
.page{width:100%;position:relative;margin-top:50px;border-bottom:1px solid red;}
.page>img{display:block;margin:10px 0 0 10px;position:absolute;}
.right{width:85%;margin-left:70px;}
.right .p1{font-size:18px;color:#d68a5a;padding:0;margin:0;height:24px;line-height:24px;}
.right .p2{font-size:14px;color:#9aa2a0;padding:0;margin:5px 0 0 0;height: 18px;line-height:18px}
.right .p3{font-size:18px;height:24px;line-height:24px;padding:0;margin:5px 0 10px 0;}
.ul1{width:100%;}
.star{width:100%;height:40px;margin-bottom:10px}
.star span{float:right;font-size:20px;
           width:80px;line-height:40px;text-align:center;}
.bottom{width:100%;margin-bottom: 20px;background-color:#eff0e9;}
.bottom .ul2{width:100%;display:block;border-bottom:1px solid #e0e0db;}
.person p{font-size:18px;height:30px;line-height:30px;color:#72736c;
          padding:0;margin:0 0 0 10px;
         }
.person p span{font-size:18px;color:#d68a5a}
.bottom>span{display:block;margin-left:80%;font-size:12px;
             height:25px;line-height:25px;}
</style>
