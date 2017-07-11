/*
 * Copyright Walkabout Worlds, LLC 2015-2016
 */

var tourManager = {};
function getUrlParameters()
{
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    var paramMap = {};
    for (var i = 0; i < sURLVariables.length; i++) 
    {
        var keyValue = sURLVariables[i].split('=');
        paramMap[keyValue[0]] = decodeURIComponent(keyValue[1]);
    }
    //if(!isMobile()){
    //	paramMap.cardboard = false;
    //}
    if(paramMap.nostereo || paramMap.nostereodesktop || paramMap.desktop){
    	paramMap.cardboard = false;
    }
    if(!(paramMap.cardboard || paramMap.compass)){
    	paramMap.desktop = true;
    }
    return paramMap;
}

tourManager.toCardboard = function(){
    window.location = window.location+"&cardboard=true";	
};
tourManager.toCompass = function(){
    window.location = window.location+"&compass=true";	
};
tourManager.toDesktop = function(){
    window.location = window.location+"&desktop=true";	
};

tourManager.get_url = function(path){
	return this.base_url+path;
};

tourManager.get_tiny_planet = function(scene){
	return this.get_url(scene.panorama.replace('Photospheres/','tinyplanets/'));
};

tourManager.get_tiny_planet = function(scene){
	return this.get_url(scene.panorama.replace('Photospheres/','tinyplanets/'));
};

tourManager.get_tile = function(scene){
	return this.get_url(scene.panorama.replace('Photospheres/','tiles/'));
};

tourManager.get_small = function(scene){
	return this.get_url(scene.panorama.replace('Photospheres/','Photospheres/IOS/'));
};
tourManager.get_panorama = function(scene){
	if(this.preloaded[scene.sceneid]){
		//console.debug("Preloaded");
		var tmp = this.preloaded[scene.sceneid];
		if(this.dosmartload){
			this.smartLoad(tmp,1);
		}
		return tmp;
	}
	else {
		return this.get_url(scene.panorama);
	}
};



tourManager.getTourFromParams = function(callback,load_tiles){
	var params = getUrlParameters();
	
	var tourpath = params.tour;
	var faketour = null;
	if(!tourpath){
		if(!params.panorama){
			alert("You must specify a tour!");
				return;
		}
		var pano = params.panorama;
		this.base_url = "";
		this.file_name = tourpath;
		faketour = {scenes:{"pano":{sceneid:"pano",panorama:pano}}};
	}
	else {
		this.setPaths(tourpath);
	}
	var tinyplanet = false;
	var autorotate = false;
	this.params = params;
	if(params.tinyplanet){
		tinyplanet = true;
	}
	if(params.autorotate){
		autorotate = true;
	}
	var preloadimages = true;
	if(faketour){
		faketour.tinyplanet = tinyplanet;
		faketour.autorotate = autorotate;
		faketour.single = true;
		if(!this.params.hd){
			fixIOS(faketour);
		}
		tourManager.preloadImages(faketour,callback);
	}
	else {
		$.ajax({url:tourpath,
			success: function(data){
				if(tinyplanet){
					data.tinyplanet=true;
				} 
				if(autorotate){
					data.autorotate=true;
				}
				if(load_tiles){
					alert("Loading tiles");
					for(var key in data.scenes){
						var scene = data.scenes[key];
						scene.panorama = scene.panorama.replace("Photospheres/","tiles/");
					}
				}
				else {
					if(!tourManager.params.hd){
						fixIOS(data);
					}
				}
				if(data.video){
					params.video = true;
				}
				if(preloadimages && !data.video){
					tourManager.preloadImages(data,callback);
				}
				else{
					tourManager.preloaded = {};
					$('#loading').css('visibility','hidden');

					callback(data);
				}
			},
			dataType:"json",
			error: function(status,xhr){
				alert("Failed to load tour "+JSON.stringify(status));
			}
		});
	}

};

