<template>
     <div id="photos">
            <div id="pho">

                    <span class="photo_inner">
                        <img src="">
                    </span>

                    <span class="photo_inner">
                        <img src="" >
                    </span>

                    <span class="photo_inner">
                        <img src="" >
                    </span>

                    <span class="photo_inner">
                    <img src="" >
                    </span>

                    <span class="photo_inner">
                        <img src="" >
                    </span>

                    <span class="photo_inner">
                        <img src="" >
                    </span>
                    <span class="photo_inner">
                        <img src="" >
                    </span>
                    <span class="photo_inner">
                        <img src="" >
                    </span>
        </div>
    </div>
</template>
<script >
export default{
   ready: {
            function(){
               this.load();
                  }
           },
   methods: {
     load:function () {
             var area=document.getElementById("pho");
             var list=area.getElementsByTagName("span");
             var speed = 10;//滚动的速度
             var time;
             var delay= 2000;
             var liWidth=192;
             area.scrollLeft=0;
             area.innerHTML+=area.innerHTML;
             function startScroll(){
                 time=setInterval("scroll()",speed);
                 area.scrollLeft++;
             }
             function scroll(){
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
           setTimeout(startScroll,delay)
          /*window.onload=function(){
         //console.log(area.scrollWidth);
         timer=setInterval("scroll()",10);
         for(var i=0;i<list.length;i++){
         list[i].onmouseover=function(){
         clearInterval(time);
         }
         list[i].onmouseout=function(){
         timer=setInterval("scroll()",10);
         }
         }
         }

        function scroll(){
         area.scrollLeft++;
         if(area.scrollLeft >= area.scrollWidth/2){
         area.scrollLeft =0;
        }
        }*/
        }
        }
}
</script>
<style>
#photos{overflow:hidden;width:212px;border: 5px solid #a4bad6;
        margin: 0 auto;border-radius: 10px;box-shadow: 5px 5px 5px #ccc;}
#pho{overflow: hidden;width:192px;height: 343px;margin:10px}
.photo_inner{ vertical-align:middle;display:table-cell;}

</style>
