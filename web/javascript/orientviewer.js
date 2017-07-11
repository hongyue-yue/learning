var currentScene;
var myviewer;
var tour;
var roomMap;
var allViewers = {};
$(document).ready(
	function(){
		tourManager.getTourFromParams(onTourLoad);
	}	
);

function onTourLoad(data){
	tour = data;
	var con = $('#container');
	console.debug("Printing out scenes!");
	var pid = 0;
	for(var key in tour.scenes){
		pid++;
		var scene = tour.scenes[key];
		var tpv = new TinyPlanet('s'+pid, scene);
		var controls = 
			/*"<button onclick='rotateNorth(\""+scene.sceneid+"\",-90)'>&lt;&lt;&lt;</button>"+
			"<button onclick='rotateNorth(\""+scene.sceneid+"\",-10)'>&lt;&lt;</button>"+
			"<button onclick='rotateNorth(\""+scene.sceneid+"\",-1)'>&lt;</button>"+
			"<button onclick='rotateNorth(\""+scene.sceneid+"\",1)'>&gt;</button>"+
			"<button onclick='rotateNorth(\""+scene.sceneid+"\",10)'>&gt;&gt;</button>"+
			"<button onclick='rotateNorth(\""+scene.sceneid+"\",90)'>&gt;&gt;&gt;</button>"+*/
			" "+scene.sceneid+" "+
			"<button onclick='saveTrail()'>Save</button>";
		con.append(controls);
		con.append(tpv.html());
		if(!scene.north){
			scene.north = 0;
		}
		allViewers[scene.sceneid] = tpv;
		tpv.update();
		$('#'+tpv.img_id).attr("sceneid",scene.sceneid);
		$('#'+tpv.img_id).click(function(e){clickSetNorth(e,this,$(this).attr('sceneid'));});
	}
}

function saveTrail(){
	var i =0;
	var prev = null;
	for(var key in tour.scenes){
		var scene = tour.scenes[key];
		if(i==0){
			scene.doors = [];
			scene.paths = {};
		}
		else {
			scene.doors = [{
				            "lat": -45,
				            "lon": 360 - scene.north,
				            "join": prev 
			}];
			scene.paths = {};
			var door = scene.doors[0];
			scene.paths[prev] = {angle:door.lon,distance:0};
			var oscene = tour.scenes[prev];
			if(!oscene.paths){
				oscene.paths = {};
			}
			oscene.paths[scene.sceneid] = {angle:(door.lon + 180) % 360,distance:0};
		}
		prev = scene.sceneid;
		i++;
	}
	saveTour();
}

function clickSetNorth(e,img,sceneid){
	//console.debug(img+" "+sceneid);
	var mos = $(img).parent().offset();
    var x = (e.pageX - mos.left); //offset -> method allows you to retrieve the current position of an element 'relative' to the document
    var y = (e.pageY - mos.top);
    var midx = $(img).width()/2;
    var midy = $(img).height()/2;
    //console.debug(x+","+y+" "+midx+","+midy);
    var degrees = (360 + Math.atan2(y - midy, x - midx) * (180 / Math.PI)) % 360;
    console.debug(degrees);
    rotateNorth(sceneid,-((degrees+90)%360));
}

function rotateNorth(sceneid,amount){
	console.debug("Rotating "+sceneid+" "+amount);
	var tpv = allViewers[sceneid];
	var scene = tpv.scene;
	scene.north = (scene.north + amount + 720) % 360;
	tpv.update();
}
