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
	var top = 0;
	for(var key in tour.scenes){
		pid++;
		var scene = tour.scenes[key];
		var tpv = new TinyPlanet('s'+pid, scene);
		con.append(tpv.html());
		if(!scene.north){
			scene.north = 0;
		}
		allViewers[scene.sceneid] = tpv;
		
		tpv.heading = 360 - scene.north;
		tpv.update();
		$('#'+tpv.img_id).attr("sceneid",scene.sceneid);
		//$('#'+tpv.eid).css("top",top+"px");
		if(scene.pos){
			tpv.setPosition(scene.pos.x, scene.pos.y);
		}
		
		$('#'+tpv.eid).click(function(e){
			if($(this).hasClass('myselected')){
				$(this).removeClass('myselected');
			} else {
				$('.top_select').removeClass("top_select");
				$(this).addClass('myselected');
				$(this).addClass('top_select');
			}
			if(e.altKey){
				var myimg = $('#'+($(this).attr('id'))+"_img");
				clickSetNorth(e, myimg);
			}
		});
	}
	var controls = 
		"<button onclick='saveAll()'>Save</button>";
	con.append(controls);

	$(".tinyplanet").draggable();

}

function moveScreen(x,y){
	 //index, el
	$('.tinyplanet').each(
			function(index,el){
				var pos = $(el).position();
				if(pos.left==0 && pos.top==0){
					return;
				}
				$(el).css({left:pos.left+x,top:pos.top+y});
			}
	);
}
function moveSelected(x,y){
	 //index, el
	$('.myselected').each(
			function(index,el){
				var pos = $(el).position();
				$(el).css({left:pos.left-x,top:pos.top-y});
			}
	);
}

function handleKeys(e){
	console.debug(e.keyCode);
	var kc = e.keyCode;
	if(kc=='112'){
		var img = $('#'+($(".top_select").attr('id'))+"_img");
		var sceneid = img.attr('sceneid');
		var previd = findPrevScene(sceneid);
		var prev = allViewers[previd];
		var cur = allViewers[sceneid];
		var pos = cur.getPosition();
		prev.setPosition(pos.left+20,pos.top+20);
		var mydiv = prev.getDiv();
		$('.top_select').removeClass("top_select");
		$('.myselected').removeClass("myselected");
		mydiv.addClass('myselected');
		mydiv.addClass('top_select');

		
	}
}

function findPrevScene(find){
	var prev = null;
	for(var key in tour.scenes){
		if(key==find){
			return prev;
		}
		prev = key;
	}
	return null;
}
function clickSetNorth(e,img){
	//console.debug(img+" "+sceneid);
	var sceneid = img.attr('sceneid');
	var mos = img.parent().offset();
    var x = (e.pageX - mos.left); //offset -> method allows you to retrieve the current position of an element 'relative' to the document
    var y = (e.pageY - mos.top);
    var midx = img.width()/2;
    var midy = img.height()/2;
    //console.debug(x+","+y+" "+midx+","+midy);
    var degrees = (360 + Math.atan2(y - midy, x - midx) * (180 / Math.PI)) % 360;
    console.debug(degrees);
    rotateNorth(sceneid,-((degrees+90)%360));
}

function updatePoses(){
	for(var key in allViewers){
		var tpv = allViewers[key];
		var pos = tpv.getPosition();
		tour.scenes[key].pos = {x:pos.left, y: pos.top};
	}
}

function findPaths(){
	updatePoses();
	for(var key in tour.scenes){
		var scene1 = tour.scenes[key];
		if(scene1.pos.x==0 && scene1.pos.y==0){
			continue;
		}
		for(var key2 in tour.scenes){
			if(key2==key){
				continue;
			}
			var scene2 = tour.scenes[key2];
			var len = calculatePathLength(scene1.pos, scene2.pos);
			if(len > 300){
				continue;
			}
			console.debug(key+" "+key2+" "+len);
			calculateAngle(scene1.pos, scene2.pos);
		}
	}
	
}

function saveAll(){
	updatePoses();
	saveTour();
}

function rotateNorth(sceneid,amount){
	console.debug("Rotating "+sceneid+" "+amount);
	var tpv = allViewers[sceneid];
	var scene = tpv.scene;
	scene.north = (scene.north + amount + 720) % 360;
	tpv.update();
}

function alignSpheres(sideLength,points1,points2){
	var centerX = sideLength/2;
	var centerY = sideLength/2;
	points1.atocenter = calculateAngleAndDistance(points1.a,{x:centerX,y:centerY});
	points1.atob = calculateAngleAndDistance(points1.a,points1.b);
	
	points2.atocenter = calculateAngleAndDistance(points2.a,{x:centerX,y:centerY});
	points2.atob = calculateAngleAndDistance(points2.a,points2.b);
	
	var diff = degreeDiff(points2.atob,points1.atob);
	
}
