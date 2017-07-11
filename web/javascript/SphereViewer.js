/*
 * Copyright Walkabout Worlds, LLC 2015-2016
 */

Object.keys(THREE.ShaderLib).forEach(function (key) {
	THREE.ShaderLib[key].fragmentShader =
		THREE.ShaderLib[key].fragmentShader.replace('#extension GL_EXT_frag_depth : enable', '');
});
function webglAvailable() {
	try {
		var canvas = document.createElement("canvas");
		return !!
		window.WebGLRenderingContext && 
		(canvas.getContext("webgl") || 
				canvas.getContext("experimental-webgl"));
	} catch(e) { 
		return false;
	} 
}
function SphereViewer(texture_image,params){
	if(!params){
		params = {};
	}
	this.frames = 0;
	this.renderOK = true;
	var fullScreen = false;
	var cid = null;
	if(cid==null){
		fullScreen = true;
		cid = 'container';
	}
	//camera, scene, renderer, mesh;
	this.showBall = [];
	this.isUserInteracting = false,
	this.onMouseDownMouseX = 0;
	this.onMouseDownMouseY = 0,
	this.lon = 0;
	this.onMouseDownLon = 0;
	this.lat = -25;
	this.onMouseDownLat = 0;
	this.phi = 0;
	this.theta = 0;
	this.base = {x:0,y:0,z:0};
	this.wasStill = 0;
	this.knodCount = 0;


	this.container = document.getElementById( cid );
	if(fullScreen){
		this.camera = new THREE.PerspectiveCamera( 80, window.innerWidth / window.innerHeight, 1, 2100 );
	}
	else {
		this.camera = new THREE.PerspectiveCamera( 70, this.container.innerWidth / this.container.innerHeight, 1, 2100 );		
	}
	this.camera.target = new THREE.Vector3( 0, 0, 0 );

	this.scene = new THREE.Scene();

	this.geometry = new THREE.SphereGeometry( 500, 60, 40 );
	this.geometry.applyMatrix( new THREE.Matrix4().makeScale( -1, 1, 1 ) );
	var texture;
	if(params.video){
		texture = this.createVideoTexture(texture_image);
	}
	else {
		texture = THREE.ImageUtils.loadTexture(texture_image);
		texture.minFilter = THREE.LinearFilter;		
	}
	
	this.material = new THREE.MeshBasicMaterial( {
		map: texture
	} );
	this.material.transparent = true;
	this.material.opacity = 1.0;
	this.mesh = new THREE.Mesh( this.geometry, this.material );
	this.mesh.minFilter = THREE.LinearFilter;

	if(params && params.cardboard){
		this.vr = true;
		this.hud = this.createHudSphere();
		this.scene.add(this.hud);
	}

	this.scene.add( this.mesh );


	//this.renderer = webglAvailable() ? new THREE.WebGLRenderer() : new THREE.CanvasRenderer();
	//this.renderer = new THREE.WebGLRenderer({preserveDrawingBuffer   : true} );
	this.renderer = new THREE.WebGLRenderer();
	this.renderer.sortObjects = false;
	this.renderer.setPixelRatio( window.devicePixelRatio );
	this.renderer.setClearColor( 0xffffff );
	if(fullScreen){
		this.renderer.setSize( window.innerWidth, window.innerHeight );
	}
	else {

		this.renderer.setSize( this.container.innerWidth, this.container.innerHeight );		
	}
	this.container.appendChild( this.renderer.domElement );
	var ref = this;
	this.clock = new THREE.Clock();
	if( params.cardboard){
		this.effect = new THREE.StereoEffect(this.renderer);
		this.effect.setSize( window.innerWidth, window.innerHeight );
		this.dostare = true;
	}
	else {
		this.effect = this.renderer;
	}
	this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
	this.controls.target.set(
			this.camera.position.x + 0.15,
			this.camera.position.y,
			this.camera.position.z
	);
	this.controls.noPan = false;
	this.controls.noZoom = true;
	if(!params.desktop){
		this.setOrientChecker = function(e){setOrientationControls(e,ref);};
		window.addEventListener('deviceorientation', this.setOrientChecker, true);
	}
	this.dorepeat = false;
	this.repeater = function(){
		if(ref.dorepeat){
			if(ref.onclick){
				ref.onclick();
			}
		}
	};
	//else {
	//if((!this.vr) && (!this.compass)){
		this.container.addEventListener( 'mousedown', function(event){ref.onmousedown(event); return true;}, false );
		this.container.addEventListener( 'mousemove', function(event){ref.onmousemove(event);}, false );
		this.container.addEventListener( 'mouseup', function(event){ref.onmouseup(event);}, false );
		this.container.addEventListener( 'mouseout', function(event){ref.onmouseup(event);}, false );

		this.container.addEventListener( 'touchstart', function(event){ref.onmousedown(event);}, false );
		this.container.addEventListener( 'touchmove', function(event){ref.onmousemove(event);}, false );
		this.container.addEventListener( 'touchend', function(event){ref.onmouseup(event);}, false );
		this.container.addEventListener( 'touchcancel', function(event){ref.onmouseup(event);}, false );

		this.container.addEventListener( 'blur', function(event){ref.onmouseup(event);}, false );
		this.container.addEventListener( 'mousewheel', function(event){ref.onmousewheel(event);}, false );
		this.container.addEventListener( 'DOMMouseScroll', function(event){ref.onmousewheel(event);}, false);
	//}

}

