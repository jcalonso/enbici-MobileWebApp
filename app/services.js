App.Services = (function(lng, app, undefined) {

var enbiciApi = "http://163.117.154.114/";
//var enbiciApi = "http://enbici.trifase.net/api/";

var obtStationsStatus = function(id_service,lat, longitude) {
	
	if(!lat || !longitude){
		lat = "";
		longitude = "";
	}

	$$.get(enbiciApi+'StationsStatus.json',
		{
			'function':'stations',
			id_service:id_service,
			lat:lat,
			lng:longitude
		},
		function(response){
			var stations = response.Stations;
			for (index in stations) {
			    //Check if the type of 'status' field is a 1-> On or 0 -> Off"
			    stations[index].stationStatus = (stations[index].stationStatus == 1) ? 'stationOn.png' : 'stationOff.png';

			    
			    if(stations[index].lat == null){
			    	stations[index].lat = '0';
			    	stations[index].lng = '0';
			    	stations[index].distance = '0';
			    }
			    else{
			    	stations[index].distance = Math.round(stations[index].distance*100)/100
			    }
			}
			
			App.Data.cacheStationsStatus(response.Stations);
			lng.View.Template.binding('enbici-listView-data', 'stationsListView-tmp', stations);
			lng.View.Scroll.create('enbici-listView');

		}
	);
   
    }

var obtProviders = function() {
	LUNGO.Sugar.Geolocation.getPos(function(userPos){
		$$.get(enbiciApi+'Providers.json',
			{
				'function':'hiringServices',
				'lat':userPos.coords.latitude,
				'lng':userPos.coords.longitude,
			},
			function(response){
				//console.error(response);
				var providersList = response;
				for (index in providersList) {
				    //Check if the stations are geolocated if is  1-> On or 0 -> Off"
				    providersList[index].geoLocStations = (providersList[index].geoLocStations == 1) ? 'pushpin' : 'warning';
				    providersList[index].distance = Math.round(providersList[index].distance*100)/100;
				    console.error(providersList[index].distance );
				}

				App.Data.cacheProviders(providersList);
				App.View.providers(providersList);
				lng.Data.Sql.select('preferences',null,function(result){
						if(result.length > 0){
							lng.dom('li#providerID-'+result[0].id_service+' [style]', this).show();
						}
				});
			}

		);

	});
   
    }

    return {
		obtStationsStatus:obtStationsStatus,
		obtProviders:obtProviders
        }

})(LUNGO, App);