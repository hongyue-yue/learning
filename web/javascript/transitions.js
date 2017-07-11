var lastDoor = -1;
var pathi = 0;
var tour;
$(document).ready(
	function(){
		tourManager.getTourFromParams(onTourLoad);
	}	
);


var startSphere;
var endSphere;
var trans_list;
var lastHeight = 1;
var zoom = {x:0,y:0,xyz:[0,0,0]};

function createTransList(tlist,already){
	var zf = -5;
	if(tour.zfactor){
		zf = tour.zfactor;
	}
	for(var sid in tour.scenes){
		console.debug(sid);
		var scene = tour.scenes[sid];
		var paths = scene.paths;
		if(!paths){
			continue;
		}
		console.debug("proc paths");
		for(var sid2 in paths){
			var key = tkey(sid,sid2);
			if(!already[key]){
				already[key]=true;
				var p = paths[sid2];
				var z = -15;
				if(p.distance){
					z = zf * p.distance;
					if(z < -50){
						z = -50;
					}
				}
				tlist.push({start:sid,end:sid2,angle:paths[sid2].angle,xyz:[0,0,z]});
			}
		}
	}
	return tlist;
};

function tkey(sid,sid2){
	var key = null;
	if(sid2 > sid){
		key = sid+"##"+sid2;
	}
	else {
		key = sid2+"##"+sid;
	}
	console.debug(key);
	return key;
}
function onTourLoad(data){
	tour = data;
	var seen = {};
	if(tour.transitions){
		for(var i=0;i<tour.transitions.length;i++){
			var t = tour.transitions[i];
			console.debug(t);
			seen[tkey(t.start,t.end)]=true;
		}
	}
	else {
		tour.transitions = [];
	}
	trans_list = createTransList(tour.transitions,seen);
	//mainsphere = new SphereViewer( tourManager.get_url(tour_scenes[pathi].panorama));
	//mainsphere.onclick = moveForwards;
	//mainsphere.onholddown = moveForwards;
	var iframe = document.querySelector('#endscene');

	tpsphere = iframe.contentWindow.myviewer;
	var iframe = document.querySelector('#startscene');
	mainsphere = iframe.contentWindow.myviewer;
	setTimeout(loadViewers,100);
	$('#startcdiv').draggable({
	      cursor: "all-scroll",
	      cursorAt: { top: +15, left: +15 },
	      helper: function( event ) {
	        return $( "<div></div>" );
	      },
	      start: startTransMove,
	      drag: dragTransMove,
	      stop: endTransMove
	    });
	
	$('#startcdiv').on( 'mousewheel', adjustZ);
	$('#startcdiv').on( 'DOMMouseScroll', adjustZ);

}


function keyControls(e){
	var kc = e.keyCode;
	console.debug(kc);
	var update = false;
	var inc = (100+zoom.xyz[2])/100.0;
	console.debug(inc);
	if(kc=="38"){
		zoom.xyz[1]-=inc;		
		update = true;
	}
	else if(kc=="40"){
		zoom.xyz[1]+=inc;				
		update = true;
	}
	else if(kc=="37"){
		zoom.xyz[0]-=inc;		
		update = true;
	}
	else if(kc=="39"){
		zoom.xyz[0]+=inc;				
		update = true;
	}
	else if(kc=="190" || kc=="13"){
		nextScene();
	}
	else if(kc=="188"){
		prevScene();
	}
	else if(kc=="90"){
		zoom.xyz[2]-=1;				
		update = true;
	}
	else if(kc=="65"){
		zoom.xyz[2]+=1;				
		update = true;
	}
	else if(kc=="88"){
		$("#endscene").css("opacity",0.1);
	}
	if(update){
		setXYZ(zoom.xyz[0], zoom.xyz[1], zoom.xyz[2]);		
	}
}

function releaseKey(e){
	var kc = e.keyCode;
	console.debug(kc);
	if(kc=="88"){
		$("#endscene").css("opacity",1.0);
	}
}


function startTransMove( e, ui){
	zoom.x = e.pageX;
	zoom.y = e.pageY;
}

function dragTransMove(e, ui){
	var diffx = e.pageX - zoom.x;
	var diffy = e.pageY - zoom.y;
	var inc = (100+zoom.xyz[2])/100.0;

	zoom.xyz[0]-=(diffx * inc);
	zoom.xyz[1]-=(diffy * inc);
	setXYZ(zoom.xyz[0], zoom.xyz[1], zoom.xyz[2]);
	zoom.x = e.pageX;
	zoom.y = e.pageY;
}

function endTransMove(e, ui){
	
}
function startTransMove1( e, ui){
	zoom.x = e.pageX;
	zoom.y = e.pageY;
}

function dragTransMove1(e, ui){
}

