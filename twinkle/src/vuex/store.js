import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state={
   friendList:[
           {name:"one",widthValue:6,heightValue:9,imgSrc:"http://7xl1xg.com2.z0.glb.qiniucdn.com/Like/0010.png"},
           {name:"two",widthValue:-10,heightValue:-15,imgSrc:"http://7xl1xg.com2.z0.glb.qiniucdn.com/Like/0006.png"}
   ],
    user:{
           usersImg:"http://jsfiddle.net/img/logo.png?1472463796549",
           users:"coder",
           day:"10",
           person:"10",
         },
    dynamicFeed:[{
      id:1,
      src:"http://jsfiddle.net/img/logo.png?1472463796549",
      friend:"coder",
      date:"9-1",
      lable:[{words:"心里住着男神"},{words:"好想谈恋爱"}],
      words:"时光就这样,静静地晒着~",
      praNumber:"",
      shaNumber:"",
      comNumber:1,
      image:[{url:"http://jsfiddle.net/img/logo.png?1472463796549",width:"33.3%",height:"120"},
             {url:"http://jsfiddle.net/img/logo.png?1472463796549",width:"33.3%",height:"120"},
             {url:"http://jsfiddle.net/img/logo.png?1472463796549",width:"33.3%",height:"120"},
             ],
      like:[{url:"http://7xl1xg.com2.z0.glb.qiniucdn.com/Like/0010.png"},
            {url:"http://7xl1xg.com2.z0.glb.qiniucdn.com/Like/0009.png"},
            {url:"http://7xl1xg.com2.z0.glb.qiniucdn.com/Like/0008.png"},
            {url:"http://7xl1xg.com2.z0.glb.qiniucdn.com/Like/0007.png"},
            {url:"http://7xl1xg.com2.z0.glb.qiniucdn.com/Like/0006.png"},
          ],
      comments:[
        {name:"老冯:",words:"这是什么群",date:"1小时前"},
      ]
    },
    {
      id:2,
      src:"http://jsfiddle.net/img/logo.png?1472463796549",
      friend:"john",
      date:"9-1",
      lable:[{words:"心里住着男神"},{words:"好想谈恋爱"}],
      words:"时光就这样,静静地晒着~",
      praNumber:5,
      shaNumber:"",
      comNumber:7,
      image:[{url:"http://jsfiddle.net/img/logo.png?1472463796549",width:"33.3%",height:"120"},
             {url:"http://jsfiddle.net/img/logo.png?1472463796549",width:"33.3%",height:"120"},
             {url:"http://jsfiddle.net/img/logo.png?1472463796549",width:"33.3%",height:"120"},
             ],
      like:[{url:"http://7xl1xg.com2.z0.glb.qiniucdn.com/Like/0010.png"},
            {url:"http://7xl1xg.com2.z0.glb.qiniucdn.com/Like/0009.png"},
            {url:"http://7xl1xg.com2.z0.glb.qiniucdn.com/Like/0008.png"},
            {url:"http://7xl1xg.com2.z0.glb.qiniucdn.com/Like/0007.png"},
            {url:"http://7xl1xg.com2.z0.glb.qiniucdn.com/Like/0006.png"},
          ],
     comments:[
            {name:"老马:",words:"这是什么群",date:"1小时前"},
            {name:"老冯:",words:"这是什么群1",date:"1小时前"},
            {name:"老黄:",words:"这是什么群2",date:"1小时前"},
            {name:"老朱:",words:"这是什么群3",date:"1小时前"},
            {name:"老孙:",words:"这是什么群4",date:"1小时前"},
            {name:"老李:",words:"这是什么群5",date:"1小时前"},
            {name:"老赵:",words:"这是什么群6",date:"1小时前"},
         ]
    }
  ],

    newsFeed:[{
      id:1,
      src:"http://jsfiddle.net/img/logo.png?1472463796549",
      friend:"twinkle官方",
      date:"7-23",
      words:"时光就这样,静静地晒着~",
      praNumber:5,
      shaNumber:"",
      comNumber:8,
      image:[{url:"http://jsfiddle.net/img/logo.png?1472463796549",width:"33.3%",height:"90"},
             {url:"http://jsfiddle.net/img/logo.png?1472463796549",width:"33.3%",height:"90"},
             {url:"http://jsfiddle.net/img/logo.png?1472463796549",width:"33.3%",height:"90"},
             ],
      like:[{url:"http://7xl1xg.com2.z0.glb.qiniucdn.com/Like/0010.png"},
            {url:"http://7xl1xg.com2.z0.glb.qiniucdn.com/Like/0009.png"},
            {url:"http://7xl1xg.com2.z0.glb.qiniucdn.com/Like/0008.png"},
            {url:"http://7xl1xg.com2.z0.glb.qiniucdn.com/Like/0007.png"},
            {url:"http://7xl1xg.com2.z0.glb.qiniucdn.com/Like/0006.png"},
          ],
     comments:[
               {url:"http://7xl1xg.com2.z0.glb.qiniucdn.com/Like/0009.png",name:"老冯:",words:"这是什么群",date:"1天前"},
               {url:"http://7xl1xg.com2.z0.glb.qiniucdn.com/Like/0010.png",name:"老马:",words:"这是什么群1",date:"2天前"},
               {url:"http://7xl1xg.com2.z0.glb.qiniucdn.com/Like/0011.png",name:"老朱:",words:"这是什么群2",date:"3天前"},
               {url:"http://7xl1xg.com2.z0.glb.qiniucdn.com/Like/0012.png",name:"老张:",words:"这是什么群3",date:"4天前"},
               {url:"http://7xl1xg.com2.z0.glb.qiniucdn.com/Like/0013.png",name:"老李:",words:"这是什么群4",date:"5天前"},
               {url:"http://7xl1xg.com2.z0.glb.qiniucdn.com/Like/0014.png",name:"老王:",words:"这是什么群5",date:"6天前"},
               {url:"http://7xl1xg.com2.z0.glb.qiniucdn.com/Like/0015.png",name:"老黄:",words:"这是什么群6",date:"7天前"},
               {url:"http://7xl1xg.com2.z0.glb.qiniucdn.com/Like/0016.png",name:"老赵:",words:"这是什么群7",date:"8天前"},
         ],
    },
    { id:2,
      src:"http://jsfiddle.net/img/logo.png?1472463796549",
      friend:"john",
      date:"7-30",
      words:"时光就这样,静静地晒着~",
      praNumber:"",
      shaNumber:"",
      comNumber:1,
      image:[{url:"http://jsfiddle.net/img/logo.png?1472463796549",width:"33.3%",height:"90"},
             {url:"http://jsfiddle.net/img/logo.png?1472463796549",width:"33.3%",height:"90"},
             {url:"http://jsfiddle.net/img/logo.png?1472463796549",width:"33.3%",height:"90"},
             ],
      like:[],
     comments:[{url:"http://7xl1xg.com2.z0.glb.qiniucdn.com/Like/0009.png",name:"老冯:",words:"这是什么群",date:"1天前"}],
    },
  ],

    storyFeed:[{
            src:"http://jsfiddle.net/img/logo.png?1472463796549",
            name:"异邦人之刃",
            date:"9-1",
            imgSrc:"http://jsfiddle.net/img/logo.png?1472463796549",
            words:"这都是我给你的爱啊!"
    },{
            src:"http://jsfiddle.net/img/logo.png?1472463796549",
            name:"异邦人之刃",
            date:"9-1",
            imgSrc:"http://jsfiddle.net/img/logo.png?1472463796549",
            words:"这都是我给你的爱啊!"
    }]

}

