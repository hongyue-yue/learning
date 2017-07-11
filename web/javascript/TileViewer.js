var Markers = {
		types: {
			floor:{set:"setFloorMarker",draw:"drawFloorRef"},
			object:{set:"setObjectMarker",draw:"drawObjectRef"},
			door:{set:"setDoorMarker",draw:"drawDoorRef"},
			selected:{set:"setFloorMarker",draw:"drawFloorRef"},
		},
		getType: function(id){
			var i = id.indexOf("_");
			var prefix = id.substr(0,i);
			var tmp = Markers.types[prefix];
			tmp.id = prefix;
			return tmp;
		},
		generateID:function(prefix){
			return prefix+"_"+new Date().getTime()+"_"+parseInt(Math.random()*10000.0);
		},
};





function TileViewer(id,osx,osy,oswidth,osheight){
	this.id = id;
	console.debug("TileViewer "+osx+" "+osy+" "+oswidth+" "+osheight);
	this.canvas = document.getElementById(id);
	this.orientation = 0;
	this.osx = osx;
	this.osy = osy;
	this.oswidth = oswidth;
	this.osheight = osheight;
}

TileViewer.prototype.setScene = function(scene){
	this.scene = scene;
	if(scene==null){
		this.image = null;
		return;
	}
	this.image = tourManager.get_panorama(scene);
};
TileViewer.prototype.setImage = function(img){
	this.image = img;
};



TileViewer.prototype.setOrientation = function(ort){
	this.orientation = (720.0 + ort) % 360;
	this.render();
};

TileViewer.prototype.shiftHeading = function(delta){
	this.setOrientation(this.orientation+delta);
};

TileViewer.prototype.shiftHeadingByPixels = function(delta){
	var dpp = 360.0/this.oswidth;
	var d = dpp * delta;
	console.debug(d);
	this.setOrientation(this.orientation+d);
};


TileViewer.prototype.render = function(marker,marker_type){
	var ctx=this.canvas.getContext("2d");
	ctx.clearRect(this.osx, this.osy, this.oswidth, this.osheight);
	if(this.scene==null){
		return;
	}
	console.debug("OR:"+this.orientation);
	if(this.orientation==0){
		ctx.drawImage(this.image,0,0,this.image.width,this.image.height,this.osx,this.osy,this.oswidth,this.osheight);
	}
	else {
		var srcSec = calcSection(this.orientation, this.image.width);
		var destSec = calcSection(this.orientation, this.oswidth);
	
		ctx.drawImage(this.image,0,0,srcSec.subwidth,this.image.height,this.osx+destSec.offset,this.osy,destSec.subwidth,this.osheight);
		ctx.drawImage(this.image,srcSec.subwidth,0,srcSec.offset,this.image.height,this.osx,this.osy,destSec.offset,this.osheight);
	}

	if(marker){
		//console.debug("Drawing "+key);
		var type = Markers.types[marker_type];
		this[type.draw](marker,true);
	}
};


TileViewer.prototype.drawFloorRef = function(floor_ref,selected){
	var xy = this.lonLatToXY(floor_ref.lon, floor_ref.lat);
	var x = xy[0];
	var y = xy[1];
	
	var ctx=this.canvas.getContext("2d");
	if(selected){
		ctx.strokeStyle = '#0000ff';
		ctx.lineWidth = 3;
	}
	else {
		ctx.strokeStyle = '#000000';	
		ctx.lineWidth = 1;
	}
	ctx.beginPath();
	ctx.moveTo(x-20,y);
	ctx.lineTo(x+20,y);
	ctx.stroke();
	
	ctx.beginPath();
	ctx.moveTo(x,y-20);
	ctx.lineTo(x,y+20);
	ctx.stroke();
};

TileViewer.prototype.drawDoorRef = function(door_ref,selected){
	var xy = this.lonLatToXY(door_ref.lon, door_ref.lat);
	var x = xy[0];
	var y = xy[1];
	
	var ctx=this.canvas.getContext("2d");
	if(selected){
		ctx.strokeStyle = '#0000ff';
		ctx.lineWidth = 20;
	}
	else {
		ctx.strokeStyle = '#000000';	
		ctx.lineWidth = 20;
	}
	
	ctx.beginPath();
	ctx.moveTo(x,y-20);
	ctx.lineTo(x,y+20);
	ctx.stroke();
};

