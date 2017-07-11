/*
 * Copyright Walkabout Worlds, LLC 2015-2016
 */

var tour = null;
var tourid = getUrlParameters().tourid;
if(!tourid){
	alert("tourid must be specified!!!!");
}
var tourpath = "tours/"+tourid+"/scenes.json";
var scene_uis = {};
var ordered_scenes = [];


function startup(data){
	tourManager.setPaths(tourpath);
	tourManager.params = {"tour":tourpath};
	tour = data;
	roomAssigner.init();
	for(var key in tour.scenes){
		var scene = tour.scenes[key];
	}

	$('#connection_chooser').dialog({
		  modal: true,
		  autoOpen: false,
		  title: "Choose connection to another room",
		  minWidth: 900,
		  buttons : {
              Ok: function() {
            	  roomEditor.connectui.ok() //closing on Ok click
              },
              Cancel:function() {
            	  roomEditor.connectui.cancel() //closing on Ok click
              }
          }
	});
	$('#delete_images_dialog').dialog({
		  modal: true,
		  autoOpen: false,
		  title: "Delete Images",
		  minWidth: 400,
		  buttons : {
            Ok: function() {
              deleteSelected2();
          	  $('#delete_images_dialog').dialog("close"); //closing on Ok click
            },
            Cancel:function() {
            	$('#delete_images_dialog').dialog("close"); //closing on Ok click
            }
        }
	});
	
	$("#rooms").on('change',renderScenes);
	$.ajax({url:"get_aws_link?tourid="+tourid,
		success: setAWSLink,
		dataType:"json",
		error: function(status,xhr){
			upload_in_progress = false;
			alert("Failed to retrieve aws link "+JSON.stringify(status));
			$("#awslink").html("Not Available");
		}
	});

	populateRooms();
	renderScenes();
	
}

function viewList(){
	var url = 'walkaboutlist.html';
	saveAll(false,function(){window.open(url, "_self");});
}

function viewTour(edit){
	var url = 'walkabout.html?tour=tours/'+tourid+'/scenes.json';
	if(edit){
		url+="&editMode=true";
		saveAll(false,function(){window.open(url, "_self");});
	}
	else {
		saveAll(false,function(){window.open(url, "_blank");});
	}
	console.debug("View Tour!");
}

function selectAllTPs(){
	$('.scene_shell').addClass('selected_tinyplanet');
}

function deselectAllTPs(){
	$('.scene_shell').removeClass('selected_tinyplanet');
}

var roomAssigner = {
	init: function(){
		$('#move_dialog').dialog({
			  modal: true,
			  autoOpen: false,
			  title: "Assign Images To A Room",
			  minWidth: 600
		});
		$('#launch_assigner').click(roomAssigner.showDialog);
		$('#assign_existing').click(roomAssigner.assignToExisting);
		$('#assign_new').click(roomAssigner.assignToNew);
	},
	showDialog: function(){
		var rooms = sceneUtil.roomMap(tour);
		$("#existing_rooms").empty();
		$("#existing_error").empty();
		$("#new_room_error").empty();
		$("#new_room").val("");
		$.each(Object.keys(rooms), function() {
			$("#existing_rooms").append($("<option />").val(this).text(this));
		});
		$("#move_dialog").dialog("open");
	},
	assignToExisting: function(){
		var val = $("#existing_rooms").val();
		if(!val){
			$("#existing_error").html("No existing room specified");
		}
		else {
			roomAssigner.assignRoom(val);
			$("#move_dialog").dialog("close");
		}
	},
	assignToNew: function(){
		var val = $("#new_room").val();
		if(!val){
			$("#new_room_error").html("You must specify a name for the room");
		}
		else {
			roomAssigner.assignRoom(val);
			$("#move_dialog").dialog("close");
			populateRooms();
		}
	},
	assignRoom: function(roomName){
		$.each($('.selected_tinyplanet'),function(){
			var sid = $(this).attr('sceneid');
			tour.scenes[sid].room = roomName;
		});
		renderScenes();
	}
};
function deleteSelected(){
	var size = $('.selected_tinyplanet').length;
	$("#delete_count").html(size)
	$( "#delete_images_dialog" ).dialog("open");
}
function deleteSelected2(){
	var toDelete = {};
	var keyList = [];
	$.each($('.selected_tinyplanet'),function(){
		var sid = $(this).attr('sceneid');
		toDelete[sid]=true;
		delete tour.scenes[sid];
		keyList.push(sid);
	});
	for(var del in toDelete){
		for(var sid in tour.scenes){
			var scene = tour.scenes[sid];
			if(scene.paths && scene.paths[del]){
				delete scene.paths[del];
			}
		}
	}
	saveAll(false,function(){deleteImages(keyList);});
	renderScenes();
}

