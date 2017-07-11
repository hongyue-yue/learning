var lastDoor = -1;
var pathi = 0;
var path2i = 1;
var tour;
var tour_scenes = [];
var editor = {};
var door_editor = {};
$(document).ready(
		function(){
			tourManager.use_tiles = true;
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

function populateRooms(){
	var rooms = sceneUtil.roomMap(tour);
	editor.rooms = rooms;
	$("#rooms").empty();
	$("#join_rooms").empty();
	$.each(Object.keys(rooms), function() {
		$("#rooms").append($("<option />").val(this).text(this));
		$("#join_rooms").append($("<option />").val(this).text(this));
	});
}

function saveMarkers(){
	generatePaths();
	generateJoinPaths();
	saveTour();
}
function onTourLoad(data){
	tour = data;
	if(!tour.room_markers){
		tour.room_markers = {};
	}
	for(var key in tour.scenes){
		var scene = tour.scenes[key];
		//delete scene.coords;
		delete scene.paths;
		delete scene.doors;
		delete scene.room_ref;
		delete scene.markers;
	}
	tour_scenes = [];

	var canvas = $('#sphere_canvas');
	var sphere_size = parseInt((window.innerHeight-30)/3.0);
	editor.sphere_middle = sphere_size+20;
	
	console.debug(sphere_size);
	canvas.attr('width', (sphere_size * 4)+20);
	canvas.attr('height', window.innerHeight);
	canvas.css('left',220);
	canvas.click(setMarker);
	//$('#action_chooser').css({width:220});
	var tsleft = 220+(sphere_size*4)+20;
	var tswidth = window.innerWidth - tsleft - 40;
	if(tswidth < 200){
		tswidth = 200;
	}
	$('#main_controls').css({'position':'absolute','left':tsleft,'top':10,'width':tswidth});
	$('#doors').css({'width':tswidth-10});
	
	editor.cur_sphere = new TileViewer('sphere_canvas',sphere_size+10,10,sphere_size*2,sphere_size*2);
	editor.prev_sphere = new TileViewer('sphere_canvas',0,10,sphere_size,sphere_size);
	editor.next_sphere = new TileViewer('sphere_canvas',10+sphere_size*3+10,10,sphere_size,sphere_size);
	
	$('#rooms').on('change', updateCurrentRoom);
	$('#marker_type').on('change',changeMarkerType);
	populateRooms();
	var room_names = Object.keys(editor.rooms);
	if(room_names.length==0){
		alert("There are no rooms specified");
		tour_scenes = [];
	}
	else {
		var startRoom = room_names[0];
		$('#rooms').val(startRoom);
		updateCurrentRoom();
	}
	
	
	var door_canvas = $('#door_canvas');
	var ds_width = (window.innerWidth - 60)/2;
	var ds_height = ds_width/2;
	door_canvas.attr('width', window.innerWidth);
	door_canvas.attr('height', ds_height);
	door_canvas.css({'left':0,'top':20});
	
	door_editor.main_sphere = new TileViewer('door_canvas',20,0,ds_width,ds_height);
	door_editor.join_sphere = new TileViewer('door_canvas',40+ds_width,0,ds_width,ds_height);
	$('#door_editor_controls').css({'position':'absolute','left':20,'top':40+ds_height});
	$('#join_controls').css({'position':'absolute','left':40+ds_width,'top':40+ds_height});
	$('#join_rooms').on('change', updateJoinRoom);
	updateScene(door_editor.main_sphere, 0);
	updateJoinRoom();

	$('#door_canvas').click(function(e){door_editor.setMarker(e)});
	
}

function showDoorEditor(){
	$('#door_editor').css('visibility','visible');
	door_editor.onShow();
}

function hideDoorEditor(){
	$('#door_editor').css('visibility','hidden');	
	updateScenes();
}

door_editor.clearMarkers = function(){
	var key1 = this.main_sphere.scene.sceneid;
	var key2 = this.join_sphere.scene.sceneid;
	
	if(!tour.joins){
		return null;
	}
	if(tour.joins[key1]){
		delete tour.joins[key1][key2];
	}
	if(tour.joins[key2]){
		delete tour.joins[key2][key1];		
	}
	this.update_scenes();
};
door_editor.next = function(){
	var len = this.scenes.length;
	this.pathi = (this.pathi+1) % len;
	this.update_scenes();	
};

door_editor.prev = function(){
	var len = this.scenes.length;
	this.pathi = len+(this.pathi-1) % len;
	this.update_scenes();	
};
door_editor.showJoin= function(sid){
	$('#door_editor').css('visibility','visible');
	console.debug(sid);
	var s = tour.scenes[sid];
	$('#join_rooms').val(s.room);
	updateJoinRoom();
	for(var i=0;i<this.scenes.length;i++){
		if(this.scenes[i].sceneid==sid){
			this.pathi = i;
			break;
		}
	}
	this.update_scenes();	
};

door_editor.onShow = function(){
	if(!door_editor.join_sphere.scene){
		updateJoinRoom();
	}
	this.update_scenes();
};

door_editor.relXY = function(e){
	var parentOffset = $('#door_canvas').offset(); 
	//or $(this).offset(); if you really just want the current element's offset
	var relX = e.pageX - parentOffset.left;
	var relY = e.pageY - parentOffset.top;
	return {x:relX,y:relY};
};
door_editor.createKey = function(sid1,sid2){
	if(sid1 > sid2){
		return sid2+"###"+sid1;
	}
	else {
		return sid1+"###"+sid2;
	}
};

function updateJoinRoom(){
	var room = $('#join_rooms').val();
	var temp = editor.rooms[room];
	if(!temp){
		return;
	}
	door_editor.scenes = temp;
	door_editor.current_room = room;
	door_editor.pathi = 0;
	door_editor.update_scenes();
}

door_editor.updateScene = function(sphere,key1,key2,scene){
	sphere.setScene(scene);
	sphere.orientation = scene.north ? scene.north : 0;
	var minfo = this.get_join(key1, key2);
	if(minfo){
		sphere.render(minfo, minfo.type);
		return minfo.type;
	}
	else {
		sphere.render(null, null);
	}
};


door_editor.update_scenes = function(){
	var s1 = tour_scenes[pathi];
	var s2 = this.scenes[this.pathi];
	var key1 = s1.sceneid;
	var key2 = s2.sceneid;
	var t = this.updateScene(this.main_sphere,key1, key2,s1);
	var t2 = this.updateScene(this.join_sphere,key2, key1,s2);
	var ctype = t ? t : t2;
	if(ctype){
		$('#door_marker_type').val(ctype);
	}
};

door_editor.get_join=function(key1,key2){
	if(!tour.joins){
		return null;
	}
	if(!tour.joins[key1]){
		return null;
	}
	return tour.joins[key1][key2];
};

door_editor.set_join=function(key1,key2,marker){
	if(!tour.joins){
		tour.joins = {};
	}
	if(!tour.joins[key1]){
		tour.joins[key1]={};
	}
	return tour.joins[key1][key2] = marker;	
};

door_editor.setMarker = function(e){
	var xy = door_editor.relXY(e);
	var sphere = null;
	var key1 = null;
	var key2 = null;
	var marker_type = $('#door_marker_type').val();
	if(door_editor.main_sphere.inBoundingBox(xy.x, xy.y)){
		sphere = door_editor.main_sphere;
		key1 = door_editor.main_sphere.scene.sceneid;
		key2 = door_editor.join_sphere.scene.sceneid;
	}
	else if(door_editor.join_sphere.inBoundingBox(xy.x, xy.y)){
		sphere = door_editor.join_sphere;
		key1 = door_editor.join_sphere.scene.sceneid;
		key2 = door_editor.main_sphere.scene.sceneid;
	}
	if(sphere==null){
		return;
	}
	var ll = sphere.toLatLon(xy.x, xy.y);
	var cur = this.get_join(key1, key2);
	if(e.ctrlKey){
		if(cur){
			cur.lat2 = ll.lat;
			if(cur.lat2 < cur.lat){
				var tmp = cur.lat2;
				cur.lat2 = cur.lat;
				cur.lat = tmp;
				cur.type = marker_type;
			}
		}
		else {
			ll.lat2 = ll.lat + 10;
			ll.type = marker_type;
			this.set_join(key1, key2, ll);
		}
	}
	else {
		if(cur){
			cur.lat = ll.lat;
			cur.lon = ll.lon;
			if(!cur.lat2){
				cur.lat2 = cur.lat + 10;
			}
			if(cur.lat2 < cur.lat){
				var tmp = cur.lat2;
				cur.lat2 = cur.lat;
				cur.lat = tmp;
			}
			cur.type = marker_type;
		}
		else {
			ll.type = marker_type;
			this.set_join(key1, key2, ll);
		}
	}
	this.update_scenes();
};

function setMarker(e){
	var xy = editor.relXY(e);
	if(editor.cur_sphere.inBoundingBox(xy.x, xy.y)){
		var ll = editor.cur_sphere.toLatLon(xy.x, xy.y);
		if(e.ctrlKey){
			var cur = tour.room_markers[editor.current_room].scenes[editor.cur_sphere.scene.sceneid];
			if(cur){
				cur.lat2 = ll.lat;
				if(cur.lat2 < cur.lat){
					var tmp = cur.lat2;
					cur.lat2 = cur.lat;
					cur.lat = tmp;
				}
			}
			else {
				ll.lat2 = ll.lat + 10;
				tour.room_markers[editor.current_room].scenes[editor.cur_sphere.scene.sceneid] = ll;
			}
		}
		else {
			var cur = tour.room_markers[editor.current_room].scenes[editor.cur_sphere.scene.sceneid];
			if(cur){
				cur.lat = ll.lat;
				cur.lon = ll.lon;
				if(!cur.lat2){
					cur.lat2 = cur.lat + 10;
				}
				if(cur.lat2 < cur.lat){
					var tmp = cur.lat2;
					cur.lat2 = cur.lat;
					cur.lat = tmp;
				}

			}
			else {
				tour.room_markers[editor.current_room].scenes[editor.cur_sphere.scene.sceneid] = ll;
			}
		}
		updateScenes();
	}
	else if(editor.next_sphere.inBoundingBox(xy.x, xy.y)){
		updatePathI(1);
	}
	else if(editor.prev_sphere.inBoundingBox(xy.x, xy.y)){
		updatePathI(-1);
	}

}

function changeMarkerType(){
	var mt = $('#marker_type').val();
	tour.room_markers[editor.current_room].type = mt;
	updateScenes();
}

function updateCurrentRoom(){
	var room = $('#rooms').val();
	var temp = editor.rooms[room];
	if(!temp){
		return;
	}
	if(!tour.room_markers[room]){
		var mt = $('#marker_type').val();
		tour.room_markers[room] = {type:mt,scenes:{}};		
	}
	else {
		var mt = tour.room_markers[room].type;
		$('#marker_type').val(mt);
	}
	tour_scenes = temp;
	editor.current_room = room;
	pathi = 0;
	updateScenes();
}



editor.relXY = function(e){
	var parentOffset = $('#sphere_canvas').offset(); 
	//or $(this).offset(); if you really just want the current element's offset
	var relX = e.pageX - parentOffset.left;
	var relY = e.pageY - parentOffset.top;
	return {x:relX,y:relY};
};


function updateScene(sphere,index){
	if(index < 0 || index >= tour_scenes.length){
		sphere.setScene(null);
		sphere.render();
		return;
	}
	sphere.setScene(tour_scenes[index]);
	var minfo = tour.room_markers[editor.current_room];
	var marker = minfo.scenes[sphere.scene.sceneid];

	sphere.orientation = tour_scenes[index].north ? tour_scenes[index].north : 0;
	sphere.render(marker,minfo.type);
	
}

function addNewRoom(){
	var roomName = prompt("Name of new room");
	if(roomName){
		editor.cur_sphere.scene.room = roomName;
		populateRooms();
		updateScenes();
	}
}

function updateScenes(fast){
	updateScene(editor.cur_sphere,pathi);
	updateScene(editor.prev_sphere,pathi-1);
	updateScene(editor.next_sphere,pathi+1);
	
	var c=document.getElementById("sphere_canvas");
	/*
	var ctx=c.getContext("2d");
	ctx.strokeStyle = '#0000ff';
	ctx.lineWidth = 2;
	ctx.rect(8,8,editor.cur_sphere.oswidth+4,editor.cur_sphere.osheight+4);
	ctx.stroke();

	ctx.beginPath();
	ctx.moveTo(editor.cur_sphere.oswidth/2+10,10+editor.cur_sphere.osheight);
	ctx.lineTo(editor.cur_sphere.oswidth/2+10,10+editor.cur_sphere.osheight*1.5);
	ctx.stroke();
	*/
	var scene = tour_scenes[pathi];
	var doors = $('#doors');
	var html = "";
	if(tour.joins && tour.joins[scene.sceneid]){
		var js = tour.joins[scene.sceneid];
		for(var key in js){
			var tmp = tour.scenes[key];
			html+="<div class='join_link' data='"+key+"' onclick='door_editor.showJoin($(this).attr(\"data\"))'>"+tmp.room+": "+key+"</div>";
		}
	}
	doors.html(html);
}


function updatePathI(delta){
	pathi+=delta;
	if(pathi < 0){
		pathi=0;
	}
	else if(pathi>=tour_scenes.length){
		pathi = tour_scenes.length-1;
	}
	updateScenes();
}

function calcSection(heading,width){
	var ppd = width/360.0;
	var offset = heading * ppd;
	var subwidth = width-offset;

	return {offset:offset,subwidth:subwidth};
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

function coordsFromFloorMarker(ll){
	var adjacent = 6;// ~tripod 6 feet
	
	var rads = (180 - ll.lat) * (Math.PI/180);
	if(ll.lat < 180){
		rads = ll.lat * (Math.PI/180);
	}
	console.debug("ll.lat "+ll.lat);
	var distance = Math.abs(Math.tan(rads)*adjacent);

	// x=5cos,and y=5sin
	var x = distance * Math.cos(ll.lon * (Math.PI/180));
	var y = distance * Math.sin(ll.lon * (Math.PI/180));
	console.debug("offset "+x+" "+y);

	return {x:-x,y:-y};
}

function coordsFromObjectMarker(ll){
	var adjacent = 3;
	var degrees = 90-(Math.abs(ll.lat - ll.lat2)/2);
	var rads = degrees * (Math.PI/180);
	var distance = Math.abs(Math.tan(rads)*adjacent);

	var x = distance * Math.cos(ll.lon * (Math.PI/180));
	var y = distance * Math.sin(ll.lon * (Math.PI/180));
	console.debug("degrees: "+degrees+" distance: "+distance);
	console.debug("offset "+x+" "+y);
	return {x:-x,y:-y};
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
				if(path.distance > path2.distance * 1.1){
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

function generatePaths(){
	var rms = tour.room_markers;
	for(var room in rms){
		var markers = rms[room];
		var type = markers.type;
		for(var sceneid in markers.scenes){
			var scene = tour.scenes[sceneid];
			if(!scene){
				continue;
			}
			if(scene.room!=room){
				continue; // stale marker
			}
			var marker = markers.scenes[sceneid];
			if(type=='floor'){
				scene.coords = coordsFromFloorMarker(marker);
			}
			else if(type=='object'){
				scene.coords = coordsFromObjectMarker(marker);
			}
			else if(type=='door'){
				scene.coords = coordsFromObjectMarker(marker);
			}
			else {
				console.debug("Unknown marker type "+type);
			}
		}
	}
	
	for(var sid in tour.scenes){
		var scene = tour.scenes[sid];
		if(scene.mapxy){
			scene.coords = {x:-scene.mapxy.x,y:scene.mapxy.y};
		}
	}
	
	var rmap = sceneUtil.roomMap(tour);
	for(var key in rmap){
		var room = rmap[key];
		calculatePaths(room);
	}

}

function generateJoinPaths(){
	var all_joins = tour.joins;
	if(!all_joins){
		return;
	}
	for(var sid in all_joins){
		var jt = all_joins[sid];
		var scene1 = tour.scenes[sid];
		for(var sid2 in jt){
			console.debug("Joining "+sid+" "+sid2);
			var scene2 = tour.scenes[sid2];
			var m1 = jt[sid2];
			var tmpjt = all_joins[sid2];
			if(!tmpjt){
				continue;
			}
			var m2 = tmpjt[sid];
			
			var type = m1.type;
			if(type=='door'){
				if(!scene1.paths){
					scene1.paths = {};
				}
				console.debug("Adding Door "+JSON.stringify({angle:m1.lon,distance:1}))
				scene1.paths[sid2] = {angle:( m1.lon + 180 ) % 360,distance:1};				
				continue;
			}
			var coords1 = null;
			var coords2 = null;
			if(type=='floor'){
				coords1 = coordsFromFloorMarker(m1);
				coords2 = coordsFromFloorMarker(m2);
			}
			else if(type=='object'){
				coords1 = coordsFromObjectMarker(m1);
				coords2 = coordsFromObjectMarker(m2);
			}
			else {
				console.debug("Unknown marker type "+type);
			}
			if(!scene1.paths){
				scene1.paths = {};
			}
			if(!scene2.paths){
				scene2.paths = {};
			}
			var len = calculatePathLength(coords2,coords1);
			var angle = calculateAngle(coords2,coords1);
			scene1.paths[sid2] = {angle:angle,distance:len};
			console.debug("Added "+JSON.stringify(scene1));
		}
	}
}


