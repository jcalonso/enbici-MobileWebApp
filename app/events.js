App.Events = (function(lng, app, undefined) {

    LUNGO.dom(document).ready(function(){
            //show(title, description, icon, animate, seconds, callback)
            LUNGO.Sugar.Growl.show('Loading!', 'Loading station status, please wait', 'loading', true, 2, function() {
                //alert('Loaded');
                LUNGO.Sugar.Growl.hide();
            });

            lng.Data.Sql.select('preferences',null,function(result){
				if(result.length > 0){
					LUNGO.Sugar.Geolocation.getPos(function(userPos){

						App.Services.obtStationsStatus(result[0].id_service,userPos.coords.latitude,userPos.coords.longitude);
					});
					
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
				LUNGO.Sugar.Geolocation.getPos(function(userPos){

						App.Services.obtStationsStatus(result[0].id_service,userPos.coords.latitude,userPos.coords.longitude);
					});
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
				var iconImg;

				if(result[index].availablebikes == 0){
					iconImg = "assets/images/enbiciPinRed.png";
				}
				else if(result[index].availablebikes > 0 && result[index].availablebikes < 3){
					iconImg = "assets/images/enbiciPinYellow.png";
				}
				else{
					iconImg = "assets/images/enbiciPin.png";
				}

				var newMarker = {
					lat:result[index].lat,
					lng:result[index].lng,
					title:'<div class="infoWindow"><span class="onright bubble blue">'+result[index].distance+' kms</span><p class="title"><span class="icon info"></span><span>'+result[index].stationName+'</span></p><p class="infoWindowsStationData"><small> <span class="icon upload mini"></span> Bikes: '+result[index].availablebikes+' | <span class="icon download mini cellSubtitle"></span> Slots: '+result[index].availableSlots+'</small></p><p class="infoWindowLink lightgreen"><a href="#" onclick="App.View.stationDetail('+result[index].id_station+');"></span>Station details <span class="icon right"></a></p></div>',
					icon:iconImg
				};
				markers.push(newMarker);
			}

			
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