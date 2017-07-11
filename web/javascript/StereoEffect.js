/**
 * @author alteredq / http://alteredqualia.com/
 * @authod mrdoob / http://mrdoob.com/
 * @authod arodic / http://aleksandarrodic.com/
 * @authod fonserbc / http://fonserbc.github.io/
 *
 * Off-axis stereoscopic effect based on http://paulbourke.net/stereographics/stereorender/
 */

THREE.StereoEffect = function ( renderer ) {

	// API

	this.separation = 3;

	/*
	 * Distance to the non-parallax or projection plane
	 */
	this.focalLength = 150;

	// internals

	var _width, _height;

	var _position = new THREE.Vector3();
	var _quaternion = new THREE.Quaternion();
	var _scale = new THREE.Vector3();

	var _cameraL = new THREE.PerspectiveCamera();
	var _cameraR = new THREE.PerspectiveCamera();

	var _fov;
	var _outer, _inner, _top, _bottom;
	var _ndfl, _halfFocalWidth, _halfFocalHeight;
	var _innerFactor, _outerFactor;

	// initialization

	renderer.autoClear = false;

	this.setSize = function ( width, height ) {

		_width = width / 2;
		_height = height;

		renderer.setSize( width, height );

	};

	this.render = function ( scene, camera ) {

		scene.updateMatrixWorld();

		if ( camera.parent === undefined ) camera.updateMatrixWorld();

	
		camera.matrixWorld.decompose( _position, _quaternion, _scale );

		// Stereo frustum calculation

		// Effective fov of the camera
		_fov = THREE.Math.radToDeg( 2 * Math.atan( Math.tan( THREE.Math.degToRad( camera.fov ) * 0.5 ) ) );

		_ndfl = camera.near / this.focalLength;
		_halfFocalHeight = Math.tan( THREE.Math.degToRad( _fov ) * 0.5 ) * this.focalLength;
		_halfFocalWidth = _halfFocalHeight * 0.5 * camera.aspect;

		_top = (_halfFocalHeight * _ndfl) * camera.zoom;
		_bottom = -_top;
		_innerFactor = (( _halfFocalWidth + this.separation / 2.0 ) / ( _halfFocalWidth * 2.0 ));
		_outerFactor = 1.0 - _innerFactor;

		_outer = _halfFocalWidth * 2.0 * _ndfl * _outerFactor;
		_inner = _halfFocalWidth * 2.0 * _ndfl * _innerFactor;

		// left
		if(this.xyz){
			SphereViewer.doXYZVR(_cameraL, camera, this.xyz[0], this.xyz[1], this.xyz[2], -_outer, _inner, _bottom, _top);
			if(this.xyz[0]==0 && this.xyz[1]==0 && this.xyz[2]==0){
				this.xyz = null;
			}
		}
		else {
			_cameraL.projectionMatrix.makeFrustum(
					-_outer,
					_inner,
					_bottom,
					_top,
					camera.near,
					camera.far
			);
		}
		
		_cameraL.position.copy( _position );
		_cameraL.quaternion.copy( _quaternion );
		_cameraL.translateX( - this.separation / 2.0 );

		// right

		if(this.xyz){
			SphereViewer.doXYZVR(_cameraR, camera, this.xyz[0], this.xyz[1], this.xyz[2], -_inner, _outer, _bottom, _top);
		}
		else {
			_cameraR.projectionMatrix.makeFrustum(
					-_inner,
					_outer,
					_bottom,
					_top,
					camera.near,
					camera.far
			);
		}
		

		_cameraR.position.copy( _position );
		_cameraR.quaternion.copy( _quaternion );
		_cameraR.translateX( this.separation / 2.0 );

		//console.debug(_cameraR.fullHeight+" "+_cameraR.fullWidth+" "+_cameraR.x+" "+_cameraR.y+" "+_cameraR.width+" "+_cameraR.height);
		//
		renderer.setViewport( 0, 0, _width * 2, _height );
		renderer.clear();

		renderer.setViewport( 0, 0, _width, _height );
		renderer.render( scene, _cameraL );

		renderer.setViewport( _width, 0, _width, _height );
		renderer.render( scene, _cameraR );

	};

};