var currentScene;
var myviewer;
var tour;
var roomMap;
$(document).ready(
	function(){
		tourManager.getTourFromParams(onTourLoad);
	}	
);

function onTourLoad(data){
	tour = data;
	if(tour.startScene){
		currentScene = tour.startScene;
	}
	else {
		for(var key in tour.scenes){
			currentScene = key;
			break;
		}
	}
	myviewer = new SphereViewer( tourManager.get_url(getScene().panorama) );
	if(tour.startLon){
		myviewer.lon = tour.startLon;
	}
	myviewer.onclick = function(){moveForwards(true);};
	myviewer.onholddown = moveForwards;
	window.addEventListener( 'resize', onWindowResize, false );
	animate();
	roomMap = sceneUtil.roomMap(tour);
	var rms = populateRoomSelect("rooms", roomMap);
	rms.change(
			function(event){
				var roomID = $('#rooms').val();
				var sceneList = roomMap[roomID];
				if(sceneList){
					setScene(sceneList[0].sceneid);
				}
			}
	);
	setTimeout(function(){setScene(currentScene);},2000);
}