function deleteImages(toDelete){
	$.ajax({url:"delete_images",
		data: {
			tourid:tourid,
			images:JSON.stringify(toDelete)
		},
		success: setAWSLink,
		dataType:"json",
		error: function(status,xhr){
			upload_in_progress = false;
			alert("Failed to upload tour "+JSON.stringify(status));
			$("#awslink").html("Upload Failed");
		}
	});
	
}

function saveAll(showAlert,callback){
	tour.smartLoad = true;
	if(!tour.floorPlans){
		tour.floorPlans = {};
	}
	saveTour(showAlert,callback);
}
var upload_in_progress = false;
function startAWSUpload(){
	if(upload_in_progress){
		alert("Upload already in progress");
		return;
	}
	upload_in_progress = true;
	//save_image?tourid="+tourid
	$("#awslink").html("Publishing...");
	$.ajax({url:"upload_to_aws?tourid="+tourid,
		success: setAWSLink,
		dataType:"json",
		error: function(status,xhr){
			upload_in_progress = false;
			alert("Failed to upload tour "+JSON.stringify(status));
			$("#awslink").html("Upload Failed");
		}
	});
}
function unpublish(){
	$.ajax({url:"delete_aws_link?tourid="+tourid,
		success: setAWSLink,
		dataType:"json",
		error: function(status,xhr){
			upload_in_progress = false;
			alert("Failed to unpublish walkabout "+JSON.stringify(status));
			$("#awslink").html("Unpublish Failed");
		}
	});
}

function setAWSLink(data){
	upload_in_progress = false;
	if(data.url){
		$("#awslink").html("<a href=\""+data.url+"\" target='_blank'>"+data.url+"</a> <button onclick='unpublish()'>Unpublish</button>");
	}
	else {
		$("#awslink").html("This walkabout has not been published");		
	}
}

function uploadToAWS(){
	saveTour(false,startAWSUpload);
}


function showMoveDialog(){
	$("#move_dialog").dialog("open");
}
Dropzone.options.myAwesomeDropzone = {
		paramName: "file", // The name that will be used to transfer the file
		maxFilesize: 10, // MB
		accept: function(file, done) {
			if (file.name == "justinbieber.jpg") {
				done("Naha, you don't.");
			}
			else {
				var sceneid = file.name;
				if(!tour.scenes[sceneid]){
					tour.scenes[sceneid] = {
							"sceneid": sceneid,
							"panorama": "Photospheres/"+sceneid,
							"north": 0};
				}
				done(); 
			}
		},
		url: function(files){ return "save_image?tourid="+tourid},
		init:function(){
			this.on("complete", function(file,e) {
				var sceneid = file.name;
				Dropzone.forElement("#my-awesome-dropzone").removeFile(file);
				if(!tour.scenes[sceneid]){
					tour.scenes[sceneid] = {
							"sceneid": sceneid,
							"panorama": "Photospheres/"+sceneid,
							"north": 0};
				}
				try {
					tour.scenes[sceneid].north = parseFloat(file.xhr.responseText);
					console.debug("Set north to "+tour.scenes[sceneid].north);
				}catch(e){
					console.debug(e);
				}
				if(scene_uis[sceneid]){
					scene_uis[sceneid].render();
				}
				else {
					renderScenes();
				}
			})
		}
}
$(document).ready(
		function(){
			$.ajax({url:tourpath,
				success: startup,
				dataType:"json",
				error: function(status,xhr){
					alert("Failed to load tour "+JSON.stringify(status));
				}
			});
		}	
);


