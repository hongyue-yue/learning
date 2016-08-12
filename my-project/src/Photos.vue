<template>
     <div id="photos">
            <div id="pho">

                    <span class="photo_inner">
                        <img src="./assets/image/P_06.jpg">
                    </span>

                    <span class="photo_inner">
                        <img src="./assets/image/P_07.jpg" >
                    </span>

                    <span class="photo_inner">
                        <img src="./assets/image/P_08.jpg" >
                    </span>

                    <span class="photo_inner">
                    <img src="./assets/image/P_09.jpg" >
                    </span>

                    <span class="photo_inner">
                        <img src="./assets/image/P_010.jpg" >
                    </span>

                    <span class="photo_inner">
                        <img src="./assets/image/P_011.jpg" >
                    </span>
        </div>
    </div>
</template>
<script type="text/javascript">
export default{
   ready:function(){
          this.load();
    },
   methods: {
     load:function(){
           var area=document.getElementById("pho");
           var list=area.getElementsByTagName("span");
           var speed = 10;//滚动的速度
           var time;
           var delay= 2000;
           var liWidth=192;
           area.scrollLeft=0;
           area.innerHTML+=area.innerHTML;
           function startScroll(){
             time=setInterval(move,speed);
             area.scrollLeft++;
           }
          function move(){
             if(area.scrollLeft % liWidth==0){
             clearInterval(time);
             setTimeout(startScroll,delay);
          }else{
             area.scrollLeft++;
             if(area.scrollLeft >= area.scrollWidth/2){
             area.scrollLeft =0;
             }
         }
       }
        setTimeout(startScroll,delay);
            },
        },
}
</script>
<style>
#photos{overflow:hidden;width:212px;border: 5px solid #a4bad6;
        margin: 0 auto;border-radius: 10px;box-shadow: 5px 5px 5px #ccc;}
#pho{overflow: hidden;width:192px;height: 343px;margin:10px}
.photo_inner{ vertical-align:middle;display:table-cell;}

</style>
