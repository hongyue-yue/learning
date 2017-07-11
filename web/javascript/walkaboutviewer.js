/*
 * Copyright Walkabout Worlds, LLC 2015-2016
 */

var currentScene;
var myviewer;
var tour;
var roomMap;
var editMode = false;
$(document).ready(function() {
	var params = getUrlParameters();
	if(params.cardboard){
		$('.desktop_help').css('display','none');
		$('.mobile_help').css('display','none');
	}
	else if(isMobile() && !params.desktop){
		$('.desktop_help').css('display','none');
		$('.vr_help').css('display','none');
	}
	else {
		$('.mobile_help').css('display','none');
		$('.vr_help').css('display','none');
	}
	if(params.editMode && params.editMode=="true"){
		editMode = true;
	}
	tourManager.getTourFromParams(onTourLoad,false);
});
var warningCount = 0;
var editor = {};
var audio = null;
var floorPlan = {
		"currentRoom":"",
		show: function(){
			myviewer.orientUpdate = floorPlan.rotate;
			$('#floor_plan_display').css('visibility','visible');			
		},
		rotate:function(heading,pitch){
			if(floorPlan.sceneref){
				floorPlan.sceneref.css('transform' , 'rotate('+ ((315+heading) % 360) +'deg)');
			}
		},
		close: function(){
			$('#floor_plan_display').css('visibility','hidden');
			myviewer.orientUpdate = null;

		},
		highlight: function(sceneid){
			console.debug(sceneid);
			$(".fp_marker").removeClass("fp_highlight");
			this.sceneref = $("#"+this.toID(sceneid));
			this.sceneid = sceneid;
			this.sceneref.addClass("fp_highlight");
			if(editMode){
				$("#edit_current_image").text(sceneid);
			}
		},
		setTopOfMap: function(){
			var scene = tour.scenes[this.sceneid];
			if(!scene.north){
				scene.north = 0;
			}
			var new_north = 360.0 - myviewer.lon + scene.north;
			scene.north = new_north;
			setScene(this.sceneid);
			if(myviewer.controls.rotateLeft){
				try {
					myviewer.controls.rotateLeft(-THREE.Math.degToRad(myviewer.lon));
				} catch (e){
					
				}
			}
		},
		setTopOfMapAll: function(){
			for(var i=0;i<this.scenes.length;i++){
				var scene = this.scenes[i];
				var new_north = 360.0 - myviewer.lon + scene.north;
				scene.north = new_north;				
			}
			setScene(this.sceneid);
			if(myviewer.controls.rotateLeft){
				try {
					myviewer.controls.rotateLeft(-THREE.Math.degToRad(myviewer.lon));
				} catch (e){
					
				}
			}
		},
		toID: function(sceneid){
			return "fp_"+sceneid.replace(/\./g, '_');
		},
		changeScene: function(sceneid,event){
			console.debug($(this).attr("sid"));
			setScene($(this).attr("sid"));			
		},
		move: function(e){
			if(!e.ctrlKey){
				return;
			}
			var img = $("#floor_plan_image");
			var x = e.pageX - img.offset().left;
			var y = e.pageY - img.offset().top;
			
			var scene = tour.scenes[currentScene];
			scene.floor = {x:x/img.width(),y:y/img.height()};
			$("#"+this.toID(currentScene)).css({top:y-15,left:x-15});
		},
		syncPositionData:function(elem){
			var sid = elem.attr("sid");
			var scene = tour.scenes[sid];
			var img = $("#floor_plan_image");
			var box = $("#floor_plan_display");
			var img_os = img.position();
			var os = elem.position();
			var x = os.left - img_os.left+15;
			var y = os.top - img_os.top+15;
			scene.floor = {x:x/box.width(),y:y/box.width()};
			
		},
		iterateScene:function(delta){
			var index = 0;
			var sid = this.sceneid;
			for(var i=0;i<this.scenes.length;i++){
				if(this.scenes[i].sceneid==sid){
					index = i;
					break;
				}
			}
			var new_index = (this.scenes.length+delta+index) % this.scenes.length;
			setScene(this.scenes[new_index].sceneid);
		},
		setRoom: function(room){
			if(room==this.currentRoom){
				return;
			}
			this.currentRoom = room;
			$('.fp_marker').remove();
			var box = $("#floor_plan_display");
			var rscenes = roomMap[room];
			this.scenes = rscenes;
			var img = $("#floor_plan_image");
			var img_os = img.position();
			if(tour.floorPlans[room]){
				img.attr("src",tourManager.get_url(tour.floorPlans[room]));
			}
			else {
				img.attr("src",tourManager.get_tile(rscenes[0]));
			}
			
			for(var i=0;i<rscenes.length;i++){
				var sc = rscenes[i];
				box.append($("<div>",{id:this.toID(sc.sceneid),sid:sc.sceneid,class:"fp_marker","style":"top:"+(img_os.top + sc.floor.y * box.width()-15)+"px; left:"+(img_os.left+sc.floor.x*box.width()-15)+"px;"}));
			}
			$(".fp_marker").click(floorPlan.changeScene);
			if(editMode){
				$(".fp_marker").draggable(			{
					stop: function(e){
						floorPlan.syncPositionData($(this));
						savePaths("floor",270);
						setScene(currentScene);
					}
				});
			}
		}
};
function onTourLoad(data) {
	tour = data;
	if(tour.title){
		document.title = tour.title;
	}
	if (tour.startScene) {
		currentScene = tour.startScene;
	} else {
		for ( var key in tour.scenes) {
			currentScene = key;
			break;
		}
	}
	if(tour.audio){
		audio = new Audio(tour.audio);
	}
	if(tour.floorPlans){
		$('#map_button').css('visibility','visible');
		fillins = {};
		for ( var key in tour.scenes) {
			var scene = tour.scenes[key];
			if(!scene.floor){
				var fi = fillins[scene.room];
				if(!fi){
					fi = 0;
				}
				var x = fi % 10;
				var y = parseInt(fi/10);
				scene.floor = {x:x*0.1+0.05,y:y*0.1+0.05};
				fi++;
				fillins[scene.room]=fi;
			}
		}
		window.addEventListener('resize', function() {
			var croom = floorPlan.currentRoom;
			floorPlan.currentRoom = null;
			floorPlan.setRoom(croom);
			floorPlan.highlight(currentScene);
		}, false);
		if(editMode){
			var editPanel = "<div id='edit_panel' style='padding: 5px;'><button onclick='saveAll(true)'>Save</button> <span id='edit_current_image'>N/A</span>"
				+" <button onclick='floorPlan.iterateScene(-1)'>&lt;</button><button onclick='floorPlan.iterateScene(1)'>&gt;</button>"
				+"  <button onclick='floorPlan.setTopOfMap()'>Set Top</button> <button onclick='floorPlan.setTopOfMapAll()'>Set Top All</button>";
			$("#floor_plan_display").append(editPanel);
			$("<button style='margin-left: 10px;' onclick='returnToOverview()'>Return To Overview</button>").insertAfter("#map_button");
			$("<button style='margin-left: 10px;' onclick='viewTour()'>View Tour</button>").insertAfter("#map_button");
			$("<button style='margin-left: 10px;' onclick='saveAll(true)'>Save</button>").insertAfter("#map_button");			
		}
	}

	myviewer = new SphereViewer(tourManager.get_url(getScene().panorama),tourManager.params);
	if(tourManager.params.cardboard || tourManager.params.compass || !isMobile()){
		$('#cardboard').css('visibility',"hidden");
		$('#compass').css('visibility',"hidden");
	}
	if(myviewer.vr){
		$('.notvr').css('display','none');
	}
	if (tour.startLon) {
		//myviewer.lon = tour.startLon;
		if(myviewer.controls.rotateLeft){
			try {
				myviewer.controls.rotateLeft(-THREE.Math.degToRad(tour.startLon));
			} catch (e){
				
			}
		}

	}
	if (tour.startLat) {
		myviewer.lat = tour.startLat;
	}
	window.addEventListener('resize', function() {
		onWindowResize();
	}, false);
	animate();
	roomMap = sceneUtil.roomMap(tour);
	var rms = populateRoomSelect("rooms", roomMap);
	rms.change(function(event) {
		var roomID = $('#rooms').val();
		var sceneList = roomMap[roomID];
		if (sceneList) {
			setScene(sceneList[0].sceneid);
		}
		$('#rooms').blur();
	});
	if (tour.tinyplanet) {
		myviewer.tpmode = true;
	}
	if (tour.autorotate) {
		myviewer.autorotate = true;
	}
	if(tour.single){
		stepThruHelp();
		$('#rooms').css('visibility','hidden');
	}
	else if(tour.skipWalkHelp){
		stepThruHelp();
	}

	
	editor.trans = {};
	var zfactor = 0;
	if(tour.zfactor){
		zfactor = tour.zfactor;
	}
	if(tour.transitions){
		for(var i=0;i<tour.transitions.length;i++){
			var t = tour.transitions[i];
			var key1 = t.start+"###"+t.end;
			editor.trans[key1]=t.xyz;
			var key2 = t.end+"###"+t.start;
			editor.trans[key2]=[-t.xyz[0],-t.xyz[1],t.xyz[2]];
		}
	}
	for(var sid in tour.scenes){
		var s1 = tour.scenes[sid];
		var p1 = s1.paths;
		for(var sid2 in p1){
			var s2 = tour.scenes[sid2];
			var p = p1[sid2];
			if(p.distance && zfactor!=0){
				if(editor.trans[key1]){
					continue;
				}
				var zoom = p.distance*zfactor;
				if(zoom < -50){
					zoom = -50;
				}
				editor.trans[key1]=[0,0,zoom];				
			}
		}
		
	}
	setTimeout(function() {
		setScene(currentScene);
	}, 1);
}