function renderScenes(){
	$('#scenes').empty();
	scene_uis = {};
	ordered_scenes = [];
	var tmp = [];
	var filter = $('#rooms').val();
	
	for(var sceneid in tour.scenes){
		var scene = tour.scenes[sceneid];
		if(filter=='unassigned'){
			if(scene.room){
				continue;
			}
		}
		else if(filter!="all"){
			if(scene.room!=filter){
				continue;
			}
		}
		tmp.push(scene);
	}
	
	tmp.sort(function(a, b){
		
	    var keyA = a.room,
        keyB = b.room;
	    if(!keyA){
	    	if(!keyB){
	    		return a.sceneid.localeCompare(b.sceneid);
	    	}
	    	else {
	    		return -1;
	    	}
	    }
	    if(!keyB){
	    	return 1;
	    }
	    var cmp = keyA.localeCompare(keyB);
	    if(cmp==0){
	    	return a.sceneid.localeCompare(b.sceneid);
	    }
	    else {
	    	return cmp;
	    }
	});
	var cur = "DASFASDFASDFASDFEFASGD";
	if(!tour.floorPlans){
		tour.floorPlans = {};
	}
	
	for(var i=0;i<tmp.length;i++){
		var scene = tmp[i];
		if(scene.room!=cur){
			cur = scene.room;
			var display = cur;
			if(!display){
				display = "Unassigned";
				$('#scenes').append("<div class='room_header'>"+display+"</div>");

			}
			else{
				var fpimg = "Drag floor plan here";
				if(tour.floorPlans[display]){
					var fpurl = tourManager.get_url(tour.floorPlans[display]);
					fpimg = "<img src='"+fpurl+"' class='fp_image'/><br/>Drag and drop new floor here";
				}
				var eid = "dz"+(i+1);
				$('#scenes').append("<div class='room_header'>"+display+"<br/> <div class='floor_plan_drop' id='"+eid+"'>"+fpimg
						+"</div> Rotate Images <button onclick=\"rotateAll('"+display+"',-1)\">&lt;</button><button onclick=\"rotateAll('"+display+"',1)\">&gt;</button></div>");
				var dzconfig = create_dzone_config(tourid,"#"+eid,display);
				new Dropzone("#"+eid,dzconfig );
			}
		}
		var ui = new SceneUI(scene.sceneid);
		scene_uis[scene.sceneid]=ui;
		ordered_scenes.push(ui);
		$('#scenes').append(ui.shell());
	}
}

function rotateAll(room,delta){
	for(var key in scene_uis){
		if(tour.scenes[key].room==room){
			rotateTile(key, scene_uis[key].elemid, delta);
		}
	}
}

function create_dzone_config(tourid,dzid,room){
	return {
		paramName: "file", // The name that will be used to transfer the file
		maxFilesize: 10, // MB
		accept: function(file, done) {
			if (file.name == "justinbieber.jpg") {
				done("Naha, you don't.");
			}
			else { done(); }
		},
		url: function(files){ return "save_image?tourid="+tourid+"&floorplan=true"},
		init:function(){
			this.on("complete", function(file) {
				Dropzone.forElement(dzid).removeFile(file);
				tour.floorPlans[room] = file.name;
				var fpurl = tourManager.get_url(tour.floorPlans[room]);
				tour.floorPlans[room] = file.name;
				var fpimg = "<img src='"+fpurl+"' class='fp_image'/><br/>Drag and drop new floor here";
				$(dzid).html(fpimg);
			});
		}
}
}

function shiftSelect(ui){
	var last_sel = -1;
	var cur = -1;
	for(var i=0;i<ordered_scenes.length;i++){
		var tmp = ordered_scenes[i];
		if(tmp==ui){
			cur = i;
			break;
		}
		if(tmp.isSelected()){
			last_sel = i;
		}
	}
	if(last_sel!=-1 && cur!=-1){
		for(var i=last_sel+1;i<=cur;i++){
			ordered_scenes[i].forceSelect();
		}
	}
}

