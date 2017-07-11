var lastDoor = -1;
var pathi = 0;
var tour;
var tour_scenes = [];
var touri = 0;
var panzoom = {
	panX: 0,
	panY: 0,
	scale: 1.0
};
$(document).ready(
	function(){
		tourManager.getTourFromParams(onTourLoad,true);
	}	
);

var tinyi = 0;


var main_canvas;
function onTourLoad(data){
	main_canvas = document.getElementById('overhead_view');
	tour = data;
	console.debug(tour);
	var stack = 0;
    for(var key in tour.scenes){
		var scene = tour.scenes[key];
		if(scene.overhead){
			scene.overhead.stack = 0;
		}
		//delete scene.overhead;
		tour_scenes.push(scene);
    }
	setCurrentTile(0);
	drawOverhead();
    //saveTour();	
}

function setCurrentTile(i){
	touri = i;
	$('#currentTile').attr('src',tourManager.get_url(tour_scenes[touri].panorama));
	if(touri > 0){
		$('#otherTile').attr('src',tourManager.get_url(tour_scenes[touri-1].panorama));		
	}
	else {
		$('#otherTile').attr('src',"");				
	}
	drawOverhead();
}

function nextTile(){
	if(touri < tour_scenes.length-1){
		setCurrentTile(touri+1);
	}
}

function prevTile(){
	if(touri > 0){
		setCurrentTile(touri-1);
	}
}

function shiftTile(dx,dy){
	var s = tour_scenes[touri];
	s.overhead.x+=dx;
	s.overhead.y+=dy;
	
	drawOverhead({x:s.overhead.x-200,y:s.overhead.y-200,width:400,height:400});
}
function shiftOverhead(dx,dy){
	panzoom.panX+=dx;
	panzoom.panY+=dy;
	drawOverhead();
}
function zoomOverhead(delta){
	panzoom.scale+=delta;
	if(panzoom.scale <=0){
		panzoom.scale = 0.1;
	}
	drawOverhead();
}

function overheadClick(e){
	var x = (e.clientX-panzoom.panX) / panzoom.scale;
	var y = (e.clientY-panzoom.panY) / panzoom.scale;
	if(e.altKey){
		selectClosest(x,y);
	}
	else {
		setTilePosition(x,y);
	}
}

function selectClosest(x,y){
	var closesti = touri;
	var closest_dist = 10000;
	for(var i=0;i < tour_scenes.length;i++){
		var s = tour_scenes[i];
		if(s.overhead){
			var dx = s.overhead.x - x;
			var dy = s.overhead.y - y;
			var distance = Math.sqrt((dx*dx) + (dy*dy));
			if(distance < closest_dist){
				closest_dist = distance;
				closesti = i;
			}
		}
	}
	setCurrentTile(closesti);
}

function setTilePosition(x,y){
	var s = tour_scenes[touri];
	s.overhead = {x:x,y:y};
	drawOverhead();
}

function relativeAlign(e){
	var os = $('#otherTile').offset();
	
	var rx = (e.pageX-os.left)-150;
	var ry = (e.pageY-os.top)-150;
	console.debug("rxy "+rx+" "+ry);
	rx = (rx/3)*5;
	ry = (ry/3)*5;
	console.debug("rxy "+rx+" "+ry);
	var other = tour_scenes[touri-1];
	var current = tour_scenes[touri];
	if(other.overhead){
		current.overhead = {x:other.overhead.x + rx, y:other.overhead.y + ry};
	}
	if(touri < tour_scenes.length - 1){
		setCurrentTile(touri+1);
	}
	else {
		drawOverhead();	
	}
}
var last_used = null;