tourManager.setPaths = function(tourpath){
	var slash = tourpath.lastIndexOf("/");
	if(slash==-1){
		this.base_url = "";
		this.file_name = tourpath;
	}
	else {
		this.base_url = tourpath.substring(0,slash+1);
		this.file_name = tourpath.substring(slash+1);
		this.tour_name = this.base_url.match(/tours\/([^\/]+)\//)[1];
	}
}

tourManager.preloadImages = function(data,callback,params){
	if(params && params.video){
		return;
	}
	this.preloaded = {};
	var keys = Object.keys(data.scenes);
	this.totalImages = keys.length;
	this.loadedImages = 0;
	this.imageLoadCallback = callback;
	for(var key in data.scenes){
		var scene = data.scenes[key];
		var url = null;
		if(this.use_tiles){
			url = this.get_tile(scene);	
			data.smartLoad = false;
		}
		else {
			url = this.get_panorama(scene);
		}
		var tmp = new Image();
		if(data.smartLoad){
			tmp.tmp_src = url;
			this.preloaded[key]=tmp;			
		}
		else {
			tmp.onload = this.createOnLoadFunction(key,data);
			tmp.src = url;
			this.preloaded[key]=tmp;
		}
	}
	if(data.smartLoad){
		this.dosmartload = true;
		console.debug("Setting up smart loading");
		for(var key in data.scenes){
			var tmp = this.preloaded[key];
			var friends = [];
			var scene = data.scenes[key];
			for(var sid in scene.paths){
				friends.push(this.preloaded[sid]);
			}
			tmp.friends = friends;
		}
		var first = null;
		if (data.startScene) {
			first = data.startScene;
		} else {
			for ( var key in data.scenes) {
				first = key;
				break;
			}
		}
		var seen = {};
		this.initSmartLoad(this.preloaded[first],1,seen);
		this.totalImages = Object.keys(seen).length;
		for(var key in seen){
			var tmp = seen[key];
			tmp.onload = this.createOnLoadFunction(key,data);
			tmp.src = tmp.tmp_src;
		}
	}
};

tourManager.checkSmartLoad = function(){
	var total = 0;
	var loaded = 0;
	for(var key in this.preloaded){
		var tmp = this.preloaded[key];
		total++;
		if(tmp.src){
			loaded++;
		}
	}
	console.debug(loaded+"/"+total);
};

tourManager.smartLoad = function(tmp,rpt){
	if(!tmp.src){
		tmp.src = tmp.tmp_src;
	}
	//console.debug(tmp.friends)
	for(var i=0;i<tmp.friends.length;i++){
		var f = tmp.friends[i];
		if(!f.src){
			f.src = f.tmp_src;
		}
	}
	if(rpt > 0){
		for(var i=0;i<tmp.friends.length;i++){
			var f = tmp.friends[i];
			this.smartLoad(f,rpt-1);
		}		
	}
};

tourManager.initSmartLoad = function(tmp,rpt,seen){
	seen[tmp.tmp_src]=tmp;
	//console.debug(tmp.friends);
	for(var i=0;i<tmp.friends.length;i++){
		var f = tmp.friends[i];
		seen[f.tmp_src]=f;
	}
	if(rpt > 0){
		for(var i=0;i<tmp.friends.length;i++){
			var f = tmp.friends[i];
			this.initSmartLoad(f,rpt-1,seen);
		}		
	}
};

tourManager.createOnLoadFunction = function(key,data){
	return function(){
		//console.debug(this);
		tourManager.loadedImages++;
		var percent = parseInt((tourManager.loadedImages/tourManager.totalImages) * 100);
		$('#percent_loaded').text(percent+"%");
		if(tourManager.loadedImages==tourManager.totalImages){
			var cb = tourManager.imageLoadCallback;
			$('#loading').css('visibility','hidden');
			cb(data);
		}
	};
};

function isMobile(){
	return (typeof window.orientation !== 'undefined');
}
function fixIOS(data){
	var iOS = isMobile();
	if(!iOS){
		iOS = ( navigator.userAgent.match(/iPad|iPhone|iPod/g) ? true : false );
	}
	if(!iOS){
		return;
	}
	for(var key in data.scenes){
		var scene = data.scenes[key];
		scene.panorama = scene.panorama.replace("Photospheres/","Photospheres/IOS/");
	}
}

var sceneUtil = {};

sceneUtil.createList = function(tour){
	var scene_list = [];
	for(var key in tour.scenes){
		scene_list.push(tour.scenes[key]);
	}
	return scene_list;
};

sceneUtil.processGrid = function(scenes,width,height){
	function setPaths(index,col,row,angle){
		if(col < 0 || row < 0){
			return;
		}
		if(col >=width || row >=height){
			return;
		}
		var index2 = row * width + col;
		console.debug("  "+col+" "+row+" "+angle+" ("+index2+")");
		scenes[index].paths[scenes[index2].sceneid] = {angle:angle,distance:0};
	}
	console.debug("Starting "+width+" "+height+" "+scenes.length);
	for(var col = 0; col < width; col++){
		for(var row=0;row < height;row++){
			var i = row * width + col;
			scenes[i].north = 180;
			console.debug(col+" "+row+" "+i);
			scenes[i].paths = {}; 
			setPaths(i,col,row-1,0);
			setPaths(i,col+1,row-1,45);
			setPaths(i,col+1,row,90);
			setPaths(i,col+1,row+1,135);
			setPaths(i,col,row+1,180);
			setPaths(i,col-1,row+1,225);
			setPaths(i,col-1,row,270);
			setPaths(i,col-1,row-1,315);
		}
	}
	
};

sceneUtil.findClosestPath = function(scene,lon){
	var paths = scene.paths;
	if(paths==null){
		return null;
	}
	var minDiff = 360;
	var bestScene = null;
	var pathAngle = null;
	var distance = null;
	for(var key in paths){
		var path = paths[key];
		var diff = this.degreeDiff(path.angle,lon);
		if(Math.abs(diff) < Math.abs(minDiff)){
			minDiff = diff;
			bestScene = key;
			pathAngle = path.angle;
			distance = path.distance;
		}
	}
	return {sceneid: bestScene, diff: minDiff, angle:pathAngle, distance: distance};
};

sceneUtil.roomMap = function(tour){
	var map = {};
	var keys = Object.keys(tour.scenes);
	for(var i=0;i<keys.length;i++){
		var scene = tour.scenes[keys[i]];
		if(!scene.room){
			continue;
		}
		var r = map[scene.room];
		if(!r){
			r = [];
			map[scene.room] = r;
		}
		r.push(scene);
	}
	return map;
};

sceneUtil.degreeDiff = function(a,b){	
	var diff = b - a;
	if(diff >= 0){
		if(diff > 180){
			return diff - 360;
		}
		else {
			return diff;
		}
	}
	else {
		if(diff <= -180){
			return diff + 360;
		}
		else {
			return diff;
		}
	}
};

sceneUtil.trimPaths = function(paths){
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
};

sceneUtil.calculatePaths= function(list,key,adjust){
	if(adjust==null){
		adjust = 90;
	}
	if(!key){
		key = "room_coords";
	}
	for(var i=0;i<list.length;i++){
		var scene = list[i];
		scene.paths = {};
		for(var j=0;j<list.length;j++){
			if(j==i){
				continue;
			}
			if(!scene[key] || !list[j][key]){
				continue;
			}
			var sc = {x:scene[key].x,y:-scene[key].y};
			var lc = {x:list[j][key].x,y:-list[j][key].y};
			var len = calculatePathLength(scene[key],list[j][key]);
			var angle = calculateAngle(list[j][key],scene[key]);
			angle = (angle+adjust) % 360;
			scene.paths[list[j].sceneid] = {angle:angle,distance:len};
		}
		scene.paths = sceneUtil.trimPaths(scene.paths);
	}
};



/*
function saveTour(){
	downloadFile(tourManager.file_name, JSON.stringify(tour,null,2));
}
*/
function saveTour(showAlert,callback){
	//downloadFile(tourManager.file_name, JSON.stringify(tour,null,2));
	tour.title = tourManager.tour_name;
	var tourpath = tourManager.params.tour;
	var data = new FormData();
	data.append("path",tourpath);
	data.append("json",JSON.stringify(tour,null,2));
	$.ajax({url:"save_scenes",
		type: "POST",
		success: function(data){
			if(showAlert){
				alert("Data has been saved");
			}
			if(callback){
				callback();
			}
		},
		error: function(status,xhr){
			alert("Failed to save tour "+JSON.stringify(status));
		},
	    processData: false,
	    contentType: false,
		data: data
	});

}


function downloadFile(filename, text) {
	  var pom = document.createElement('a');
	  pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
	  pom.setAttribute('download', filename);
	  pom.click();
};



function calculatePathLength(p1,p2){
	var xDiff = p2.x - p1.x; 
	var yDiff = p2.y - p1.y;
	return Math.sqrt(xDiff*xDiff + yDiff*yDiff);
}

function calculateAngle(p1,p2){
	var xDiff = p2.x - p1.x; 
	var yDiff = p2.y - p1.y; 
	var angle = Math.atan2(yDiff, xDiff) * (180 / Math.PI);
	if(angle < 0){
		angle = 360 + angle;
	}
	return angle;
}

function rotateAxis(x0,y0,degrees){
	var theta = THREE.Math.degToRad(-degrees);
	var x1 = Math.cos(theta) * x0 + Math.sin(theta) * y0;
	var y1 = -Math.sin(theta) * x0 + Math.cos(theta) * y0;
	return [x1,y1];
}

function rotate3D(xyz0,yr,xr){
	var xyz = [xyz0[0],xyz0[1],xyz0[2]];
	var xz = rotateAxis(xyz[0],xyz[2],yr);
	console.debug(xz[0]+" "+xz[1]);
	xyz[0] = xz[0];
	xyz[2] = xz[1];
	console.debug(xyz[0]+" "+xyz[1]+" "+xyz[2]);
	var zy = rotateAxis(xyz[2],xyz[1],xr);
	console.debug(zy[0]+" "+zy[1]);
	xyz[2] = zy[0];
	xyz[1] = zy[1];
	console.debug(xyz[0]+" "+xyz[1]+" "+xyz[2]);
	return xyz;
}
function calculate3DAngle(xyz1,xyz2){
	var p1 = {x:xyz1[0],y:xyz1[2]};
	var p2 = {x:xyz2[0],y:xyz2[2]};
	var lon = calculateAngle(p1, p2);
	p1 = {x:xyz1[2],y:xyz1[1]};
	p2 = {x:xyz2[2],y:xyz2[1]};
	var lat = calculateAngle(p1, p2);
	var xdiff = xyz2[0] - xyz1[0];
	var ydiff = xyz2[1] - xyz1[1];
	var zdiff = xyz2[2] - xyz1[2];
	var distance = Math.sqrt((xdiff*xdiff) + (ydiff*ydiff) + (zdiff*zdiff) );
	return {lon:lon,lat:lat,distance:distance};
}

function calculateXYZ(lld){
	var theta = THREE.Math.degToRad(lld.lon);
	var tilt = THREE.Math.degToRad(lld.lat);
	var y = lld.distance * Math.sin(tilt) * Math.cos( theta );
	var z = lld.distance * Math.cos( tilt );
	var x = lld.distance * Math.sin( tilt ) * Math.sin( theta );
	return [x,y,z];
}

function savePaths(coord_key,adjust){
	if(adjust==null){
		adjust = 90;
	}
	var rmap = sceneUtil.roomMap(tour);
	for(var key in rmap){
		var room = rmap[key];
		sceneUtil.calculatePaths(room,coord_key,adjust);
	}
	for(var key in tour.scenes){
		var scene = tour.scenes[key];
		if(!scene.connections){
			continue;
		}
		for(var cid in scene.connections){
			var coords = scene.connections[cid];
			var len = calculatePathLength({x:0,y:0},coords);
			var angle = calculateAngle(coords,{x:0,y:0});
			angle = (angle+adjust) % 360;
			scene.paths[cid] = {angle:angle,distance:len};
		}
	}
}



function tassert(label,a,b){
	console.debug(label+" "+a+" "+b);
}

function geoTest(){
	var lld = calculate3DAngle([0,0,0], [0,0,1]);
	tassert("lon1",0,lld.lon);
	tassert("lat1",0,lld.lat);
	tassert("distance",1,lld.distance);
}