function populateRooms(){
	var rooms = sceneUtil.roomMap(tour);
	var val = $("#rooms").val();
	$("#rooms").empty();
	$("#rooms").append($("<option />").val("all").text("All"));	
	$("#rooms").append($("<option />").val("unassigned").text("Unassigned"));
	$.each(Object.keys(rooms), function() {
		$("#rooms").append($("<option />").val(this).text(this));
	});
	if(val){
		$("#rooms").val(val);
	}
}

function rotateTile(sceneid,elemid,delta){
	var scene = tour.scenes[sceneid];
	if(!scene.north){
		scene.north = 0;
	}
	scene.north = (720.0 + scene.north + delta) % 360.0;
	var rotation = (scene.north+180)%360;
	$('#i_'+elemid).css('transform','rotate('+rotation+'deg)');
	//scene_uis[sceneid].render();
}

function SceneUI(sceneid){
	this.sceneid = sceneid;
	
	this.elemid = "ui_"+(sceneid.replace(/\W/g,""));
}

SceneUI.prototype = {
		shell: function(){
			return "<div id=\""+this.elemid+"\" sceneid=\""+this.sceneid+"\" class='scene_shell'>"+this.render_html()
			+"<div><button onclick='rotateTile(\""+this.sceneid+"\",\""+this.elemid+"\",-1)'>&lt;</button><button onclick='rotateTile(\""+this.sceneid+"\",\""+this.elemid+"\",1)'>&gt;</button> "+this.sceneid+"</div></div>";
		},
		render_html: function(){
			//var tp = tourManager.get_tiny_planet(tour.scenes[this.sceneid]);
			var tp = tourManager.get_tiny_planet(tour.scenes[this.sceneid]);
			var north = tour.scenes[this.sceneid].north;
			var img_style = "";
			var rotation = 180;
			if(north){
				rotation = (north+180)%360;
			}
			img_style="style=\"transform: rotate("+rotation+"deg);\"";
			var selected = this.selected ? "selected" : "";
			return "<img id='i_"+this.elemid+"' src='"+tp+"' class='tinyplanet' onclick='scene_uis[\""+this.sceneid+"\"].toggleSelected(event)' "+img_style+"/>"+selected;
		},
		render: function(){
			$('#'+this.elemid).html(this.render_html());
		},
		toggleSelected: function(e){
			if(e.shiftKey){
				shiftSelect(this);
				return;
			}
			var e = $('#'+this.elemid);
			console.debug(e);
			if(e.hasClass("selected_tinyplanet")){
				e.removeClass("selected_tinyplanet");
			}
			else {
				e.addClass("selected_tinyplanet");				
			}
		},
		isSelected: function(){
			return $('#'+this.elemid).hasClass("selected_tinyplanet");
		},
		forceSelect: function(){
			$('#'+this.elemid).addClass("selected_tinyplanet");
		}
};


function TileUI(sceneid, room_connection){
	this.sceneid = sceneid;
	
	this.elemid = "tile-"+(sceneid.replace(/\W/g,""));
	this.room_connection = room_connection;
}