TileViewer.prototype.drawObjectRef = function(obj_ref,selected){
	var xy = this.lonLatToXY(obj_ref.lon, obj_ref.lat);
	var x = xy[0];
	var y = xy[1];

	if(obj_ref.lat2==null){
		obj_ref.lat2 = obj_ref.lat + 10;
	}
	var y2 = this.latToY(obj_ref.lat2)+3; 
	
	var ctx=this.canvas.getContext("2d");
	if(selected){
		ctx.strokeStyle = '#0000ff';
		ctx.lineWidth = 3;
	}
	else {
		ctx.strokeStyle = '#000000';	
		ctx.lineWidth = 1;
	}
	ctx.beginPath();
	ctx.moveTo(x-20,y);
	ctx.lineTo(x+20,y);
	ctx.stroke();
	
	ctx.beginPath();
	ctx.moveTo(x-20,y2);
	ctx.lineTo(x+20,y2);
	ctx.stroke();
	
};

TileViewer.prototype.lonLatToXY = function(lon,lat){
	var center = this.osheight/2.0;
	var center_height = center/4;
	var distance = center_height/Math.tan(lon * (Math.PI/180));
	var theta = lon * (Math.PI/180);
	var x = distance * Math.cos(theta);
	var y = distance * Math.sin(theta);
	x = this.osx-x;
	y = this.osy+y;
	console.debug("x,y: "+x+","+y);
	return [x,y];
	
};

TileViewer.prototype.XYtoLonLat = function(x,y){
	x-=this.osx;
	y-=this.osy;
	x=-x;
	y=-y;
	var center = this.osheight/2.0;
	var center_height = center/4;
    var dx = x - center;
    var dy = y - center;
    var rads = Math.atan2(dy,dx);
    var heading = (360 + degrees(rads) +90) %360;
    
    var distance = Math.sqrt(dx*dx + dy*dy);
    var rads = Math.atan2(-center_height,-distance);
    var lat = degrees(rads);
    return [heading,lat];
};

function degrees(rads){
	return rads * (180/Math.PI);
}



TileViewer.prototype.inBoundingBox = function(x,y){
	x-=this.osx;
	y-=this.osy;
	return x > 0 && x < this.oswidth && y > 0 && y < this.osheight;
};

TileViewer.prototype.toLatLon = function(x,y){
	if(this.inBoundingBox(x, y)){
		var lonlat = this.XYtoLonLat(x, y);
		return {
			lon: lonlat[0],
			lat: lonlat[1]
		}
	}
	else {
		return null;
	}
};
TileViewer.prototype.toXY = function(ll){
	var xy = this.lonLatToXY(ll.lon, ll.lat);		
	return {
		x: xy[0],
		y: xy[1]
	};
};


TileViewer.prototype.setFloorMarker = function(ll,mid){
	if(!this.scene.markers){
		this.scene.markers = {};
	}
	this.scene.markers[mid] = ll;
};

TileViewer.prototype.setDoorMarker = function(ll,mid){
	if(!this.scene.markers){
		this.scene.markers = {};
	}
	this.scene.markers[mid] = ll;
};


TileViewer.prototype.findExisting = function(x,y){
	if(!this.inBoundingBox(x, y)){
		return null;
	}
	for(var key in this.scene.markers){
		var obj = this.scene.markers[key];
		var xy = this.lonLatToXY(obj.lon, obj.lat);

		var tmp = tmpx*tmpx + tmpy*tmpy;
		var distance = Math.sqrt(tmp);
		if(distance < 20){
			return key;
		}
	}
	return null;	
};

TileViewer.prototype.tryMarker = function(x,y,selected_marker,marker_type,e,skip_selecting){
	var ll = this.toLatLon(x, y);
	console.debug(ll);
	if(!ll){
		return null;
	}
	if(!skip_selecting){
		if(this.scene.markers){
			var tmp = this.findExisting(x, y);
			if(tmp){
				return tmp;
			}
		}
	}
	if(selected_marker){
		var type = Markers.getType(selected_marker);
		this[type.set](ll,selected_marker);
		return selected_marker;
	}
	var type = Markers.types[marker_type];
	var marker_id = Markers.generateID(marker_type);
	this[type.set](ll,marker_id);

	selected_marker = marker_id;
	return selected_marker;
};