function returnToOverview(){
	saveAll(false,
			function(){
				window.open("WalkaboutSummary.html?tourid="+tourManager.tour_name, "_self");
			}
	);
}

function viewTour(){
	saveAll(false,
			function(){
				window.open("Walkabout.html?tour="+tourManager.base_url+"scenes.json", "_blank");
			}
	);	
}

function saveAll(showAlert,callback){
	savePaths("floor",270);
	saveTour(showAlert,callback);
	if(showAlert){
		setScene(currentScene);
	}
}

function warning(msg){
	if(tour.single || tour.skipWalkHelp){
		return;
	}
	warningCount = 60;
	$('#message').text(msg);
	$('#message').css('visibility','visible');
}

var helpStep = 1;
function stepThruHelp(){
	if(helpStep==1){
		nextHelp(this);
		helpStep++;
	}
	else {
		dismissHelp(this);  
	}
}
function nextHelp(help){
	$('#help1').css('display','none');
	$('#help2').css('visibility','visible');
}
function dismissHelp(help){
	$('#helpinfo').css('visibility','hidden');
	$('#help2').css('visibility','hidden');
	$('#transdiv').css('visibility','hidden');
	if(tourManager.params.cardboard){
		$(".uicontrol").css("visibility","hidden");
	}
	myviewer.onclick = function(){moveForwards(); };
	console.debug("Is VR: "+myviewer.vr);
	if(myviewer.vr || tourManager.params.compass){
		fullscreen(myviewer);
	}
	if(audio){
		audio.play();
	}
	if(myviewer.video){
		myviewer.video.play();
	}
}

