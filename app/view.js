App.View = (function(lng, app, undefined) {

	lng.View.Template.create(
	        'stationsListView-tmp',
	        '<li id="stationID-{{id_station}}" class="selectable">\
				<div class="onright">{{updated}}</div>\
				<img src="assets/images/{{stationStatus}}" />\
	        	{{stationName}}\
				<small>Bikes: {{availablebikes}} | Slots: {{availableSlots}}</small>\
	        </li>'
	    );
	
	lng.View.Template.create(
	        'providersListView-tmp',
	        '<li id="providerID-{{id_service}}" class="selectable" data-icon="info">\
	        	<p style="display:none" class="icon check onright"></p>\
	        	<span class="icon {{geoLocStations}}"></span>\
	        	{{location}}\
				<small>{{serviceName}}</small>\
	        </li>'
	    );
 

	var providers = function(providers) {
		lng.View.Template.List.create({
        container_id: 'enbici-providersView',
        template_id: 'providersListView-tmp',
        data: providers
        });
	};
	
    var stationDetail = function(id_station) {
		lng.Data.Sql.select('stationsStatus',{id_station:id_station},function(result){
            if (result.length > 0) {
                var data = result[0];

                lng.dom('#stationName').html(data.stationName);
                lng.dom('#availablebikes').html(data.availablebikes);
                lng.dom('#availableSlots').html(data.availableSlots);
                
                //Create the map
                LUNGO.Sugar.Geolocation.setMap('stationDetailMap',true,[{lat:data.lat,lng:data.lng,title:data.stationName}]);     

				lng.Router.section('#stationDetail');
            }
        });
    };	
		return{
			providers:providers,
			stationDetail:stationDetail
    }

})(LUNGO, App);