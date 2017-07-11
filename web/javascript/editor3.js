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
var sphere1;
var sphere2;

function onTourLoad(data){
	tour = data;
	tour_scenes = createScenesList(tour);
	var canvas = $('#sphere_canvas');
	var sphere_size = parseInt((window.innerHeight-20)/2.0);
	console.debug(sphere_size);
	canvas.attr('width', sphere_size * 2);
	canvas.attr('height', window.innerHeight);
	canvas.css('left',220);
	$('#action_chooser').css({width:200});
	$('#sphere1_controls').css({left: sphere_size * 2 + 240});
	$('#sphere2_controls').css({left: sphere_size * 2 + 240,top:sphere_size+20});
	
	canvas.draggable({
	      cursor: "crosshair",
	      cursorAt: { top: +15, left: +15 },
	      helper: function( event ) {
	        return $( "<div class='marker_drag'></div>" );
	      },
	      start: markerDragStart,
	      stop: markerDragStop
	    });
	    

	editor.sphere1 = new ERViewer('sphere_canvas',0,0,sphere_size*2,sphere_size);
	editor.sphere2 = new ERViewer('sphere_canvas',0,sphere_size+20,sphere_size*2,sphere_size);
	editor.sel_canvas = document.getElementById("selected_canvas");
	$('#sphere_canvas').click(
			function(event){
				editor.setMarker(event);
			}
	);
	$('#sphere_canvas').dblclick(
			findNextSelected
	);
	$('#selected_canvas').draggable({
	      cursor: "crosshair",
	      cursorAt: { top: +15, left: +15 },
	      drag: function(event){
	    	return editor.selected_marker!=null; 
	      },
	      helper: function( event ) {
	        return $( "<div class='marker_drag'></div>" );
	      },
	      start: selectedMarkerDragStart,
	      stop: markerDragStop
	    });
	editor.actionButtons = {};
	editor.actionButtons['floor'] = $('#floor_ref_button');
	editor.actionButtons['object'] = $('#object_ref_button');
	editor.actionButtons['selected'] = $('#selected_ref_button');

	editor.setClickAction('floor');
	
	$('#top_rooms').on('change', function() {
		  alert( $(this).val() ); // or $(this).val()
	});
	
	updateScenes();
}

function findNextSelected(e){
	console.debug("Finding next selected");
	var xy = editor.relXY(e);
	var marker = editor.sphere1.findExisting(xy.x, xy.y);
	if(marker!=null){
		editor.findNextSelected(2, marker);
	}
	else {
		marker = editor.sphere2.findExisting(xy.x, xy.y);
		if(marker!=null){
			editor.findNextSelected(1, marker);
		}
		
	}	
}

editor.findNextSelected = function(sphereNum,marker){
	var sphere = sphereNum==1 ? this.sphere1 : this.sphere2;
	var newIndex = -1;
	if(sphere.scene.markers && sphere.scene.markers[marker]){
		var myIndex = -1;
		for(var i=0;i<tour_scenes.length;i++){
			if(tour_scenes[i].sceneid==sphere.scene.sceneid){
				myIndex = i;
				break;
			}
		}
		myIndex+=1;
		for(var i=0;i<tour_scenes.length;i++){
			var tmp = (i + myIndex) % tour_scenes.length;
			if(tour_scenes[tmp].markers && tour_scenes[tmp].markers[marker]){
				newIndex = tmp;
				break;
			}
		}
	}
	else {
		for(var i=0;i<tour_scenes.length;i++){
			if(tour_scenes[i].markers && tour_scenes[i].markers[marker]){
				newIndex = i;
				break;
			}
		}		
	}
	if(newIndex!=-1){
		if(sphereNum==1){
			pathi = newIndex;
		}
		else {
			path2i = newIndex;
		}
		updateScenes();
	}
};

function markerDragStart( e, ui){
	var xy = editor.relXY(e);
	var tmp = editor.sphere1.tryMarker(xy.x, xy.y, null, 'floor', e, false);
	if(tmp){
		editor.tmp_marker = tmp;
		editor.tmp_marker_sphere = 1;
		editor.sphere1.render(editor.selected_marker);
	}
	else {
		tmp = editor.sphere2.tryMarker(xy.x, xy.y, null, 'floor', e, false);		
		if(tmp){
			editor.tmp_marker = tmp;
			editor.tmp_marker_sphere = 2;
			editor.sphere2.render(editor.selected_marker);
		}
		else {
			
			return false;
		}
	}
}

function selectedMarkerDragStart( e, ui){
	editor.tmp_marker = editor.selected_marker;
	editor.tmp_marker_sphere = 3;
	return editor.tmp_marker!=null;
}