function populateRoomSelect(selectID, rooms) {
	var roomNames = Object.keys(rooms);

	var rms = $("#" + selectID);
	rms.empty(); // remove old options
	for (var i = 0; i < roomNames.length; i++) {
		var roomName = roomNames[i];
		rms.append($("<option></option>").attr("value", roomName)
				.text(roomName));
	}
	return rms;
}

function moveAround(e) {
	e = e || window.event;
	
	myviewer.autorotate = false;

	if (e.keyCode == '38') {
		// up arrow
		if(e.shiftKey){
			var scene = getScene();
			var tmp = myviewer.getCameraHeading();
			var closest = sceneUtil.findClosestPath(scene,tmp);
			console.debug(closest);
			var path = scene.paths[closest.sceneid];
			if(!path.pitch){
				path.pitch = 120.0;
			}
			if(path.pitch > 10){
				path.pitch = path.pitch - 1;
			}
			path.lock = true;
			setScene(currentScene,tmp);
		}
		else {
			myviewer.controls.rotateUp(-0.05);
		}
	} else if (e.keyCode == '40') {
		// down arrow
		if(e.shiftKey){
			var scene = getScene();
			var tmp = myviewer.getCameraHeading();
			var closest = sceneUtil.findClosestPath(scene,tmp);
			console.debug(closest);
			var path = scene.paths[closest.sceneid];
			if(!path.pitch){
				path.pitch = 120.0;
			}
			if(path.pitch < 170){
				path.pitch = path.pitch + 1;
			}
			path.lock = true;
			setScene(currentScene,tmp);
		}
		else {
			myviewer.controls.rotateUp(0.05);
		}
	} else if (e.keyCode == '37') {
		// left arrow
		if(e.shiftKey){
			var scene = getScene();
			var tmp = myviewer.getCameraHeading();
			var closest = sceneUtil.findClosestPath(scene,tmp);
			console.debug(closest);
			var path = scene.paths[closest.sceneid];
			path.angle = (719.0 + path.angle) % 360.0;
			path.lock = true;
			setScene(currentScene,tmp);
		}
		else if(e.shiftKey){
			moveLeft();
		}
		else {
			myviewer.controls.rotateLeft(-0.05);
		}
	} else if (e.keyCode == '39') {
		if(e.shiftKey){
			var scene = getScene();
			var tmp = myviewer.getCameraHeading();
			var closest = sceneUtil.findClosestPath(scene,tmp);
			console.debug(closest);
			var path = scene.paths[closest.sceneid];
			path.angle = (721.0 + path.angle) % 360.0;
			setScene(currentScene,tmp);
		}
		// right arrow
		else if(e.shiftKey){
			moveRight();
		}
		else {
			myviewer.controls.rotateLeft(0.05);
		}
	} else if (e.keyCode == '65') {
		// A
		moveLeft();
	} else if (e.keyCode == '83') {
		// S
		moveBackwards();
	} else if (e.keyCode == '68') {
		// D
		moveRight();
	} else if (e.keyCode == '87') {
		// W
		moveForwards();
	} else if (e.keyCode == '67') {
		if(confirm("Take Screen Shot?")){
			takeScreenShot();
		}
	} else {
		console.debug(e.keyCode);
	}

}

