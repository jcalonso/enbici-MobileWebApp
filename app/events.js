App.Events = (function(lng, app, undefined) {

    LUNGO.dom(document).ready(function(){
            //show(title, description, icon, animate, seconds, callback)
            LUNGO.Sugar.Growl.show('Loading!', 'Loading station status, please wait', 'loading', true, 2, function() {
                //alert('Loaded');
                LUNGO.Sugar.Growl.hide();
            });

            lng.Data.Sql.select('preferences',null,function(result){
				if(result.length > 0){
					App.Services.obtStationsStatus(result[0].id_service);
				}
				else{
					//Show notification
				}
			});
        });

    //Load Stations status
	lng.dom('#btnRefresh').tap(function(event) {
		lng.Data.Sql.select('preferences',null,function(result){
			
			if(result.length > 0){
				App.Services.obtStationsStatus(result[0].id_service);
			}
			else{
				//Show notification
			}

			

		});
        
    });
	
	//Load service providers
	lng.dom('#btnProviders').tap(function(event) {
        //lng.Router.section('enbiciApp');
        lng.Data.Sql.select('providers',null,function(result){

        	if(result.length >0){
        		App.View.providers(result);
        	}
        	else{
        		App.Services.obtProviders();
        	}
        });
        
    });

	//Load listview
	lng.dom("#btnListMapView").tap(function(event){
		lng.dom("#btnShowMapView").show();
		lng.dom("#btnListMapView").hide();

	});

	//Load Map
	lng.dom("#btnShowMapView").tap(function(event){
		
		lng.dom("#btnShowMapView").hide();
		lng.dom("#btnListMapView").show();

		lng.Data.Sql.select('stationsStatus',null,function(result){
			
			var markers = [];
			for(index in result)
			{
				var newMarker = {
					lat:result[index].lat,
					lng:result[index].lng,
					title:result[index].stationName
				};

				markers.push(newMarker);
			}

			
			//console.error(markers);
			LUNGO.Sugar.Geolocation.setMap('enbici-mapView',true,markers);
		});
        
	});

	//Show station details
	lng.dom("article#enbici-listView li").tap(function(event){
		var stationID = lng.dom(this);
		
		var cleanStationID = stationID.attr('id').split("-");
			
		App.View.stationDetail(cleanStationID[1]);
				

	});

	//Show station details from a favorite station
	lng.dom("article#enbici-favourites li").tap(function(event){
		var stationID = lng.dom(this);
		
		var cleanStationID = stationID.attr('id').split("-");
			
		App.View.stationDetail(cleanStationID[1]);
				

	});

	//Provider selected
	lng.dom("article#enbici-providersView li").tap(function(event){
		
		var providerID = lng.dom(this);
		var cleanProviderID = providerID.attr('id').split("-");

		App.Data.saveDefaultProvider([{id_service:cleanProviderID[1]}]);
		lng.dom('p', this).hide();

        $$(this).children('.check').show();


	});

	//Show Stations options
	lng.dom("#btnOptions").tap(function(event){

		var options = [
            {
                name: 'Add to favourites!',
                icon: 'star',
                color: 'yellow',
                callback: function(){
                			var id_station = lng.dom("#stationDetailID").attr("value");
         			     	App.Data.addFavoriteStation(id_station);
         			     	lng.Sugar.Growl.show('Favorite added', 'Favorite added', 'check', true, 1);

		       		 	}
            },
            {
                name: 'Cancel',
                icon: 'close',
                color: 'red',
                callback: function() {
                    lng.Sugar.Growl.hide();
                }
            }
        ];
        lng.Sugar.Growl.option('Options', options);
	});

	//Show user favorites
	lng.dom('#btnShowFavs').tap(function(event){
		App.View.favorites();

	});

    

	return {

    }

})(LUNGO, App);