SphereViewer.prototype.createVideoTexture = function(src){
	video = document.createElement( 'video' );
	video.width = 512;
	video.height = 256;
	video.autoplay = true;
	video.loop = true;
	video.playbackSpeed = 1.0;
	//video.ontimeupdate = ontimeupdate;
	//video.onseeked = clearLoading;
	//video.onseeking = warning;
	video.src = src;
	//video.src = "https://drive.google.com/uc?id=0B5irEGG7nteCd05qTU5KbzM1RzA&export=download";
	//video.setAttribute('crossorigin', 'anonymous');
	video.load();
	//video.src = "tours/DipperFallsFoo.mp4";
	this.video = video;
	var texture = new THREE.VideoTexture( video );
	texture.minFilter = THREE.LinearFilter;
	return texture;
};

SphereViewer.doXYZ = function(camera,x,y,z){
	
	var fullWidth = window.innerWidth;
	var fullHeight = window.innerHeight;
	
	var ppp = fullHeight/100.0;
	
	var adjacent = fullHeight/2;
	var rads = (camera.fov/2) * (Math.PI/180);
	var distance = Math.abs(adjacent/Math.tan(rads));

	var ratio = adjacent/distance;
	var ndist = distance+(z*ppp);
	var nadj = ndist*ratio;
	var height = nadj*2;
	
	var ratio2 = fullWidth/fullHeight;
	var width = ratio2 * height;
	
	
	var xp = ppp * x;
	var yp = ppp * y;
	//console.debug(xp+" "+yp+" "+width+" "+height+" "+fullWidth+" "+fullHeight);
	
	var osTop = (fullHeight/2)-(height/2)+yp;
	var osLeft = (fullWidth/2)-(width/2)+xp;
	//console.debug(distance+" "+xp+" "+yp+" "+width+" "+height+" "+fullWidth+" "+fullHeight);
	camera.setViewOffset( fullWidth, fullHeight, osLeft,osTop,width,height );
}