var lastForwards = 0;

function getScene() {
	return tour.scenes[currentScene];
}
var lockMove = false;

var xyz = [0,0,0];
function WalkAnimator(gotoScene,diff){
	lockMove = true;
	this.scene = gotoScene;
	var key = currentScene+"###"+gotoScene;
	var xyz = editor.trans[key];
	if(!xyz){
		console.debug("No trans for "+key);
		xyz = [0,0,-15];
	}
	var tilt = 90-myviewer.getCameraTilt();
	this.xyz = rotate3D(xyz, -diff, -tilt);	
}

function updateXYZ(){
	var tmp = rotate3D(xyz,myviewer.getCameraHeading(), 90-myviewer.getCameraTilt());
	myviewer.setXYZ(tmp[0], tmp[1], tmp[2]);

} 

WalkAnimator.prototype.animate = function() {
	var vr = myviewer;
	var ref = this;
	var dur = Math.sqrt(ref.xyz[0]*ref.xyz[0] + ref.xyz[1]*ref.xyz[1] +ref.xyz[2]*ref.xyz[2]);
	dur*=20;
	if(tour.noanimate){
		setTimeout(function(){
			setScene(ref.scene, ref.finishAngle);
			lockMove = false;
		}, 10);
		return;
	}
		$( "#transimg" ).animate({
			opacity: 0.0,
		}, {
			duration: dur,
			progress: function( ani, now,we ) {
				vr.setXYZ(ref.xyz[0]*now, ref.xyz[1]*now, ref.xyz[2]*now);
			},
			complete: function(){
				vr.setXYZ(0,0,0);
				vr.ballAction = 0;
				setScene(ref.scene, ref.finishAngle);
				lockMove = false;
			}
		});
};