function endTransMove1(e, ui){
	var diffx = e.pageX - zoom.x;
	var diffy = e.pageY - zoom.y;
	
	var iframe = document.querySelector('#startscene').contentWindow;
	var fullHeight = iframe.innerHeight;
	var ratio = lastHeight/fullHeight;
	var realDiffX = diffx * ratio;
	
	
	var rads = (startSphere.camera.fov/2) * (Math.PI/180);
	var adjacent = realDiffX/2;
	var distance = Math.abs(adjacent/Math.tan(rads));
	var ppp = fullHeight/100.0;

	var adjacent2 = fullHeight/2;
	var distance2 = Math.abs(adjacent2/Math.tan(rads));
	
	var diff = distance - distance2;
	var z= diff/ppp;
	zoom.xyz[2] = z;
	setXYZ(zoom.xyz[0], zoom.xyz[1], zoom.xyz[2]);
	
}

function loadViewers(){
	var iframe = document.querySelector('#endscene');
	endSphere = iframe.contentWindow.myviewer;
	iframe = document.querySelector('#startscene');
	startSphere = iframe.contentWindow.myviewer;
	
	if(endSphere && startSphere){
		setScene(0);
	}
	else {
		setTimeout(loadViewers,100);		
	}
}

function nextScene(){
	if(pathi<trans_list.length-1){
		setScene(pathi+1);
	}
}
function nextUndoneScene(){
	console.debug("AFsdfasdf");
	for(var i=pathi;i<trans_list.length;i++){
		var t = trans_list[i];
		console.debug(JSON.stringify(t.xyz));
		if(t.xyz[0]==0 && t.xyz[1]==0 && t.xyz[2]==-15){
			setScene(i);
			break;
		}
	}
}
function prevScene(){
	if(pathi>0){
		setScene(pathi-1);
	}
}
function setScene(index){
	pathi = index;
	var trans = trans_list[pathi];
	var start_scene = tour.scenes[trans.start];
	console.debug(start_scene);
	startSphere.setImage(tourManager.get_panorama(start_scene),start_scene.north,0);
	startSphere.controls.setHeading(trans.angle);

	var end_scene = tour.scenes[trans.end];
	console.debug(end_scene);
	endSphere.setImage(tourManager.get_panorama(end_scene),end_scene.north,0);
	endSphere.controls.setHeading(trans.angle);
	startSphere.camera.fov = endSphere.camera.fov;
	zoom.xyz = trans.xyz;
	setXYZ(zoom.xyz[0], zoom.xyz[1], zoom.xyz[2]);
}

function setOffset(x,y,w,h){
	var iframe = document.querySelector('#startscene').contentWindow;
	var fullWidth = iframe.innerWidth;
	var fullHeight = iframe.innerHeight;
	startSphere.camera.setViewOffset( fullWidth, fullHeight, x*fullWidth,y*fullHeight,w*fullWidth,h*fullHeight );
}

function setXYZ(x,y,z){
	
	var iframe = document.querySelector('#startscene').contentWindow;
	var fullWidth = iframe.innerWidth;
	var fullHeight = iframe.innerHeight;
	
	var ppp = fullHeight/100.0;
	
	var adjacent = fullHeight/2;
	var rads = (startSphere.camera.fov/2) * (Math.PI/180);
	var distance = Math.abs(adjacent/Math.tan(rads));

	var ratio = adjacent/distance;
	var ndist = distance+(z*ppp);
	var nadj = ndist*ratio;
	var height = nadj*2;
	lastHeight = height;
	
	var ratio2 = fullWidth/fullHeight;
	var width = ratio2 * height;
	
	
	var xp = ppp * x;
	var yp = ppp * y;
	
	var osTop = (fullHeight/2)-(height/2)+yp;
	var osLeft = (fullWidth/2)-(width/2)+xp;
	
	console.debug(distance+" "+xp+" "+yp+" "+width+" "+height+" "+fullWidth+" "+fullHeight);
	startSphere.camera.setViewOffset( fullWidth, fullHeight, osLeft,osTop,width,height );
}




function adjustZ( event ) {
	event = event.originalEvent;
	var change = 0;
	// WebKit

	if ( event.wheelDeltaY ) {

		change = event.wheelDeltaY * 0.05;

		// Opera / Explorer 9

	} else if ( event.wheelDelta ) {

		change = event.wheelDelta * 0.05;

		// Firefox

	} else if ( event.detail ) {

		change = event.detail * 1.0;

	}
	console.debug(event);
	console.debug(change);
	zoom.xyz[2]-=change;
	console.debug(zoom.xyz[2]);
	setXYZ(zoom.xyz[0], zoom.xyz[1], zoom.xyz[2])
};

function doTrans(){
	setXYZ(0,0,0);
	$( '#startscene' ).animate({
		opacity: 1.0,
	}, {
		duration: 1000,
	  progress: function( ani, now,we ) {
			setXYZ(zoom.xyz[0]*now, zoom.xyz[1]*now, zoom.xyz[2]*now);
	  },
	  complete: function(){
	  }
	});
}