SphereViewer.doXYZVR = function(camera,mainCamera,x,y,z,left,right,bottom,top){
	/*
	 * 
	 * 		_cameraL.projectionMatrix.makeFrustum(
			-_outer,
			_inner,
			_bottom,
			_top,
			camera.near,
			camera.far
		);

	 */
	z = -z;
	var fullWidth = right - left;
	var fullHeight = bottom - top;
	
	var ppp = fullHeight/100.0;
	
	var adjacent = fullHeight/2;
	var rads = (camera.fov/2) * (Math.PI/180);
	var distance = Math.abs(adjacent/Math.tan(rads));

	var ratio = adjacent/distance;
	var ndist = distance+(z*ppp);
	var nadj = ndist*ratio;
	var height = nadj*2;
	
	var ratio2 = fullWidth/fullHeight;
	var width = ratio2 * height;
	
	
	var xp = ppp * x;
	var yp = ppp * y;
	//console.debug(xp+" "+yp+" "+width+" "+height+" "+fullWidth+" "+fullHeight);
	
	var osTop = (fullHeight/2)-(height/2)+yp;
	var osLeft = (fullWidth/2)-(width/2)+xp;
	var nLeft = left+osLeft;
	var nTop = top+osTop;
	var nRight = nLeft+width;
	var nBottom = nTop+height;
	
	camera.projectionMatrix.makeFrustum(
				nLeft,
				nRight,
				nBottom,
				nTop,
				mainCamera.near,
				mainCamera.far
			);

};

SphereViewer.prototype.setXYZ= function(x,y,z){
	if(this.vr){
		this.effect.xyz = [x,y,z];
	}
	else {
		SphereViewer.doXYZ(this.camera, x, y, z);
	}
};

SphereViewer.prototype.createHudSphere = function(){
	var geometery = new THREE.SphereGeometry( 3, 18, 18 );
	//geometery.applyMatrix( new THREE.Matrix4().makeScale( 1, 1, 1 ) );
	var material =  new THREE.MeshBasicMaterial( {
		color: 0xffffff, transparent: true, opacity: 0.5
	} );
	var mesh = new THREE.Mesh( geometery, material );
	mesh.minFilter = THREE.LinearFilter;
	mesh.visible = true;
	return mesh;
};

SphereViewer.prototype.createWalkSphere = function(heading,pitch){
	if(!heading){
		heading = 0;
	}
	if(!pitch){
		pitch = 120.0;
	}
	var geometery = new THREE.SphereGeometry( 6, 18, 18 );
	//geometery.applyMatrix( new THREE.Matrix4().makeScale( 1, 1, 1 ) );
	var material =  new THREE.MeshBasicMaterial( {
		color: 0x33a532, transparent: true, opacity: 0.2
	} );
	var mesh = new THREE.Mesh( geometery, material );
	mesh.minFilter = THREE.LinearFilter;
	var theta = THREE.Math.degToRad(heading);
	var tilt = THREE.Math.degToRad(pitch);//Math.PI/2 + 0.4;
	//console.debug("Tilt "+THREE.Math.radToDeg(tilt));
	var x = 100 * Math.sin(tilt) * Math.cos( theta );
	var y = 100 * Math.cos( tilt );
	var z = 100 * Math.sin( tilt ) * Math.sin( theta );
	mesh.position.set(x,y,z);
	mesh.visible = false;
	return {geometery:geometery,material:material,mesh:mesh,x:x,y:y,z:z,near:0, heading:heading};
};
function setOrientationControls(e,ref) {

	if (!e.alpha) {
		return;
	}
	ref.controls = new THREE.DeviceOrientationControls(ref.camera, true);
	ref.controls.connect();
	ref.controls.update();

	window.removeEventListener('deviceorientation', ref.setOrientChecker, true);
	
	SphereViewer.prototype.getCameraHeading = function(){
		this.lon = ref.controls.heading;
		return this.lon;
	};
	
	SphereViewer.prototype.getCameraTilt = function(){
		ref.controls.tilt;
	};

}
var fsalready = false;

SphereViewer.prototype.getCameraHeading = function(){
	
	this.lon = (3780.0 + (THREE.Math.radToDeg(Math.PI/2 - this.camera.rotation._y ))) % 360.0;
	return this.lon;
};

