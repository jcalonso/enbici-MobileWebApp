/**
 * Geolocation A Google Maps-based geolocation sugar
 *
 * @namespace LUNGO.Sugar
 * @class Geolocation
 *
 * @author Juan Carlos Alonso @l_h2o_l | Gabriel Ferreiro Blazetic <gbril9119@gmail.com> || @garolard
 */

LUNGO.Sugar.Geolocation = (function(lng, undefined) {

	var _container;
	var _latlng;
	var _map;
	var _userPosition = false;
	var _markers = [];
	var _userPositionImg = "lungo.js/sugars/geolocation/bluedot@x2.png";
	var _infoWindow = null;
	var _coords;
	var _defaulPosition = {'coords':{'latitude':40.3294542,'longitude':-3.7705924}};
 
    function closeInfoWindow() {
        _infoWindow.close();
    }
 
    function openInfoWindow(marker, content) {
        _infoWindow.setContent(content);
        _infoWindow.open(_map, marker);
    }

    function listenMarker (marker,content)
	{
	    google.maps.event.addListener(marker, 'click', function() {
	        openInfoWindow(marker, content);
	    });
	}

	var _onSuccess = function(position) {
		_latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
		var opt = {
			zoom: 15,
			center: _latlng,
			disableDefaultUI: true,
			MapTypeId: google.maps.MapTypeId.ROADMAP
		};
		
		_map = new google.maps.Map(_container, opt);
		_infoWindow = new google.maps.InfoWindow();
		
		if(_userPosition) {

			var _image = new google.maps.MarkerImage(_userPositionImg, null, null, null, new google.maps.Size(18,18));

			var marker = new google.maps.Marker({
			position: _latlng,
			map: _map,
			title: 'Aquí estás tu',
			icon:_image
			});
		}

		if(_markers != false){
			
			var latLngList=[];
			for(index in _markers){

				var _image = new google.maps.MarkerImage(_markers[index].icon, null, null, null, new google.maps.Size(30,30));

				var latLng = new google.maps.LatLng(_markers[index].lat,_markers[index].lng);
				latLngList.push(latLng);
				var marker = new google.maps.Marker({
				position: latLng,
				map: _map,
				title: _markers[index].title,
				icon: _image
				});
				listenMarker(marker, _markers[index].title);

			}

			var bounds = new google.maps.LatLngBounds();

			if(_userPosition){
				bounds.extend(_latlng);}
	        for (var i = 0, LtLgLen = latLngList.length; i < LtLgLen; i++) {
	            bounds.extend(latLngList[i]);
	        }
	        _map.fitBounds(bounds);

			var listener = google.maps.event.addListener(_map, "idle", function() { 
			  _map.setZoom( _map.getZoom()- 1); 
			  google.maps.event.removeListener(listener); 
			});

		}
		
	};
	
	var _onError = function(err) {
		if(err.code == 1) {
			console.log("Acceso denegado");
		} else if(err.code == 2) {
			console.log("No se puede conseguir localización");
		}
		console.error("errr"+err);

		//Send default position (spain)
		_onSuccess(_defaulPosition);
	};

	var _userPos = function(position){
		_userPosition = position.coords;
	};
	
	var setMap = function(container, userPosition, markers) {
		if(userPosition){_userPosition = true;}
		if(markers){_markers = markers;}
		_container = document.getElementById(container);
		navigator.geolocation.getCurrentPosition(_onSuccess, _onError);
	};

	var getPos = function(callback){
		navigator.geolocation.getCurrentPosition(function(userPos){
			callback(userPos);
		}, function(posErr){
			callback(posErr);
		});
	};
	
	return {
		setMap: setMap,
		getPos: getPos
	}

})(LUNGO);