function drawOverheadNew(){
	var ctx=main_canvas.getContext("2d");
	ctx.clearRect(0, 0, main_canvas.width, main_canvas.height);
	var copy = tour_scenes.slice(0);
	copy.sort(function(a, b) {
		if(a.overhead){
			if(b.overhead){
				return a.overhead.stack - b.overhead.stack;
			}
			else {
				return 1;
			}
		}
		else if(b.overhead){
			return -1;
		}
		else {
			return 0;
		}
	});
	
	ctx.save();
	ctx.translate(panzoom.panX,panzoom.panY);
    ctx.scale(panzoom.scale,panzoom.scale);
    ctx.globalAlpha = 0.4;
	for(var i=0;i<copy.length;i++){
		var scene = copy[i];
		var img = tourManager.get_panorama(scene);
		if(scene.overhead){
			ctx.drawImage(img,0,0,500,500,scene.overhead.x-250,scene.overhead.y-250,500,500);
		}
	}
	ctx.restore();
}
function drawOverhead(fast){
	var bsize=10;
	var ctx=main_canvas.getContext("2d");
	
	var fx,fy,fxe,fye;
	if(fast){
		ctx.clearRect(fast.x,fast.y,fast.width,fast.height);
		fx = fast.x-1;
		fy = fast.y-1;
		fxe = fast.x + fast.width;
		fye = fast.y + fast.height;
	}
	else {
		ctx.clearRect(0, 0, main_canvas.width, main_canvas.height);
	}
	ctx.save();
	ctx.translate(panzoom.panX,panzoom.panY);
    ctx.scale(panzoom.scale,panzoom.scale);
    
	var total_block_x = parseInt(main_canvas.width/bsize);
	var total_block_y = parseInt(main_canvas.height/bsize);
	var total_areas =  total_block_x * total_block_y;
	var crop_start = 50;
	var crop_end = 500 - crop_start;
	var used = {};
    for(var key in tour.scenes){
		var scene = tour.scenes[key];
		
		//delete scene.paths;
		//delete scene.coords;
		//delete scene.room_ref;
		//console.debug(scene);
		var img = tourManager.get_panorama(scene);
		
		if(scene.overhead){
			//scene.overhead.x-=500;
			//scene.overhead.y-=500;
			if(scene==tour_scenes[touri]){
				//continue;
			}
			var startx = scene.overhead.x-250;
			var starty = scene.overhead.y-250;
			
			for(var i=crop_start; i < crop_end; i+=bsize){
				var curx = i + startx;
				if(fast){
					if(curx < fx || curx > fxe ){
						continue;
					}
				}
				var blockx = parseInt(curx/bsize);
				var dx = Math.abs(scene.overhead.x - curx);
				for(var j=crop_start; j < crop_end; j+=bsize){
					var cury = j + starty;
					if(fast){
						if(cury < fy || cury > fye ){
							continue;
						}
					}

					var blocky = parseInt(cury/bsize);
					var bkey = blockx+","+blocky;
					//console.debug(bkey);
					var dy = Math.abs(scene.overhead.y - cury);
					var distance = Math.sqrt(dx*dx + dy*dy);
					//console.debug("distance "+distance+" "+blocki);
					var bval = used[bkey];
					if(bval==null){
						bval = 1000000;
					}
					if(bval > distance){
						used[bkey] = distance;
						ctx.drawImage(img,i,j,bsize,bsize,curx,cury,bsize,bsize);						
					}
					else {
						//console.debug("Skipping");
					}
					//console.debug("Dasfdasdf"+i+" "+j+" "+(x+i)+" "+(y+j));
					
					//ctx.drawImage(img,x,y);
				}
			}
		}
	}
    if(tour_scenes[touri].overhead){
    	var scene = tour_scenes[touri];
		ctx.globalAlpha = 0.7;
    	ctx.beginPath();
    	ctx.arc(scene.overhead.x, scene.overhead.y, 20, 0, 2 * Math.PI, false);
    	ctx.fillStyle = 'red';
    	ctx.fill();
    	ctx.lineWidth = 5;
    	ctx.strokeStyle = '#003300';
    	ctx.stroke();		
    	ctx.globalAlpha = 1.0;
    }
    ctx.restore();
    console.debug("All done");
    last_used = used;
}