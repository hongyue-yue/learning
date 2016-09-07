<template>
<div class="outer">
  <div class="dynamic">
      <div class="dy_top">
         <img :src="dyna.src" width="50" height="50"/>
         <div class="dy_words">
            <p class="p1">{{dyna.friend}}</p>
            <p class="p2">{{dyna.date}}</p>
         </div>
         <div class="dy_lable">
           <span class="top_lable" v-for="lable in dyna.lable"><img src="../assets/praise.png" width="14" height="14"/>{{lable.words}}</span>
         </div>
      </div>
      <div class="dy_middle">
         <p>{{dyna.words}}</p>
         <div class="middle_img">
           <img :src="img.url" v-for="img in dyna.image" :width="img.width" :height="img.height"/>
         </div>
         <div class="dy_star">
           <span v-link="{'name': 'dynaNote', params: {id: dyna.id}}"><img src="../assets/compile.png" width="20" height="20"/>{{dyna.comNumber}}</span>
           <span><img src="../assets/star.png" width="20" height="20"/>{{dyna.shaNumber}}</span>
           <span><img src="../assets/praise.png" width="20" height="20"/>{{dyna.praNumber}}</span>
         </div>
      </div>
      <div class="dy_bottom" v-show="bottShow">
        <div class="bottom_img">
           <img :src="face.url" width="10%" height="50" v-for="face in dyna.like"/>
        </div>
        <div class="bottom_pre">
          <p v-for="person in comments" track-by="$index"><span>{{person.name}}</span>{{person.words}}</p>
        </div>
        <span v-show="moreShow">想看更多....</span>
      </div>
  </div>
</div>
</template>

<script>
export default {
  props:{
    "dyna":{
      type: Object,
      required: true
    }
  },
  data() {
    return {
      comments:[],
      bottShow:true,
      moreShow:true,
         }
  },
  ready(){
    this.load()
  },
  methods: {
    filter(){
      for(let i=0;i<=2;i++){
        this.comments.push(this.dyna.comments[i])
      }
    },
    load(){
      if(this.dyna.like.length==0&&this.dyna.comments.length==0){
        this.bottShow=false
      }else if(this.dyna.comments.length<=3){
        this.moreShow=false
      }
      this.filter()
    },
  },
};
</script>

<style>
.outer{width:100%;margin-top:10px;border-bottom:1px solid red;}
.dynamic{width:96%;margin:10px 10px 0 10px;position:relative;}
.dy_top img{margin-right:10px;}
.dy_words{height:50px;position:absolute;left:12%;top:5px;}
.dy_words p{height:25px;line-height:25px;margin:0}
.dy_words .p1{font-size:20px;color:#daa449;}
.dy_words .p2{font-size:16px;color:#9497aa;}
.dy_lable{width:100%;height:30px;}
.top_lable{display:block;border-radius:5px;padding:5px;
           border:1px solid #ebc27e;margin:8px 5px 0 0;float:left;font-size:14px;}
.top_lable img{margin:0 5px -2px 0;}

.dy_middle{width:100%;margin:20px 0 0 0px;}
.dy_middle p{height:30px;line-height:30px;font-size:18px;margin:0;}
.dy_star{width:98%;height:40px;}
.dy_star span{float:right;font-size:20px;
              width:80px;line-height:40px;text-align:center;}

.bottom_pre p{font-size:18px;height:26px;line-height:26px;color:#72736c;
              padding:0;margin:0;}
.bottom_pre p span{font-size:18px;color:#d68a5a;}
.dy_bottom>span{display:block;margin-left:80%;font-size:12px;
                height:25px;line-height:25px;}
</style>
