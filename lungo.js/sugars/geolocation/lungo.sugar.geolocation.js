/**
 * Geolocation A Google Maps-based geolocation sugar
 *
 * @namespace LUNGO.Sugar
 * @class Geolocation
 *
 * @author Gabriel Ferreiro Blazetic <gbril9119@gmail.com> || @garolard
 */

LUNGO.Sugar.Geolocation = (function(lng, undefined) {

	var _container;
	var _latlng;
	var _map;
	var _userPosition = false;
	var _markers = false;
	var _userPositionImg = "lungo.js/sugars/geolocation/blue_dot.png";
	var _infoWindow = null;
	var _coords;
 
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


			var marker = new google.maps.Marker({
			position: _latlng,
			map: _map,
			title: 'Aquí estás tu',
			icon:_userPositionImg
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
					console.error('dd');
				bounds.extend(_latlng);}
	        for (var i = 0, LtLgLen = latLngList.length; i < LtLgLen; i++) {
	            bounds.extend(latLngList[i]);
	            console.error('dd3');
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
			alert("Acceso denegado");
		} else if(err.code == 2) {
			alert("No se puede conseguir localización");
		}
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
		}, _onError);
	};
	
	return {
		setMap: setMap,
		getPos: getPos
	}

})(LUNGO);
