App.Services = (function(lng, app, undefined) {

//var enbiciApi = "http://192.168.1.12/";
var enbiciApi = "http://enbici.trifase.net/api/";

var obtStationsStatus = function(id_service,lat, longitude) {
	
	if(!lat || !longitude){
		lat = "";
		longitude = "";
	}

	$$.get(enbiciApi,
		{
			function:'stations',
			id_service:id_service,
			lat:lat,
			lng:longitude
		},
		function(response){
			var stations = response.Stations;
			for (index in stations) {
			    //Check if the type of 'status' field is a 1-> On or 0 -> Off"
			    stations[index].stationStatus = (stations[index].stationStatus == 1) ? 'stationOn.png' : 'stationOff.png';
				stations[index].distance = Math.round(stations[index].distance*100)/100;
			}
			
			App.Data.cacheStationsStatus(response.Stations);
			lng.View.Template.binding('enbici-listView-data', 'stationsListView-tmp', stations);
			lng.View.Scroll.create('enbici-listView');

		}
	);
   
    }

var obtProviders = function() {
	$$.get(enbiciApi,
			{
				'function':'hiringServices'
			},
			function(response){
				//console.error(response);
				var providersList = response;
				for (index in providersList) {
				    //Check if the stations are geolocated if is  1-> On or 0 -> Off"
				    providersList[index].geoLocStations = (providersList[index].geoLocStations == 1) ? 'pushpin' : 'warning';
				}

				App.Data.cacheProviders(providersList);
				App.View.providers(providersList);
			}

		);
   
    }

    return {
		obtStationsStatus:obtStationsStatus,
		obtProviders:obtProviders
        }

})(LUNGO, App);