var walkAno = null;
function animateForward() {
	if (!walkAno) {
		return false;
	}
	return walkAno.animate();
}

function moveForwards(jumpTurn) {
	var ctime = moveOK();
	if (!ctime) {
		return;
	}
	if (myviewer.onupdate) {
		return;
	}
	var scene = getScene();
	var mydir = myviewer.getCameraHeading();
	if(tourManager.params.debug){
		console.debug("Direction "+Math.round(mydir)+" "+myviewer.facing+" "+myviewer.controls.heading);
	}
	var closest = sceneUtil.findClosestPath(scene, mydir);
	console.debug(mydir);
	if (closest == null) {
		return;
	}
	var max = tour.moveTolerance ? tour.moveTolerance : 40;
	if (Math.abs(closest.diff) > max) {
		warning("Cannot go that direction");
		return false;
	}
	clearWarning();
	lastForwards = ctime;
	WalkAnimator.distance = closest.distance;
	console.debug("Distance: "+closest.distance);
	walkAno = new WalkAnimator(closest.sceneid, closest.diff);
	myviewer.onupdate = animateForward;
	return true;
}

function rotateToTurn() {
	var scene = getScene();
	myviewer.lon = myviewer.getCameraHeading();
	var closest = sceneUtil.findClosestPath(scene, myviewer.lon);
	if (closest == null) {
		return;
	}
	if (Math.abs(closest.diff) > 10) {
		if (closest.diff < 0) {
			myviewer.lon = (360 + myviewer.lon + 1) % 360;
		} else {
			myviewer.lon = (360 + myviewer.lon - 1) % 360;
		}
		return true;
	}
	return false;
}

function moveOK() {
	myviewer.autorotate = false;
	if(lockMove){
		return null;
	}
	var ctime = new Date().getTime();
	return ctime;
}

function moveBackwards() {
	var ctime = moveOK();
	if (!ctime) {
		return;
	}
	var scene = getScene();
	myviewer.lon = myviewer.getCameraHeading();
	var closest = sceneUtil.findClosestPath(scene, (myviewer.lon + 180) % 360);
	if (closest == null) {
		return;
	}
	if (Math.abs(closest.diff) > 30) {
		warning("Cannot go that direction, automatically turning");
		if (closest.diff < 0) {
			myviewer.lon = (360 + myviewer.lon + 1) % 360;
		} else {
			myviewer.lon = (360 + myviewer.lon - 1) % 360;
		}
		return;
	}
	clearWarning();
	walkAno = new WalkAnimator(closest.sceneid, closest.diff+180);
	myviewer.onupdate = animateForward;
	lastForwards = ctime;
}

function moveRight() {
	var ctime = moveOK();
	if (!ctime) {
		return;
	}
	var scene = getScene();
	myviewer.lon = myviewer.getCameraHeading();
	var closest = sceneUtil.findClosestPath(scene, (myviewer.lon + 90) % 360);
	if (closest == null) {
		return;
	}
	if (Math.abs(closest.diff) > 30) {
		warning("Cannot go that direction");
		return;
	}
	clearWarning();
	walkAno = new WalkAnimator(closest.sceneid, closest.diff-90);
	myviewer.onupdate = animateForward;
	lastForwards = ctime;
}