function markerDragStop( e, ui){
	if(!editor.tmp_marker_sphere){
		return;
	}
	editor.tmp_marker_sphere = 0;
	var xy = editor.relXY(e);
	var marker = editor.sphere1.tryMarker(xy.x, xy.y, editor.tmp_marker, 'floor', e, true);
	if(marker==null){
		editor.sphere2.tryMarker(xy.x, xy.y, editor.tmp_marker, 'floor', e, true);
	}
	updateScenes();
}
editor.setClickAction = function(id){
	editor.clickActionId = id;
	for(var key in editor.actionButtons){
		if(key==id){
			editor.actionButtons[key].css({'color':'black','background-color':'white'});			
		}
		else {
			editor.actionButtons[key].css({'color':'white','background-color':'black'});
		}
	}
	/*if(id!='selected'){
		this.selected_marker = null;
		var ctx=this.sel_canvas.getContext("2d");
		ctx.clearRect(0, 0, this.sel_canvas.width, this.sel_canvas.height);
	}
	*/
};

editor.relXY = function(e){
	var parentOffset = $('#sphere_canvas').offset(); 
	//or $(this).offset(); if you really just want the current element's offset
	var relX = e.pageX - parentOffset.left;
	var relY = e.pageY - parentOffset.top;
	return {x:relX,y:relY};
};

editor.setMarker = function(e){
	var relXY = this.relXY(e);
	var relX = relXY.x;
	var relY = relXY.y;
	var prev_selected = this.selected_marker;
	var use_marker = e.ctrlKey ? this.selected_marker : null;
	var skipSelecting = false;
	if(use_marker){
		skipSelecting = true;
	}
	var tmp = this.sphere1.tryMarker(relX, relY,use_marker, this.clickActionId, e, skipSelecting);
	if(tmp){
		this.selected_marker = tmp;
		//this.setClickAction('selected');
		if((this.selected_marker!=prev_selected) || this.sel_marker_scene==this.sphere1.scene.sceneid){
			this.sphere1.render(this.selected_marker,this.sel_canvas);
			this.sel_marker_scene = this.sphere1.scene.sceneid;
		}
	}
	else {
		tmp = this.sphere2.tryMarker(relX, relY, use_marker, this.clickActionId, e, skipSelecting);		
		if(tmp){
			this.selected_marker = tmp;
			//this.setClickAction('selected');
			if((this.selected_marker!=prev_selected) || this.sel_marker_scene==this.sphere2.scene.sceneid){
				this.sphere2.render(this.selected_marker,this.sel_canvas);
				this.sel_marker_scene = this.sphere2.scene.sceneid;
			}
		}
	}
	updateScenes();
};


function updateScenes(){
	
	editor.sphere1.setScene(tour_scenes[pathi]);
	editor.sphere1.orientation = tour_scenes[pathi].north ? tour_scenes[pathi].north : 0;
	editor.sphere1.render(editor.selected_marker);

	editor.sphere2.setScene(tour_scenes[path2i]);
	editor.sphere1.orientation = tour_scenes[path2i].north ? tour_scenes[path2i].north : 0;
	editor.sphere2.render(editor.selected_marker);	

	if(editor.sphere1.scene.markers && editor.sphere2.scene.markers){
		var ctx=editor.sphere1.canvas.getContext("2d");
		ctx.save();
		var markers1 = editor.sphere1.scene.markers;
		var markers2 = editor.sphere2.scene.markers;
		for(var key in markers1){
			var match = markers2[key];
			if(match){
				var xy1 = editor.sphere1.toXY(markers1[key]);
				var xy2 = editor.sphere2.toXY(match);
				ctx.setLineDash([5, 15]);
				ctx.beginPath();
				ctx.moveTo(xy1.x,xy1.y);
				ctx.lineTo(xy2.x,xy2.y);
				ctx.lineWidth = 1;
				if(key==editor.selected_marker){
					ctx.strokeStyle = '#0000ff';
				}
				else {
					ctx.strokeStyle = '#000000';	
				}

				ctx.stroke();
				ctx.setLineDash([5, 5]);
			}
		}
		ctx.restore();
	}
}

function connectDots(){
	ctx.setLineDash([5, 15]);

	ctx.beginPath();
	ctx.moveTo(0,100);
	ctx.lineTo(400, 100);
	ctx.stroke();
}

function updatePathI(sphere,delta){
	if(sphere==0){
		pathi+=delta;
		if(pathi < 0){
			pathi=0;
		}
		if($('#sync_bottom').is(":checked")){
			if(pathi > tour_scenes.length-2){
				pathi = tour_scenes.length-2;
			}
			path2i = pathi + 1;
		}
	}
	else if(sphere==1){
		path2i+=delta;
		if(path2i < 0){
			path2i = 0;
		}
		if(path2i > tour_scenes.length-1){
			path2i= tour_scenes.length;
		}		
	}
	updateScenes();
}

function calcSection(heading,width){
	var ppd = width/360.0;
	var offset = heading * ppd;
	var subwidth = width-offset;

	return {offset:offset,subwidth:subwidth};
}

