<style>
.near{position:relative;}
#canvas{margin:0;position:absolute;top:0;left:0;z-index:3;}
#canvasTwo{margin:0;position:absolute;top:0;left:0;z-index:0;}
#canvasThree{margin:0;position:absolute;top:0;left:0;z-index:1;}
#canvasFour{margin:0;position:absolute;top:270px;left:220px;z-index:2;}
#canvasFive{margin:0;position:absolute;top:0;left:0;z-index:4;}
.friendList{position:absolute;top:10px;right:10px;z-index:5;width:70px;height:70px;}
.friendList img{display:block;margin:0 auto;}
.friendList span{color:rgb(76, 214, 206);font-size:14px;display:block;width:70px;text-align:center;}
</style>

<template >
  <div class="near">
    <canvas id="canvas" width="500" height="700"></canvas>
    <canvas id="canvasTwo" width="500" height="700"></canvas>
    <canvas id="canvasThree" width="500" height="700"></canvas>
    <canvas id="canvasFour" width="60" height="60"></canvas>
    <canvas id="canvasFive" width="500" height="700"></canvas>
    <div class="friendList">
      <img src="../assets/people.png" width="50" height="50"/>
      <span>好友列表</span>
    </div>
  </div>
</template>

<script>
export default {
  vuex:{
    getters:{
      friendList:state=>state.friendList,
      user:state=>state.user,
    },
  },
  ready() {
    this.load()
  },
  methods: {
      load(){
              let that=this
              that.drawFive()
              that.drawTwo()
              that.drawFour()
              window.requestAnimationFrame(function(){
                that.draw()
                that.drawThree()
              });

      },
      init(){
              let time=new Date()
              let a
              a=(Math.sin(((2*Math.PI)/10)*time.getSeconds()+((2*Math.PI)/10000)*time.getMilliseconds() )+1.5)/10
              return a
      },
      ballArc(x, y, radius,color,id){
              let ctx=document.getElementById(id).getContext('2d')
              ctx.beginPath()
              ctx.arc(x, y, radius, 0, Math.PI*2, false)
              ctx.closePath()
              ctx.fillStyle = color
              ctx.fill()
         },
      drawFive(){
              let ctxFive = document.getElementById("canvasFive").getContext("2d")
              ctxFive.translate(250,300)
              if(this.friendList.length){
                for(let i=0;i<this.friendList.length;i++){
                    let image = new Image()
                    image.src =this.friendList[i].imgSrc
                    let m=this.friendList[i].widthValue
                    let n=this.friendList[i].heightValue
                    image.onload = function(){
                    ctxFive.drawImage(image,10*m,10*n,30,30)
                  }
                }
              }

      },
      drawFour(){
              let canvas = document.getElementById("canvasFour").getContext("2d")
              let image = new Image()
              image.src =this.user.usersImg
              image.onload = function(){
                canvas.drawImage(image,1,1,58,58)
              }
              canvas.beginPath()
              canvas.arc(30,30,32,0,Math.PI*2,true)
              canvas.clip()
      },
       drawThree(){
              let ctxThree=document.getElementById('canvasThree').getContext('2d')
              let timer=new Date()
              ctxThree.clearRect(0,0,500,700)
              ctxThree.save()
              ctxThree.rotate( ((2*Math.PI)/20)*timer.getSeconds() + ((2*Math.PI)/20000)*timer.getMilliseconds())
              this.ballArc(230,170,4,'rgba(215, 104, 242,0.5)','canvasThree')
              this.ballArc(200,200,3,'rgba(176, 65, 108,0.3)','canvasThree')
              this.ballArc(189,210,2,'rgba(61, 215, 47,0.7)','canvasThree')
              this.ballArc(100,360,5,'rgba(16, 179, 203,0.6)','canvasThree')
              this.ballArc(300,200,1,'rgba(2, 55, 157,0.5)','canvasThree')
              this.ballArc(170,160,15,'rgba(97, 89, 23, 0.65)','canvasThree')
              this.ballArc(177,164,2,'rgba(130, 210, 123,0.4)','canvasThree')
              this.ballArc(160,165,3,'rgba(182, 106, 106,0.8)','canvasThree')
              this.ballArc(170,154,1,'rgba(146, 101, 181,0.5)','canvasThree')
              ctxThree.beginPath()
              ctxThree.arc(170,160,26,0,Math.PI*2,false)
              ctxThree.arc(170,160,18,0,Math.PI*2,false)
              ctxThree.fillStyle = 'rgba(43, 195, 117, 0.26)'
              ctxThree.fill("evenodd")
              ctxThree.restore()
              let that=this
              window.requestAnimationFrame(function(){that.drawThree()})
       },
       drawTwo(){
             let ctxTwo = document.getElementById('canvasTwo').getContext('2d')
             let background = ctxTwo.createLinearGradient(0,0,0,600)
             background.addColorStop(0, 'rgb(61, 40, 64)')
             background.addColorStop(0.7, 'rgb(144, 140, 144)')
             background.addColorStop(1, 'rgb(242, 239, 162)')
             ctxTwo.fillStyle = background
             ctxTwo.fillRect(0,0,500,700)
       },
       draw(){
              let earth=new Image()
              let moon=new Image()
              moon.src = 'https://mdn.mozillademos.org/files/1443/Canvas_moon.png'
              earth.src = 'https://mdn.mozillademos.org/files/1429/Canvas_earth.png'


              let ctx= document.getElementById('canvas').getContext('2d')
              let time=new Date()
              ctx.globalCompositeOperation = 'destination-over'
              ctx.clearRect(0,0,500,700)


              ctx.save()
              ctx.translate(250,300)
              ctx.save()
              ctx.fillStyle = '#FFF'
              ctx.globalAlpha =this.init()
              for (var i=3;i<6;i++){
              ctx.beginPath()
              ctx.arc(0,0,10+10*i,0,Math.PI*2,true)
              ctx.fill()
              }
              ctx.restore()


              ctx.save()
              ctx.rotate( ((2*Math.PI)/20)*time.getSeconds() + ((2*Math.PI)/20000)*time.getMilliseconds() )
              ctx.translate(200,0);
              ctx.beginPath();
              ctx.arc(-60,20,14,0,Math.PI*2,false)
              ctx.arc(-60,20,10,0,Math.PI*2,false)
              ctx.fillStyle = 'rgba(236, 237, 240, 0.12)'
              ctx.fill("evenodd")
              this.ballArc(-60,20,8,'rgba(20, 24, 116, 0.61)','canvas')
              this.ballArc(-62,18,2,'rgb(27, 140, 32)','canvas')
              ctx.restore()

              ctx.save()
              ctx.rotate( ((2*Math.PI)/10)*time.getSeconds() + ((2*Math.PI)/10000)*time.getMilliseconds() )
              this.ballArc(50,0,2,'rgb(215, 104, 242)','canvas')
              this.ballArc(58,-10,2,'rgb(94, 68, 236)','canvas')
              this.ballArc(64,-20,2,'rgb(118, 224, 96)','canvas')
              this.ballArc(68,-30,2,'rgb(123, 220, 236)','canvas')
              this.ballArc(70,-40,2,'rgb(231, 196, 90)','canvas')

              this.ballArc(0,50,2,'rgb(215, 104, 242)','canvas')
              this.ballArc(10,58,2,'rgb(94, 68, 236)','canvas')
              this.ballArc(20,64,2,'rgb(118, 224, 96)','canvas')
              this.ballArc(30,68,2,'rgb(123, 220, 236)','canvas')
              this.ballArc(40,70,2,'rgb(231, 196, 90)','canvas')

              this.ballArc(0,-50,2,'rgb(215, 104, 242)','canvas')
              this.ballArc(-10,-58,2,'rgb(94, 68, 236)','canvas')
              this.ballArc(-20,-64,2,'rgb(118, 224, 96)','canvas')
              this.ballArc(-30,-68,2,'rgb(123, 220, 236)','canvas')
              this.ballArc(-40,-70,2,'rgb(231, 196, 90)','canvas')

              this.ballArc(-50,0,2,'rgb(215, 104, 242)','canvas')
              this.ballArc(-58,10,2,'rgb(94, 68, 236)','canvas')
              this.ballArc(-64,20,2,'rgb(118, 224, 96)','canvas')
              this.ballArc(-68,30,2,'rgb(123, 220, 236)','canvas')
              this.ballArc(-70,40,2,'rgb(231, 196, 90)','canvas')
              ctx.restore()

              ctx.save()
              ctx.rotate( ((2*Math.PI)/60)*time.getSeconds() + ((2*Math.PI)/60000)*time.getMilliseconds() )
              ctx.translate(200,0)
              ctx.globalAlpha=0.4
              ctx.drawImage(earth,-12,-12)

              ctx.save()
              ctx.rotate(((2*Math.PI)/6)*time.getSeconds() + ((2*Math.PI)/6000)*time.getMilliseconds() )
              ctx.translate(30,0)
              ctx.drawImage(moon,-4,-4)
              ctx.restore()
              ctx.restore()

              ctx.restore()


              ctx.beginPath()
              ctx.moveTo(0,540)
              ctx.quadraticCurveTo(20,540,40,570)
              ctx.quadraticCurveTo(120,520,180,600)
              ctx.quadraticCurveTo(230,590,260,630)
              ctx.quadraticCurveTo(320,550,400,580)
              ctx.quadraticCurveTo(440,520,500,540)
              ctx.quadraticCurveTo(500,600,500,640)
              ctx.quadraticCurveTo(250,640,0,640)
              ctx.quadraticCurveTo(0,600,0,540)
              ctx.fillStyle='rgba(159, 182, 103, 0.64)'
              ctx.fill()
              ctx.beginPath()
              ctx.moveTo(0,550)
              ctx.quadraticCurveTo(20,550,40,580)
              ctx.quadraticCurveTo(120,530,180,610)
              ctx.quadraticCurveTo(230,600,260,640)
              ctx.quadraticCurveTo(320,560,400,590)
              ctx.quadraticCurveTo(440,530,500,550)
              ctx.quadraticCurveTo(500,600,500,640)
              ctx.quadraticCurveTo(250,640,0,640)
              ctx.quadraticCurveTo(0,600,0,550)
              ctx.fillStyle='rgba(122, 150, 53, 0.64)'
              ctx.fill()

              let that=this
              window.requestAnimationFrame(function(){that.draw()})
            },
  },

};
</script>