function moveLeft() {
	var ctime = moveOK();
	if (!ctime) {
		return;
	}
	myviewer.lon = myviewer.getCameraHeading();
	var scene = getScene();
	var closest = sceneUtil.findClosestPath(scene, (myviewer.lon + 270) % 360);
	if (closest == null) {
		return;
	}
	if (Math.abs(closest.diff) > 30) {
		warning("Cannot go that direction");
		return;
	}
	clearWarning();
	walkAno = new WalkAnimator(closest.sceneid, (closest.diff+90)%360);
	myviewer.onupdate = animateForward;
	lastForwards = ctime;
}

function clearWarning(){
	warningCount = 0;
	$('#message').css('visibility','hidden');	
}
function setScene(sceneid, end_angle) {
	clearWarning();
	/*
	 * if(!first){ tour_scenes[pathi].room = $('#currentRoom').val(); }
	 */
	var scene = tour.scenes[sceneid];
	if (!scene) {
		console.debug("Could not find scene " + sceneid);
		return;
	}
	currentScene = sceneid;
	var warray = populateWalkArray(scene);
	
	myviewer.showBall = warray;
	myviewer.onball = 0;
	myviewer.setImage(tourManager.get_panorama(scene), scene.north, end_angle);
	myviewer.ballsVisible = true;
	/*
	 * if(s.room){ $('#currentRoom').val(s.room); }
	 */
	$('#rooms').val(scene.room);
	if(tour.floorPlans){
		floorPlan.setRoom(scene.room);
		floorPlan.highlight(scene.sceneid);
	}
}


function populateWalkArray(scene){
	var paths = scene.paths;
	var warray = [];
	var ballArray = [];
	if(myviewer.ballArray){
		for(var i=0;i<myviewer.ballArray.length;i++){
			myviewer.scene.remove(myviewer.ballArray[i].mesh);
		}
	}
	myviewer.ballArray = ballArray;
	for(var key in paths){
		var path = paths[key];
		var angle = Math.round(path.angle);
		var ws = myviewer.createWalkSphere(angle,path.pitch);
		if(!tour.hideGoLight){
			myviewer.scene.add(ws.mesh);
		}
		ballArray.push(ws);
		warray[angle]=ballArray.length;
		for(var i=0;i<25;i++){
			var left = (720 + angle - i)%360;
			var right = (angle + i)%360;
			if(warray[left]){
				var d1 = sceneUtil.degreeDiff(ws.heading,left);
				var d2 = sceneUtil.degreeDiff(ballArray[warray[left]-1].heading,left);
				if(Math.abs(d1) < Math.abs(d2)){
					warray[left] = ballArray.length;
				}
			}
			else {
				warray[left] = ballArray.length;
			}
			if(warray[right]){
				var d1 = sceneUtil.degreeDiff(ws.heading,right);
				var d2 = sceneUtil.degreeDiff(ballArray[warray[right]-1].heading,right);
				if(Math.abs(d1) < Math.abs(d2)){
					warray[right] = ballArray.length;
				}
			}
			else {
				warray[right] = ballArray.length;
			}
		}
	}
	return warray;
}

function animate() {
	if(warningCount > 0){
		warningCount--;
		if(warningCount <=0){
			clearWarning();
		}
	}
	requestAnimationFrame(animate);
	//updateXYZ();
	myviewer.update();
}

function debugNav() {
	var scene = getScene();
	console.debug(myviewer.lon + " " + JSON.stringify(scene.paths));
}

function addPath(sid){
	var s = getScene();
	if(s.paths[sid]){
		return false;
	}
	var s2 = tour.scenes[sid];
	if(!s2){
		return false;
	}
	var heading = myviewer.getCameraHeading();
	s.paths[sid] = {angle:heading,distance: 2};
	heading = (heading + 180) % 360;
	s2.paths[s.sceneid] = {angle:heading,distance:2};
}

function takeScreenShot() {
	window.open(myviewer.screenCapture(),"adsf");
}
