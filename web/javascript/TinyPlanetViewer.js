function TinyPlanet(eid,scene){
	this.eid = eid;
	this.img_id = eid+"_img";
	this.scene = scene;	
	this.heading = 0;
}

TinyPlanet.prototype.html = function(){
	var src = tourManager.get_tiny_planet(this.scene);
	return "<div class='tinyplanet' id='"+this.eid+"'><img class='tinyplanet_img'  id='"+this.img_id+"' src='"+src+"'/></div>";
};

TinyPlanet.prototype.update = function(){
	var rotation = this.scene.north ? this.scene.north : 0;
	rotation = parseInt((rotation + this.heading + 720) % 360);
	console.debug(JSON.stringify({'transform':'rotate('+rotation+'deg)'}));
	console.debug($('#'+this.img_id).length);
	$('#'+this.img_id).css('transform','rotate('+rotation+'deg)');
};

TinyPlanet.prototype.setPosition = function(left,top){
	$('#'+this.eid).css({left:left,top:top});
};

TinyPlanet.prototype.getPosition = function(){
	return $('#'+this.eid).position();	
};
TinyPlanet.prototype.getDiv = function(){
	return $('#'+this.eid);	
};


