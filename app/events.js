App.Events = (function(lng, app, undefined) {

    LUNGO.dom(document).ready(function(){
        loadStationsStatus();
            
    });//documentReady

    //Show loading, check preferences, show status
    var loadStationsStatus = function(){
    	LUNGO.Sugar.Growl.show('Loading!', 'Loading station status, please wait', 'loading', true, 1, function() {
            lng.Data.Sql.select('preferences',null,function(result){
				if(result.length > 0){
					lng.Data.Sql.select('providers',{id_service:result[0].id_service,geoLocStations:'pushpin'},function(result2){
						if(result2.length > 0){
							//Geolocated stations
							LUNGO.Sugar.Geolocation.getPos(function(userPos){
								lng.dom('#btnShowMapView').show(); //Map view button for the user 
								lng.dom('#stationDetailMap').show();
								App.Services.obtStationsStatus(result[0].id_service,userPos.coords.latitude,userPos.coords.longitude);
								LUNGO.Sugar.Growl.hide();
							});
						}
						else
						{
							//No geolocated
							lng.dom('#btnShowMapView').hide(); //No map view button for the user
							lng.dom('#stationDetailMap').hide();
							App.Services.obtStationsStatus(result[0].id_service,false,false);
							LUNGO.Sugar.Growl.hide();
						}
					});
					
				}
				else{
					//Show notification
					var options = [
			            {
			                name: 'Select provider',
			                color: 'blue',
			                icon:'settings',
			                callback: function(){
			                			App.Services.obtProviders();
			                			LUNGO.Sugar.Growl.hide();
			                			lng.Router.section('preferencesView');
					       		 	}
			            }
		        	];
			       LUNGO.Sugar.Growl.option('Before you start, select your bicycle service provider', options);
				}
			});//Select user preferences 
        });//Growl loading

    };

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
				//This shoulnt happen
				alert('something went wrong :(');
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

    //btn data-back preferences
    lng.dom('section#preferencesView [data-back]').tap(function(event){

    	loadStationsStatus();
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
					iconImg = "assets/images/enbiciPinRed@2x.png";
				}
				else if(result[index].availablebikes > 0 && result[index].availablebikes < 3){
					iconImg = "assets/images/enbiciPinYellow@2x.png";
				}
				else{
					iconImg = "assets/images/enbiciPin@2x.png";
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

	lng.dom("article#enbici-favourites li").swipeLeft(function(event){
			alert('Deleted');
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

	//Share button
	lng.dom('#optShare').tap(function(event){
		var options = [
            {
                name: 'Twitter',
                icon: 'star',
                color: 'twitter',
                callback: function(){
                			//Something
                			window.location.href = "http://twitter.com/intent/tweet?text=enbici te permite obtener la disponibilidad de las estaciones de bicicletas públicas en España más cercanas a tí. http://bit.ly/enbiciApp";

		       		 	}
            },
            {
                name: 'Facebook',
                icon: 'star',
                color: 'facebook',
                callback: function(){
                			//Something
                			window.location.href = "http://m.facebook.com/sharer.php?u=enbici te permite obtener la disponibilidad de las estaciones de bicicletas públicas en España más cercanas a tí. http://bit.ly/enbiciApp";
		       		 	}
            },
            {
                name: 'Email',
                icon: 'mail',
                color: 'default',
                callback: function(){
                			//Something
                			window.location = "mailto:?subject=enbici, disponibilidad de bicicletas publicas de España&body=enbici te permite obtener la disponibilidad de las estaciones de bicicletas públicas en España más cercanas a tí. http://bit.ly/enbiciApp"
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
  

	return {

    }

})(LUNGO, App);