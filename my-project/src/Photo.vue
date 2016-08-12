<template>
     <div id="photo">
            <div id="phot">

                    <span class="photo_inner">
                        <img src="./assets/image/P_00.jpg">
                    </span>

                    <span class="photo_inner">
                        <img src="./assets/image/P_01.jpg" >
                    </span>

                    <span class="photo_inner">
                        <img src="./assets/image/P_02.jpg" >
                    </span>

                    <span class="photo_inner">
                        <img src="./assets/image/P_03.jpg" >
                    </span>

                    <span class="photo_inner">
                        <img src="./assets/image/P_04.jpg" >
                    </span>

                    <span class="photo_inner">
                        <img src="./assets/image/P_05.jpg" >
                    </span>
        </div>
    </div>
</template>
<script>
export default{
   ready:function(){
          this.loader();
    },
   methods: {
     loader:function(){
          var tag=document.getElementById("phot");
          var lis=tag.getElementsByTagName("span");
          var timer;
          tag.scrollLeft=0;
          tag.innerHTML+=tag.innerHTML;
          timer=setInterval(scroll,20);
          for(var i=0;i<lis.length;i++){
           lis[i].onmouseover=function(){
        	  clearInterval(timer);
          }
          lis[i].onmouseout=function(){
        	  timer=setInterval(scroll,20);
          }
          }
          function scroll(){
          tag.scrollLeft++;
          if(tag.scrollLeft >= tag.scrollWidth/2){
              tag.scrollLeft =0;
              }
          }
    },

},
}
</script>
<style>
#photo{overflow:hidden;width:212px;border: 5px solid #a4bad6;
        margin: 0 auto;border-radius: 10px;box-shadow: 5px 5px 5px #ccc;}
#phot{overflow: hidden;width:192px;height: 288px;margin:10px}
.photo_inner{ vertical-align:middle;display:table-cell;}
</style>