function quatToEuler (q1) {
    var pitchYawRoll = new THREE.Vector3();
     sqw = q1.w*q1.w;
     sqx = q1.x*q1.x;
     sqy = q1.y*q1.y;
     sqz = q1.z*q1.z;
     unit = sqx + sqy + sqz + sqw; // if normalised is one, otherwise is correction factor
     test = q1.x*q1.y + q1.z*q1.w;
    if (test > 0.499*unit) { // singularity at north pole
        heading = 2 * Math.atan2(q1.x,q1.w);
        attitude = Math.PI/2;
        bank = 0;
        return;
    }
    if (test < -0.499*unit) { // singularity at south pole
        heading = -2 * Math.atan2(q1.x,q1.w);
        attitude = -Math.PI/2;
        bank = 0;
        return;
    }
    else {
        heading = Math.atan2(2*q1.y*q1.w-2*q1.x*q1.z , sqx - sqy - sqz + sqw);
        attitude = Math.asin(2*test/unit);
        bank = Math.atan2(2*q1.x*q1.w-2*q1.y*q1.z , -sqx + sqy - sqz + sqw)
    }
    pitchYawRoll.z = Math.floor(attitude * 1000) / 1000;
    pitchYawRoll.y = heading;
    pitchYawRoll.x = Math.floor(bank * 1000) / 1000;

    return pitchYawRoll;
}  

SphereViewer.prototype.getCameraTilt = function(){
	return ((THREE.Math.radToDeg(Math.PI/2 - myviewer.camera.rotation.x ))) % 360;
};

function fullscreen(ref){
	if(fsalready){
		var rot = ref.camera.rotation;
		var lon = THREE.Math.radToDeg(Math.atan2 ( rot._x, rot._z ));
		return;
	}
	fsalready = true;
	var container = ref.container;
	if (container.requestFullscreen) {
		container.requestFullscreen();
	} else if (container.msRequestFullscreen) {
		container.msRequestFullscreen();
	} else if (container.mozRequestFullScreen) {
		container.mozRequestFullScreen();
	} else if (container.webkitRequestFullscreen) {
		container.webkitRequestFullscreen();
	}
}

SphereViewer.prototype.resize = function(width,height){
	this.camera.aspect = width / height;
	this.camera.updateProjectionMatrix();

	this.renderer.setSize( width, height );

};
function fixEvent(event){
	if(event.originalEvent!=null){
		if(event.originalEvent.touches!=null){
			event.clientX = event.originalEvent.touches[0].pageX;
			event.clientY = event.originalEvent.touches[0].pageY;		
		}
		else if(event.originalEvent.changedTouches!=null){
			event.clientX = event.originalEvent.changedTouches[0].pageX;
			event.clientY = event.originalEvent.changedTouches[0].pageY;		
		}
	}
	else if(event.touches){
		event.clientX = event.touches[0].pageX;
		event.clientY = event.touches[0].pageY;
	}
}
SphereViewer.prototype.onmousedown = function(event){
	fixEvent(event);
	this.autorotate = false;
	event.preventDefault();
	this.mouseHasMoved = false;
	this.mouseStartTime = new Date().getTime();

	this.isUserInteracting = true;

	this.onPointerDownPointerX = event.clientX;
	this.onPointerDownPointerY = event.clientY;

	this.onPointerDownLon = this.getCameraHeading();
	this.onPointerDownLat = this.getCameraTilt();
	return true;
};


function onWindowResize() {
	myviewer.resize(window.innerWidth, window.innerHeight);
	if(myviewer.effect && (myviewer.effect!=myviewer.renderer)){
		myviewer.effect.setSize( window.innerWidth, window.innerHeight );
	}
}


