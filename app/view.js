App.View = (function(lng, app, undefined) {

	lng.View.Template.create(
	        'stationsListView-tmp',
	        '<li id="stationID-{{id_station}}" class="selectable">\
				<span class="onright bubble blue">{{distance}} kms</span>\
				<img src="assets/images/{{stationStatus}}" />\
	        	{{stationName}}\
				<small><span class="icon upload mini"></span> Bikes: {{availablebikes}} | <span class="icon download mini cellSubtitle"></span> Slots: {{availableSlots}}</small>\
	        </li>'
	    );
	
	lng.View.Template.create(
	        'providersListView-tmp',
	        '<li id="providerID-{{id_service}}" class="selectable" data-icon="info">\
	        	<span class="onright bubble blue">{{distance}} kms</span>\
	        	<p style="display:none" class="icon check onright"></p>\
	        	<span class="icon {{geoLocStations}}"></span>\
	        	{{location}}\
				<small>{{serviceName}}</small>\
	        </li>'
	    );

	lng.View.Template.create(
			'favoritesList-tmp',
			'<li id="favStationID-{{id_station}}" class="selectable" data-icon="info">\
	        	<div class="onright">{{updated}}</div>\
	        	{{stationName}}\
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

                lng.dom('#stationDetailID').attr("value",data.id_station);
                lng.dom('#stationName').html(data.stationName);
                lng.dom('#availablebikes').html(data.availablebikes);
                lng.dom('#availableSlots').html(data.availableSlots);
                lng.dom('#stationDistance').html(data.distance+" kms");
                
                var iconImg;

				if(data.availablebikes == 0){
					iconImg = "assets/images/enbiciPinRed.png";
				}
				else if(data.availablebikes > 0 && data.availablebikes < 3){
					iconImg = "assets/images/enbiciPinYellow.png";
				}
				else{
					iconImg = "assets/images/enbiciPin.png";
				}

                //Create the map
                LUNGO.Sugar.Geolocation.setMap('stationDetailMap',true,[{lat:data.lat,lng:data.lng,title:data.stationName,icon:iconImg}]);     

				lng.Router.section('#stationDetail');
            }
        });
    };

    var favorites = function(){
    	lng.Data.Sql.select('favorites',null,function(result){
    		if(result.length > 0){
    			lng.View.Template.List.create({
    				container_id: 'enbici-favourites',
    				template_id: 'favoritesList-tmp',
    				data:result
    			});
    		}            
        });
    }	
		return{
			providers:providers,
			stationDetail:stationDetail,
			favorites:favorites
    }

})(LUNGO, App);