TileUI.prototype = {
		html: function(unset_tiles){
			
			var scene = tour.scenes[this.sceneid];
			var style = '';
			if(scene.room_coords){
				console.debug(JSON.stringify(scene.room_coords));
				this.x = scene.room_coords.x;
				this.y = scene.room_coords.y;
			}
			else {
				this.x = unset_tiles.x;
				this.y = unset_tiles.y;
				unset_tiles.x+=10;
				unset_tiles.y+=10;
			}
			style="top: "+this.y+"px; left: "+this.x+"px;";
			//$('#'+this.img_id).css('transform','rotate('+rotation+'deg)')
			//return "<img src='"+tp+"' class='tile' sceneid='"+this.sceneid+"' id='"+this.elemid+"' style='"+style+"' onclick='roomEditor.putOnTop(\"center_\"+this.id)'/>";
			return "<div class='tile' sceneid='"+this.sceneid+"' id='"+this.elemid+"' style='"+style+"' onclick='roomEditor.putOnTop(\"center_\"+this.id,event)'>"+
			this.inner_html()+"</div>";
		},
		inner_html: function(){
			var scene = tour.scenes[this.sceneid];
			var tp = tourManager.get_tile(scene);
			var north = tour.scenes[this.sceneid].north;
			var img_style = "";
			
			if(north){
				img_style="style=\"transform: rotate("+north+"deg);\"";
			}
			var doors = "";
			//<div id="connection_door" style="left: 200px; top: 200px;" class="door"></div>
			if(scene.connections){
				var centerX = 360/2;
				var centerY = 360/2;
				for(var key in scene.connections){
					var dcoords = scene.connections[key];
					var x = dcoords.x + centerX - (25/2);
					var y = dcoords.y + centerY - (40/2);
					doors+="<div style=\"left: "+x+"px; top: "+y+"px;\" class=\"door\" "
					+" onclick='roomEditor.connectui.openExisting(\""+this.sceneid+"\",\""+key+"\")'></div>";
				}
			}
			return "<img src='"+tp+"' class='tile_img' sceneid='"+this.sceneid+"' id='img_"+this.elemid+"' "+img_style+"/>"+doors;
		},
		update_inner_html: function(){
			$("#"+this.elemid).html(this.inner_html());
		},
		center_html: function(){
			var style = '';
			var edge = 360/2 - 10;
			style="top: "+(this.y+edge)+"px; left: "+(this.x+edge)+"px;";
			if(this.room_connection){
				style+=" border-radius: 2%";
			}
			return "<div class='tile_center' sceneid='"+this.sceneid+"' onclick='roomEditor.putOnTop(this.id,event)' id='center_"+this.elemid+"' style='"+style+"'></div>";
		},
		update_rotation: function(delta){
			var scene = tour.scenes[this.sceneid];
			if(!scene.north){
				scene.north = 0;
			}
			scene.north = (720.0 + scene.north + delta) % 360.0;
			var rotation = (scene.north+180)%360;;
			$('#img_'+this.elemid).css('transform','rotate('+rotation+'deg)');			
		}		
};


var roomEditor = {
		connectui:{}
};

roomEditor.getSelectedTile = function(){
	for(var i=0;i<this.tiles.length;i++){
		var tile = this.tiles[i];
		if($('#'+tile.elemid).hasClass('selected_tile')){
			return tile;
		}
	}
	return null;
};

roomEditor.rotateSelected = function(delta){
	var tile = this.getSelectedTile();
	tile.update_rotation(delta);
};

roomEditor.putOnTop = function(eid,e){
	for(var i=0;i<this.tiles.length;i++){
		var tile = this.tiles[i];
		if("center_"+tile.elemid!=eid){
			console.debug("Putting down");
			$('#'+tile.elemid).css("zIndex",1);
			$('#'+tile.elemid).removeClass("selected_tile");
			$('#center_'+tile.elemid).removeClass("selected_center");
		}
		else {
			console.debug("Putting on top");
			$('#'+tile.elemid).css("zIndex",10);			
			$('#'+tile.elemid).addClass("selected_tile");
			$('#center_'+tile.elemid).addClass("selected_center");
		}
	}
};

roomEditor.open = function(room_name){
	this.cur_room = room_name;
	var rooms = sceneUtil.roomMap(tour);
	var scenes = rooms[room_name];
	var tmp = [];
	var unset_tiles = {x:0,y:0};
	$('#re_map').empty();
	if(tour.floorPlans && tour.floorPlans[room_name]){
		$('#re_map').append($("<img>",{"src":tour.floorPlans[room_name]}))
	}
	for(var i=0;i<scenes.length;i++){
		var sceneid = scenes[i].sceneid;
		var tileui = new TileUI(sceneid);
		tmp.push(tileui);
		$('#re_map').append(tileui.html(unset_tiles));
		$('#re_map').append(tileui.center_html());
	}
	this.tiles = tmp;
	$('#room_editor').css("visibility","visible");	
	this.makeDraggable(".tile");
};

