var myviewer;
var lastDoor = -1;
var pathi = 0;
var tour;
var tour_scenes = [];
$(document).ready(
	function(){
		tourManager.getTourFromParams(onTourLoad);
	}	
);

var tinyi = 0;



function createScenesList(t){
	var list = [];
	for(var key in t.scenes){
		list.push(t.scenes[key]);
		//t.scenes[key].doors = [];
	}
	list.sort(function(a,b){ 
		if(a.sceneid < b.sceneid){
			return -1;
		}
		else if(a.sceneid==b.sceneid){
			return 0;
		}
		else {
			return 1;
		}
	});
	return list;
}
var tpsphere;
function onTourLoad(data){
	tour = data;
	tour_scenes = createScenesList(tour);
	myviewer = new SphereViewer( tourManager.get_url(tour_scenes[pathi].panorama));
	//myviewer.onclick = moveForwards;
	//myviewer.onholddown = moveForwards;
	window.addEventListener( 'resize', onWindowResize, false );
	animate();
	var iframe = document.querySelector('#tinyplanet');

	tpsphere = iframe.contentWindow.myviewer;
	setTimeout(function(){setScene(0,true);},2000);
	
	
	$('#istrail').change(function() {
        if($(this).is(":checked")) {
        	$('#doorControls').css('visibility',"hidden");
        }
        else{
        	$('#doorControls').css('visibility',"visible");
        }
    });
	
	var roomMap = sceneUtil.roomMap(tour);
	var rms = populateRoomSelect("rooms", roomMap);
	$('#rooms').on('change', function() {
		  var room = $(this).val();
		  for(var i=0;i<tour_scenes.length;i++){
			  if(tour_scenes[i].room==room){
				  tinyi = i;
				  updateTinyPlanet();
				  break;
			  }
		  }
	});
	rms = populateRoomSelect("rooms_main", roomMap);
	$('#rooms_main').on('change', function() {
		  var room = $(this).val();
		  for(var i=0;i<tour_scenes.length;i++){
			  if(tour_scenes[i].room==room){
				  setScene(i);
				  break;
			  }
		  }
	});
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


function nextTiny(){
	if(tinyi < tour_scenes.length - 1){
		tinyi++;
	}
	updateTinyPlanet();
}

function syncTiny(){
	tinyi = pathi;
	updateTinyPlanet();
}

function prevTiny(){
	if(tinyi > 0){
		tinyi--;
	}
	updateTinyPlanet();
}

function updateTinyPlanet(){
	console.debug("tinyi "+tinyi);
	var nexts = tour_scenes[tinyi];
	tpsphere.setImage(tourManager.get_url(nexts.panorama),nexts.north,myviewer.lon);		
}

function moveAround(e){
	var c = e.keyCode;
	console.debug(c);
	var pathlist = tour_scenes;
	if(c=='110'){
		if(pathi < pathlist.length - 1){
			setScene(pathi+1);
		}
		else {
			alert("You have reached the end of the lists");
		}
	}
	else if(c=='98'){
		if(pathi > 0){
			setScene(pathi-1);
		}
		else {
			alert("You have reached the beginning of the list");
		}
	}
	else if(c=='114'){
		var room = $('#currentRoom').val();
		room = prompt("Current Room",room);
		if(!room){
			return;
		}
		$('#currentRoom').val(room);
	}
	else if(c=='116'){
		console.debug(myviewer.lat + " " + calculateDistance(6));
		roomReference();
		//console.debug(myviewer.lat+ " "+ myviewer.lon);
	}
	else if(c=='104'){
		var distance = calculateDistance(6);
		console.debug("Heading "+distance + " " + myviewer.lon);
	}
	else if(c=='100'){
		doorReference();
		console.debug("Heading "+distance + " " + myviewer.lon);
	}
	else if(c=='68'){
		showDoorReference();
		console.debug("Heading "+distance + " " + myviewer.lon);
	}
	else if(c=='119'){
		moveForwards();
	}
	else if(c=='115'){
		moveBackwards();
	}
}

function setNorth(){
	var north = myviewer.lon;
	if(tour_scenes[pathi].north){
		north = (tour_scenes[pathi].north + north) % 360;
	}
	tour_scenes[pathi].north = north;
	myviewer.mesh.rotation.y = THREE.Math.degToRad(north);
	myviewer.lon = 0;
	console.debug("Heading "+north + " " + myviewer.lon);
	
}
var lastForwards = 0;
function moveForwards(){
	var ctime = new Date().getTime();
	if(ctime - lastForwards < 700){
		return;
	}
	var scene = tour_scenes[pathi];
	var closest = sceneUtil.findClosestPath(scene, myviewer.lon);
	if(closest==null){
		return;
	}
	if(Math.abs(closest.diff) > 30){
		if(closest.diff < 0){
			myviewer.lon = (360 + myviewer.lon + 4) % 360;
		}
		else {
			myviewer.lon = (360 + myviewer.lon - 4) % 360;			
		}
		return;
	}
	lastForwards = ctime;
	var id = findSceneID(closest.sceneid);
	setScene(id, false, true,closest.end_angle);
}


function moveBackwards(){
	var scene = tour_scenes[pathi];
	var closest = sceneUtil.findClosestPath(scene, (myviewer.lon + 180) % 360);
	if(closest==null){
		return;
	}
	if(Math.abs(closest.diff) > 45){
		return;
	}
	var id = findSceneID(closest.sceneid);
	setScene(id, false, true);
}

function setScene(index,first,keepDirection,end_angle){
	if(!first){
		tour_scenes[pathi].room = $('#currentRoom').val();
	}
	pathi = index;
	var s = tour_scenes[pathi];
	myviewer.setImage(tourManager.get_url(s.panorama),s.north,end_angle);
	$("#sceneid").text(s.sceneid);
	if(s.room){
		$('#currentRoom').val(s.room);
	}
	if(s.coords){
		$('#scene_coords').text(s.coords.x+" "+s.coords.y);
	}
	else {
		$('#scene_coords').text("N/A");		
	}
	if(s.room_ref && !keepDirection){
		myviewer.lat = s.room_ref.lat;
		myviewer.lon = s.room_ref.lon;
		lastDoor = -1;
	}
	listDoors(s.doors);
	if(pathi+1 < tour_scenes.length){
		var nexts = tour_scenes[pathi + 1];
		tinyi = pathi + 1;
		tpsphere.setImage(tourManager.get_url(nexts.panorama),nexts.north,end_angle);		
	}
}

function findScene(sid){
	var scenes = tour_scenes;
	for(var i=0;i<scenes.length;i++){
		if(scenes[i].sceneid==sid){
			return scenes[i];
		}
	}
	return null;
}

function findSceneID(sid){
	var scenes = tour_scenes;
	for(var i=0;i<scenes.length;i++){
		if(scenes[i].sceneid==sid){
			return i;
		}
	}
	return -1;
}

function addRefPoint(){
	var scene = tour_scenes[pathi];
	if(!scene.coords){
		alert("You can only add ref points from a scene with coordinates");
		return;
	}
	var refName = prompt("Reference Name",$('#currentRoom').val()+"_ref");
	if(!refName){
		return;
	}
	if(tour.refpoints[refName]){
		alert(refName+" already exists");
	}
	var distance = calculateDistance(6);
	console.debug("Heading "+distance + " " + myviewer.lon);
	// x=5cos,and y=5sin
	var x = (distance * Math.cos(myviewer.lon * (Math.PI/180))) + scene.coords.x;
	var y = (distance * Math.sin(myviewer.lon * (Math.PI/180))) + scene.coords.y;
	tour.refpoints[refName] = {x:x,y:y};	
}
function tiePoints(){
	var scene = tour_scenes[pathi];
	var tieto = tour_scenes[pathi - 1].sceneid;
	tieto = prompt("Tie to scene",tieto);
	if(!tieto){
		return;
	}
	var prevscene = findScene(tieto);
	if(prevscene==null){
		alert("No scene with id "+tieto);
		return;
	}
	if(!prevscene.coords){
		alert("Scene "+tieto+" doesn't have any coordinates");
		return;
	}
	var distance = calculateDistance(6);
	console.debug("Heading "+distance + " " + myviewer.lon);
	// x=5cos,and y=5sin
	myviewer.lon = (myviewer.lon +720) % 360;
	var x = distance * Math.cos(myviewer.lon * (Math.PI/180));
	var y = distance * Math.sin(myviewer.lon * (Math.PI/180));
	console.debug("offset "+x+" "+y);
	scene.coords = {x:prevscene.coords.x - x,y:prevscene.coords.y-y};
	console.debug(JSON.stringify(scene.coords));
}

function roomReference(gotoNext){
	var scene = tour_scenes[pathi];
	myviewer.lon = (myviewer.lon +720) % 360;
	var distance = calculateDistance(6);
	console.debug("Heading "+distance + " " + myviewer.lon);
	// x=5cos,and y=5sin
	var x = distance * Math.cos(myviewer.lon * (Math.PI/180));
	var y = distance * Math.sin(myviewer.lon * (Math.PI/180));
	console.debug("offset "+x+" "+y);
	// inverse grid system
	scene.coords = {x:x,y:y};
	scene.room_ref = {lat:myviewer.lat,lon:myviewer.lon};
	console.debug(JSON.stringify(scene.coords));
	$('#scene_coords').text(scene.coords.x+" "+scene.coords.y);
	if(gotoNext && pathi < tour_scenes.length -1){
		setScene(pathi+1);
	}
}

function deleteDoor(toPlace){
	var scene = tour_scenes[pathi];
	var doors = scene.doors;
	if(doors==null){
		return;
	}
	var newdoors = [];
	for(var i=0;i<doors.length;i++){
		if(doors[i].join!=toPlace){
			newdoors.push(doors[i]);
		}
	}
	scene.doors = newdoors;
	listDoors(scene.doors);
}

function trailLink(){
	doorReference(true,true);
}
function doorReference(useTPID,trail){
	var scene = tour_scenes[pathi];
	var distance = calculateDistance(6);
	console.debug("Heading "+distance + " " + myviewer.lon);
	// x=5cos,and y=5sin
	var x = distance * Math.cos(myviewer.lon * (Math.PI/180));
	var y = distance * Math.sin(myviewer.lon * (Math.PI/180));
	console.debug("offset "+x+" "+y);
	
	// inverse grid system
	if(!scene.doors){
		scene.doors = [];
	}
	var doorID = tour_scenes[tinyi].sceneid;
	if(!doorID){
		return;
	}
	var data = {lat:myviewer.lat,lon:myviewer.lon, join: doorID};
	for(var i=0;i<scene.doors.length;i++){
		if(scene.doors[i].join == doorID){
			scene.doors[i] = data;
			data = null;
		}
	}
	if(data!=null){
		scene.doors.push({lat:myviewer.lat,lon:myviewer.lon, join: doorID, trail:true});		
	}
	
	console.debug("HMMM "+doorID+" "+tour_scenes[pathi].sceneid);
	listDoors(scene.doors);
	console.debug(JSON.stringify(scene.coords));
	goThruDoor(doorID,myviewer.lat,myviewer.lon);
}

function listDoors(doors){
	$('#doors').empty();
	if(!doors){
		return;
	}
	var html="";
	for(var i=0;i<doors.length;i++){
		var door = doors[i];
		html+="<a onclick='showDoor("+door.lat+","+door.lon+",\""+door.join+"\")'  href='javascript:void(0);'>"+door.join+"</a> " +
		"<a onclick='goThruDoor(\""+door.join+"\","+door.lat+","+door.lon+")'  href='javascript:void(0);'>Go Thru</a> "+
		"<a onclick='deleteDoor(\""+door.join+"\")'  href='javascript:void(0);'>Delete</a> "+
		"<br/>";
	}
	$("#doors").html(html);
}

function showDoor(lat,lon,doorID){
	myviewer.lat = lat;
	myviewer.lon = lon;
	tinyi = findSceneID(doorID);
	updateTinyPlanet();
}

function doorReturn(){
	if(lastDoor!=-1){
		setScene(lastDoor,false,true);
	}
}

function createTrail(){
	for(var i=0;i<tour_scenes.length-1;i++){
		var scene = tour_scenes[i];
		scene.north = 0;
		scene.doors=[{lat:-45,lon:180, join: tour_scenes[i+1].sceneid}];
	}
	setScene(pathi, false, true);
}

function goThruDoor(sid,lat,lon){
	var index = findSceneID(sid);
	if(index==-1){
		alert("Could not find "+sid);
		return;
	}
	tinyi = index;
	lastDoor = pathi;
	showDoor(lat,lon,sid);
	setScene(index,false,true);
	updateTinyPlanet();
}

function addPathAction(){
	doorReference(true);
}

function animate() {
	requestAnimationFrame( animate );
	myviewer.update();
	if(tpsphere){
		tpsphere.lat = myviewer.lat;
		tpsphere.lon = myviewer.lon;
		if(tpsphere.camera.fov!=myviewer.camera.fov){
			tpsphere.camera.fov=myviewer.camera.fov;
			tpsphere.camera.updateProjectionMatrix();
		}
	}
	else {
		var iframe = document.querySelector('#tinyplanet');

		tpsphere = iframe.contentWindow.myviewer;

	}

}

function calculateDistance(height){
	var adjacent = height;
	var rads = (90 + myviewer.lat) * (Math.PI/180);
	var distance = Math.tan(rads)*adjacent;
	return Math.abs(distance);

}

function generatePaths(){
	var rmap = roomSceneMap();
	for(var key in rmap){
		var room = rmap[key];
		calculatePaths(room);
	}
	for(var i=0;i<tour_scenes.length;i++){
		var scene = tour_scenes[i];
		addDoorPaths(scene);
	}
}

function roomSceneMap(){
	return sceneUtil.roomMap(tour);
}

function calculatePaths(list){
	for(var i=0;i<list.length;i++){
		var scene = list[i];
		scene.paths = {};
		for(var j=0;j<list.length;j++){
			if(j==i){
				continue;
			}
			if(!scene.coords || !list[j].coords){
				continue;
			}
			var len = calculatePathLength(scene.coords,list[j].coords);
			var angle = calculateAngle(list[j].coords,scene.coords);
			scene.paths[list[j].sceneid] = {angle:angle,distance:len};
		}
		
		scene.paths = trimPaths(scene.paths);
	}
}

function trimPaths(paths){
	var keys = Object.keys(paths);
	var newPaths = {};
	for(var i=0;i<keys.length;i++){
		var key = keys[i];
		var path = paths[key];
		var use = true;
		for(var j=0;j<keys.length;j++){
			if(i==j){
				continue;
			}
			var key2 = keys[j];
			var path2 = paths[key2];
			if(Math.abs(sceneUtil.degreeDiff(path.angle,path2.angle)) < 20){
				if(path.distance > path2.distance * 1.2){
					use = false;
					break;
				}
			}
		}
		if(use){
			newPaths[key] = path;
		}
		
	}
	return newPaths;
}


function addDoorPaths(scene){
	if(!scene.doors){
		return;
	}
	for(var i=0;i<scene.doors.length;i++){
		var door = scene.doors[i];
		scene.paths[door.join] = {angle:door.lon,distance:0};
		var oscene = tour.scenes[door.join];
		if(!oscene.paths){
			oscene.paths = {};
		}
		oscene.paths[scene.sceneid] = {angle:(door.lon + 180) % 360,distance:0};
	}
}

function debugNav(){
	var scene = tour_scenes[pathi];
	console.debug(myviewer.lon+" "+JSON.stringify(scene.paths));
}