SphereViewer.prototype.onmousemove = function( event ) {
	fixEvent(event);

	if ( this.isUserInteracting === true ) {
		var xdiff = ( this.onPointerDownPointerX - event.clientX );
		var ydiff = ( event.clientY - this.onPointerDownPointerY );
		if(Math.abs(xdiff) > 10 || Math.abs(ydiff) > 10){
			this.mouseHasMoved = true;
		}
		if(this.vr){
			return;
		}
		if(this.tpmode){
			var change = null;
			if(Math.abs(ydiff) > Math.abs(xdiff)){
				if(event.clientX > window.innerWidth/2){
					ydiff = -ydiff;
				}
				change = ydiff;				
			}
			else{
				if(event.clientY > window.innerHeight/2){
					xdiff = -xdiff;
				}
				change = xdiff;
			}
			this.lon += change * 0.1;
			//this.lat = ydiff * 0.1 + this.onPointerDownLat;
			this.lon = (this.lon + 720) % 360; 
		}
		else {
			this.lon = xdiff * 0.15 + this.onPointerDownLon;
			this.lat = ydiff * 0.15 + this.onPointerDownLat;
			this.lon = (this.lon + 720) % 360; 
		}
	}

};

SphereViewer.prototype.onmouseup = function( event ) {
	//fixEvent(event);
	if(event.button==2){
		return false;
	}
	this.isUserInteracting = false;
	if(!this.mouseHasMoved){

		var ctime = new Date().getTime();
		if(this.onclick!=null && ctime - this.mouseStartTime < 500){
			var tlon = this.getCameraHeading();
			var tlat = this.getCameraTilt();
			var dx = Math.abs(this.onPointerDownLon - tlon);
			var dy = Math.abs(this.onPointerDownLat - tlat);
			var dist = Math.sqrt(dx*dx + dy*dy);
			if( dist < 3){
				this.onclick(event);
			}
		}
	}
	this.mouseHasMoved = false;
};

SphereViewer.prototype.onmousewheel = function( event ) {
	var change = 0;
	// WebKit

	if ( event.wheelDeltaY ) {

		change = event.wheelDeltaY * 0.05;

		// Opera / Explorer 9

	} else if ( event.wheelDelta ) {

		change = event.wheelDelta * 0.05;

		// Firefox

	} else if ( event.detail ) {

		change = event.detail * 1.0;

	}
	this.mouseWheelAction(change);
};

SphereViewer.prototype.mouseWheelAction = function(change){
	this.camera.fov -= change;
	if(this.camera.fov > 178){
		this.camera.fov = 178;
	}
	else if(this.camera.fov < 1){
		this.camera.fov = 1;
	}
	this.camera.updateProjectionMatrix();	
};

SphereViewer.prototype.imageLoadRotations = function(){
	if(this.onImageLoadNorth){
		console.debug("Rotation "+this.onImageLoadNorth);
		this.mesh.rotation.y = THREE.Math.degToRad(360 - this.onImageLoadNorth);
	}
	else {
		this.mesh.rotation.y = 0;				
	}
	if(this.onImageLoadAngle!=-1){
		if(this.controls.setHeading){
			this.controls.setHeading(this.onImageLoadAngle);
		}
	}
	this.base.x = 0;
	this.base.z = 0;
	this.base.y = 0;
};

SphereViewer.prototype.setImage = function(path,north,endangle){
	var img = this.mesh.material.map.image;
	this.onImageLoadNorth = north ? north : 0;
	this.onImageLoadAngle = endangle==null ? -1 : endangle;

	if(this.video){
		this.renderOK = false;
		this.video.src = path;
	}
	else if(!(typeof(path)==='string')){
		this.mesh.material.map.image = path;
		this.mesh.material.map.needsUpdate = true;
		this.imageLoadRotations();
		if(!path.complete){
			var ref = this;
			$('#percent_loaded').text("50%");
			$('#loading').css('visibility','visible');
			path.onload = function(){
				$('#loading').css('visibility','hidden');
				ref.mesh.material.map.needsUpdate = true;
			};
		}
		
		//console.debug("Path "+path);
		return;
	}
	else if (!img.onload){
		var ref = this;
		img.onload = function(){
			ref.imageLoadRotations();
		};		
	}
	this.mesh.material.map.image.src = path;
	this.mesh.material.map.needsUpdate = true;
};