const mutations={
   NEWSFEED_PUSH(state,arr){
     for(let i=0;i<arr.length;i++){
       state.newsFeed.push(arr[i])
     }
   },
   NEWSFEED_UNSHIFT(state,obj){
       state.newsFeed.unshift(obj)
   },
   NEWSCOMMENTS_UNSHIFT(state,notesId,obj){
     for(let i=0;i<state.newsFeed.length;i++){
       if(state.newsFeed[i].id==notesId){
         state.newsFeed[i].comments.unshift(obj)
        state.newsFeed[i].comNumber=Number(state.newsFeed[i].comNumber)+1
       }
     }
   },
   DYNAMICFEED_PUSH(state,arr){
     for(let i=0;i<arr.length;i++){
       state.dynamicFeed.push(arr[i])
     }
   },
   DYNAMICCOMMENTS_UNSHIFT(state,notesId,obj){
     for(let i=0;i<state.dynamicFeed.length;i++){
       if(state.dynamicFeed[i].id==notesId){
         state.dynamicFeed[i].comments.unshift(obj)
        state.dynamicFeed[i].comNumber=Number(state.dynamicFeed[i].comNumber)+1
       }
     }
   },
   STORYFEED_PUSH(state,arr){
     for(let i=0;i<arr.length;i++){
       state.storyFeed.push(arr[i])
     }
   },
}

export default new Vuex.Store({
  state,
  mutations,
  strict: true
})