roomEditor.find = function(sceneid){
	for(var i=0;i<this.tiles.length;i++){
		if(this.tiles[i].sceneid==sceneid){
			return this.tiles[i];
		}
	}
	return null;
	
};

roomEditor.makeDraggable = function(selector){
	$(selector).draggable(
			{
			start: function(){
				$(this).css("zIndex",100);
			},
			stop: function(e){
				roomEditor.putOnTop("center_"+this.id);
				console.debug(e);
			},
			drag:function() {
				var edge = 360/2 - 10;
				var position = $(this).position();
				var center_id = '#center_'+this.id;
				$(center_id).css({top:position.top+edge,left:position.left+edge});
			}
		}
	);	
	
	$(selector).click(
		function(e){
			if(e.ctrlKey){
				var diffX = e.pageX - e.clientX;
				var diffY = e.pageY - e.clientY;
				var posX = e.clientX - $(this).offset().left,
	            posY = e.clientY - $(this).offset().top;
				console.debug("Element XY "+posX+" "+posY);
				posX+=diffX;
				posY+=diffY;
				if(roomEditor.anchorX!=-1){
					var newpos = {top:roomEditor.anchorY - posY - 25,left:roomEditor.anchorX - posX};
					console.debug(newpos);
					$(this).css(newpos);
					var edge = 360/2 - 10;
					var position = $(this).position();
					var center_id = '#center_'+this.id;
					$(center_id).css({top:newpos.top+edge,left:newpos.left+edge});
				}
			}
			else {
				roomEditor.anchorX = e.clientX;
				roomEditor.anchorY = e.clientY;
				console.debug("Anchor XY "+roomEditor.anchorX+" "+roomEditor.anchorY);
			}
			console.debug(e);
		}	
	);
};

roomEditor.connectui.openExisting = function(sceneid,doorid){
	roomEditor.putOnTop("center_"+roomEditor.find(sceneid).elemid);
	this.open(doorid);
};

roomEditor.connectui.open = function(existing){
	console.debug("Existing: "+existing);
	if($(".selected_tile").length==0){
		$("<div>Please Select A Tile To Connect To</div>").dialog({title:"Select A Tile"});
		return;
	}
	var sid = $(".selected_tile").attr("sceneid");
	this.cur_scene = tour.scenes[sid];
	
	$('#connection_main_img').attr("src",tourManager.get_tile(this.cur_scene));
	$('#connection_chooser').dialog("open");
	var rooms = sceneUtil.roomMap(tour);
	$("#connection_rooms").empty();

	var connections = this.cur_scene.connections;
	if(!connections){
		connections = {};
	}
	this.options = {};
	this.org_sceneid = existing;
	$.each(Object.keys(rooms), function() {
		if(this!=roomEditor.cur_room){
			var unused = [];
			for(var i=0;i<rooms[this].length;i++){
				var scene = rooms[this][i];
				if((scene.sceneid==existing) || (!connections[scene.sceneid])){
					unused.push(scene.sceneid);
				}
			}
			if(unused.length > 0){
				$("#connection_rooms").append($("<option />").val(this).text(this));
				roomEditor.connectui.options[this] = unused;
			}
		}
	});
	if(existing){
		var cscene = tour.scenes[existing];
		var c = connections[existing];
		if(!c){
			c = {x:20,y:20};
		}
		var x = (180-(25/2))+c.x;
		var y = (180-(25/2))+c.y;
		
		this.setDoorLocation(x, y);
		$("#connection_rooms").val(cscene.room);
		this.scenes = this.options[cscene.room];
		this.sceneIndex = 0;
		for(var i=0;i<this.scenes.length;i++){
			if(this.scenes[i].sceneid==existing){
				this.sceneIndex = i;
				break;
			}
		}
		$("#connect_remove").css("visibility","visible");		
		this.showTile();
	}
	else {
		var c = {x:20,y:20};
		var x = (180-(25/2))+c.x;
		var y = (180-(25/2))+c.y;
		this.setDoorLocation(x, y);
		$("#connect_remove").css("visibility","hidden");		
		this.showRoom();
	}
	console.debug($("#connection_rooms").val());
};

