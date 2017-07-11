var overheadImg = new Image();
overheadImg.src = "tours/ThatDemo/FloorPlan.JPG";
var currentTP = null;
function drawOverhead(){
	var canvas = document.getElementById('overhead');
	var ctx=canvas.getContext("2d");
	ctx.drawImage(overheadImg,0,0,canvas.width,canvas.height);
	for(var i=0;i<tour_scenes.length;i++){
		var scene = tour_scenes[i];
		if(scene.mapxy){
			var radius = i==pathi ? 10 : 4; 
			ctx.beginPath();
			ctx.arc(scene.mapxy.x,scene.mapxy.y,radius,0,2*Math.PI);
			ctx.stroke();
			if(scene.paths){
				for(var sid in scene.paths){
					var es = tour.scenes[sid];
					if(!es){
						delete scene.paths[sid];
						continue;
					}
					if(es.mapxy){
						ctx.beginPath();
						ctx.moveTo(scene.mapxy.x,scene.mapxy.y);
						ctx.lineTo(es.mapxy.x,es.mapxy.y);
						ctx.stroke();
						
					}
				}
			}
		}
	}
}
function updateScenes(fast){
	currentTP = tour_scenes[pathi];
	editor.spheres[0] = {scene:currentTP};
	drawOverhead();
	$('#tiny_planet').attr("src",tourManager.get_tiny_planet(currentTP));
	$("#tiny_planet")[0].style.transform = "rotate("+currentTP.north+"deg)";
	$('#tp_id').text(currentTP.sceneid);
	if(currentTP.room){
		$('#rooms').val(currentTP.room);
	}
	else {
		var val = $('#rooms').val();
		if(val){
			currentTP.room = val;
		}
	}

}

function generatePaths(){
	

	calculatePaths();
}

function toggleJoin(i1,i2){
	console.debug("Toggling join");

	var joins = tour.joins;
	if(!joins){
		joins = [];
		tour.joins = joins;
	}
	console.debug(joins);
	var id1 = tour_scenes[i1].sceneid;
	var id2 = tour_scenes[i2].sceneid;
	for(var i=0;i<joins.length;i++){
		console.debug(JSON.stringify(joins[i])+" "+id1+" "+id2);
		if(joins[i][0]==id1){
			if(joins[i][1]==id2){
				console.debug("Deleting join");
				joins.splice(i, 1);
				calculatePaths();
				return;
			}
		}
		else if(joins[i][0]==id2){
			if(joins[i][1]==id1){
				joins.splice(i, 1);
				calculatePaths();
				return;
			}			
		}
	}
	joins.push([id1,id2]);
	calculatePaths();
	
}

function calculatePaths(){
	for(var sid in tour.scenes){
		var scene = tour.scenes[sid];
		scene.paths = {};
	}

	var joins = tour.joins;
	if(!joins){
		return;
	}
	var new_joins = [];
	for(var i=0;i<joins.length;i++){
		var sceneA = tour.scenes[joins[i][0]];
		var sceneB = tour.scenes[joins[i][1]];
		if((!sceneA) || (!sceneB)){
			continue;
		}
		else {
			new_joins.push(joins[i]);
		}
		console.debug("Adding Paths!");
		console.debug(sceneA);
		console.debug(sceneB);
		var len = calculatePathLength(sceneA.mapxy,sceneB.mapxy);
		var angle = calculateAngle(sceneA.mapxy,sceneB.mapxy);
		angle = (270 + angle) % 360;
		sceneB.paths[sceneA.sceneid] = {angle:angle,distance:len};
		sceneA.paths[sceneB.sceneid] = {angle:(angle+180)%360.0,distance:len};
	}
	tour.joins = new_joins;
}

function trimExcludes(){
	for(var i=0;i<tour.excludes.length;i++){
		var ex = tour.excludes[i];
		
		var s1 = tour.scenes[ex];
		var s2 = tour.scenes[s2];
		if(s1.paths){
			delete s1.paths[s2];
		}
		if(s2.paths){
			delete s2.paths[s1];
		}		
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


function saveAll(){
	generatePaths();
	saveTour();
}

function clickOverhead(e){
	var parentOffset = $('#overhead').offset(); 
	//or $(this).offset(); if you really just want the current element's offset
	var relX = e.pageX - parentOffset.left;
	var relY = e.pageY - parentOffset.top;
	
	for(var i=0;i<tour_scenes.length;i++){
		var scene = tour_scenes[i];
		if(scene.mapxy){
			var dx = scene.mapxy.x - relX;
			var dy = scene.mapxy.y - relY;
			var distance = Math.sqrt(dx*dx + dy*dy);
			if(distance <=4){
				if(i==pathi){
					break;
				}
				if(e.ctrlKey){
					toggleJoin(pathi, i);
					pathi = i;
				}
				pathi = i;
				updateScenes();
				return;
			}
		}
	}
	if(e.ctrlKey){
		return;
	}

	var xy = {x:relX,y:relY};
	console.debug(xy);
	editor.spheres[0].scene.mapxy = xy; 
	drawOverhead();
	//updatePathI(1);
};