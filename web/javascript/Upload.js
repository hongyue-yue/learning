var lastDoor = -1;
var pathi = 0;
var path2i = 1;
var tour;
var tour_scenes = [];
var editor = {};
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

function populateRooms(){
	var rooms = sceneUtil.roomMap(tour);
	$("#rooms").empty();
	$.each(Object.keys(rooms), function() {
		$("#rooms").append($("<option />").val(this).text(this));
	});
}
function onTourLoad(data){
	tour = data;
	tour_scenes = createScenesList(tour);
	var canvas = $('#sphere_canvas');
	var sphere_size = parseInt((window.innerHeight-40)/3.0);
	editor.sphere_middle = sphere_size;
	
	console.debug(sphere_size);
	canvas.attr('width', sphere_size * 2);
	canvas.attr('height', window.innerHeight);
	canvas.css('left',220);
	//$('#action_chooser').css({width:220});
	var tsleft = 220+(sphere_size*2)+20;
	var tswidth = window.innerWidth - tsleft - 40;
	if(tswidth < 200){
		tswidth = 200;
	}
	$('#tour_settings').css({position:'absolute','padding':'5px',left: tsleft,top:10,'border':'1px solid white',width:tswidth,height:window.innerHeight-40});
	
	canvas.draggable({
	      cursor: "e-resize",
	      cursorAt: { top: +15, left: +15 },
	      helper: function( event ) {
	        return $( "<div></div>" );
	      },
	      start: reorientStart,
	      drag: reorientDrag,
	      stop: reorientStop
	    });
	    
	editor.spheres = [];
	editor.spheres[0] = new ERViewer('sphere_canvas',0,10,sphere_size*2,sphere_size);
	editor.spheres[1] = new ERViewer('sphere_canvas',0,10+sphere_size+10,sphere_size*2,sphere_size);
	editor.spheres[2] = new ERViewer('sphere_canvas',0,10+sphere_size+10+sphere_size+10,sphere_size*2,sphere_size);
	editor.actionButtons = {};
	editor.actionButtons['floor'] = $('#floor_ref_button');
	editor.actionButtons['object'] = $('#object_ref_button');
	editor.actionButtons['selected'] = $('#selected_ref_button');

	
	
	$('#rooms').on('change', function() {
		editor.spheres[0].scene.room = $(this).val();
	});
	populateRooms();
	updateScenes();
}


function reorientDrag( e, ui){
	if(!editor.drag.sphere){
		return false;
	}
	var xy = editor.relXY(e);
	var diff = xy.x - editor.drag.x;
	editor.drag.x = xy.x;
	console.debug(diff);
	editor.drag.sphere.shiftHeadingByPixels(diff);
	editor.drag.sphere.scene.north = editor.drag.sphere.orientation;
	updateScenes();
	
}
function reorientStop( e, ui){
	
}

function reorientStart( e, ui){
	var xy = editor.relXY(e);
	editor.drag = {x:xy.x};
	for(var i=0;i<editor.spheres.length;i++){
		if(editor.spheres[i].inBoundingBox(xy.x, xy.y)){
			editor.drag.sphere = editor.spheres[i];
			break;
		}
	}	
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
	sphere.orientation = tour_scenes[index].north ? tour_scenes[index].north : 0;
	sphere.render();
}

function addNewRoom(){
	var roomName = prompt("Name of new room");
	if(roomName){
		editor.spheres[0].scene.room = roomName;
		populateRooms();
		updateScenes();
	}
}
function drawOverhead(){
	
}

function updateScenes(fast){
	drawOverhead();
	updateScene(editor.spheres[0],pathi);
	updateScene(editor.spheres[1],pathi+1);
	updateScene(editor.spheres[2],pathi+2);
	
	var ctx=document.getElementById('sphere_canvas').getContext("2d");
	ctx.beginPath();
	ctx.moveTo(editor.sphere_middle,0);
	ctx.lineTo(editor.sphere_middle, editor.sphere_middle*3+40);
	ctx.stroke();

	ctx.beginPath();
	ctx.moveTo(editor.sphere_middle/2,0);
	ctx.lineTo(editor.sphere_middle/2, editor.sphere_middle*3+40);
	ctx.stroke();

	ctx.beginPath();
	ctx.moveTo(editor.sphere_middle*1.5,0);
	ctx.lineTo(editor.sphere_middle*1.5, editor.sphere_middle*3+40);
	ctx.stroke();
	
	if(!fast){
		var main = editor.spheres[0];
		if(main.scene.room){
			$('#rooms').val(main.scene.room);
		}
		else {
			var val = $('#rooms').val();
			if(val){
				main.scene.room = val;
			}
		}
	}

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