roomEditor.connectui.setDoorLocation = function(x,y){
	$('#connection_door').css({"left":Math.round(x)+"px","top":Math.round(y)+"px"});
};
roomEditor.connectui.moveDoor = function(e){
	var parentOffset = $('#connection_main_img').parent().offset(); 
	//or $(this).offset(); if you really just want the current element's offset
	var relX = e.pageX - parentOffset.left;
	var relY = e.pageY - parentOffset.top;
	var height = $("#connection_door").outerHeight();
	var width = $("#connection_door").outerWidth();
	relX-=(width/2);
	relY-=(height/2);
	console.debug(relX+" "+relY);
	this.setDoorLocation(relX, relY);
};
roomEditor.connectui.showRoom = function(){
	this.sceneIndex = 0;
	var room = $("#connection_rooms").val();
	this.scenes = this.options[room];
	this.showTile();
};
roomEditor.connectui.showTile = function(){
	var scene = tour.scenes[this.scenes[this.sceneIndex]];
	var tp = tourManager.get_tile(scene);
	$('#connection_img').attr('src',tp);
};
roomEditor.connectui.rotate = function(delta){
	this.sceneIndex = (this.scenes.length + this.sceneIndex + delta) % this.scenes.length;
	this.showTile();
};

roomEditor.connectui.cancel = function(){
	$('#connection_chooser').dialog("close");
};
roomEditor.connectui.ok = function(){
	var scene = this.cur_scene;
	if(this.org_sceneid){
		var oscene = tour.scenes[this.org_sceneid];
		delete scene.connections[this.org_sceneid];
		delete oscene.connections[scene.sceneid];
	}
	var cscene = tour.scenes[this.scenes[this.sceneIndex]];
	var hwidth = $("#connection_door").outerWidth()/2;
	var hheight = $("#connection_door").outerHeight()/2;

	var position = $("#connection_door").position();
	
	var centerX = $('#connection_img').outerWidth()/2;
	var centerY = $('#connection_img').outerHeight()/2;
	
	var doorX = position.left + hwidth;
	var doorY = position.top + hheight;
	
	var deltaX = doorX - centerX;
	var deltaY = doorY - centerY;
	
	if(!scene.connections){
		scene.connections = {};
	}
	scene.connections[cscene.sceneid] = {x:deltaX,y:deltaY};
	if(!cscene.connections){
		cscene.connections = {};
	}
	cscene.connections[scene.sceneid] = {x:-deltaX,y:-deltaY};
	roomEditor.find(scene.sceneid).update_inner_html();
	$('#connection_chooser').dialog("close");
};

roomEditor.connectui.removeConnection = function(){
	var scene = this.cur_scene;
	if(this.org_sceneid){
		var oscene = tour.scenes[this.org_sceneid];
		delete scene.connections[this.org_sceneid];
		delete oscene.connections[scene.sceneid];
	}
	roomEditor.find(scene.sceneid).update_inner_html();
	$('#connection_chooser').dialog("close");
};

roomEditor.close = function(){
	for(var i=0;i<this.tiles.length;i++){
		var tile = this.tiles[i];
		if(tile.room_connection){
			continue;
		}
		var position = $('#'+tile.elemid).position();
		var scene = tour.scenes[tile.sceneid];
		scene.room_coords = {x:position.left, y:position.top};
	}
	for(var i=0;i<this.tiles.length;i++){
		var tile = this.tiles[i];
		if(!tile.room_connection){
			continue;
		}
		var position = $('#'+tile.elemid).position();
		var scene = tour.scenes[tile.sceneid];
		scene.room_coords = {x:position.left, y:position.top};
	}
	$('#room_editor').css("visibility","hidden");
};