SphereViewer.prototype.fps = function(){
	return this.frames/this.clock.elapsedTime;
};
SphereViewer.prototype.update = function() {
	this.frames++;
	if(this.onupdate){
		if(!this.onupdate()){
			this.onupdate = null;
		}
	}
	else if(this.autorotate && this.controls.rotateLeft){
		this.controls.rotateLeft(0.0025);
	}

	var heading = this.getCameraHeading();
	var pitch = this.getCameraTilt();
	this.facing = heading;
	this.gotoBall = null;
	var theta = THREE.Math.degToRad(heading);
	var tilt = THREE.Math.degToRad(pitch);
	var ballx = 100 * Math.sin(tilt) * Math.cos( theta );
	var bally = 100 * Math.cos( tilt );
	var ballz = 100 * Math.sin( tilt ) * Math.sin( theta );
	if(this.hud){
		this.hud.position.set(ballx,bally,ballz);
	}
	if(this.orientUpdate){
		this.orientUpdate(heading,pitch);
	}
	if(this.showBall[Math.round(heading)]){
		this.ballsVisible = true;
		var closestBall = this.ballArray[this.showBall[Math.round(heading)]-1];
		if(closestBall!=this.gotoBall){
			for(var i=0;i<this.ballArray.length;i++){
				this.ballArray[i].mesh.visible = false;
			}
		}
		if(closestBall){
			this.gotoBall = closestBall;

			if(closestBall!=this.lastBall){
				this.lastBall = closestBall;
				this.ballAction = 0;
			}
			var dx = closestBall.x-ballx;
			var dy = closestBall.y-bally;
			var dz = closestBall.z-ballz;
			var edist = Math.sqrt(dx*dx + dy*dy + dz*dz);
			if(edist < 6){
				closestBall.mesh.material.opacity = 1.0;
				if(this.hud && this.onclick){
					var ctime = this.clock.elapsedTime;
					if((!this.hudtime) || ctime - this.hudtime > 1.6){
						this.hudtime = ctime;
						this.onclick();
					}
				}
			}
			else if(edist < 50){
				closestBall.mesh.material.opacity = 0.7;
				this.ballAction = 0;				
			}
			else {
				closestBall.mesh.material.opacity = 0.4;
				this.ballAction = 0;
			}
			//console.debug(closest);
			closestBall.mesh.visible = true;
		}
	}
	else if(this.ballArray && this.ballsVisible){
		this.ballsVisible = false;
		for(var i=0;i<this.ballArray.length;i++){
			this.ballArray[i].mesh.visible = false;
		}
	}
	//this.mesh.position.set( -this.base.x, -this.base.y, -this.base.z );
	this.camera.updateProjectionMatrix();
	this.controls.update(this.clock.getDelta());
	if(this.renderOK){
		this.effect.render( this.scene, this.camera );
	}
	else {
		this.renderOK = this.video.readyState==4;
	}

};
SphereViewer.prototype.stayingStill = function(rot) {
	if(Math.abs(this.lastX - rot.x) < 0.05
			&& Math.abs(this.lastY - rot.y) < 0.05
			&& Math.abs(this.lastZ - rot.z) < 0.05
			){
		return true;
	}
	else {
		this.lastX = rot.x;
		this.lastY = rot.y;
		this.lastZ = rot.z;
		return false;
	}
};
SphereViewer.prototype.screenCapture = function() {
	this.renderer.render( this.scene, this.camera );
	return this.renderer.domElement.toDataURL("image/png");
};
SphereViewer.prototype.copyToCanvas = function(canvas) {
	var ctx = canvas.getContext('2d');
	var srcCanvas = this.renderer.domElement;
	var swidth = srcCanvas.width;
	var sheight = srcCanvas.height;
	var dwidth = canvas.width;
	var dheight = canvas.height;
	console.debug("swh "+swidth+" "+sheight);
	this.renderer.render( this.scene, this.camera );
	ctx.drawImage(this.renderer.domElement, 0, 0, swidth, sheight, 0, 0, dwidth, dheight);
};




