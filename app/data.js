App.Data = (function(lng, app, undefined) {

    lng.Data.Sql.init({
    	name: 'enbici-cache',
    	version:'1.0',
    	schema:[{
    		name:'providers',
    		drop:false,
    		fields:{
    			geoLocStations: "STRING",
				id_service: "INT",
				lat: "STRING",
				lng: "STRING",
				location: "STRING",
				serviceName: "STRING",
                distance: "STRING",

    		}
    	},
    	{
    		name:'stationsStatus',
    		drop:true,
    		fields:{
    			availableSlots: "INT",
				availablebikes: "INT",
				id_station: "INT",
				lat: "STRING",
				lng: "STRING",
				stationName: "STRING",
				stationStatus: "STRING",
				updated: "STRING",
                distance: "STRING"
    		}
    	},
        {
            name:'favorites',
            drop:false,
            fields:{
                id_station: "INT",
                id_service: "INT",
                lat: "STRING",
                lng: "STRING",
                stationName: "STRING"
            }
        },
        {
            name:'preferences',
            drop:false,
            fields:{
                id_service: "INT"
            }
        }


    	]

    });

    var cacheProviders = function(providers){
    	lng.Data.Sql.insert('providers',providers);	

    };

    var cacheStationsStatus = function(stationsStatus){
    	lng.Data.Sql.insert('stationsStatus',stationsStatus);	

    };

    var saveDefaultProvider = function(id_service){
        lng.Data.Sql.drop('preferences');
        lng.Data.Sql.insert('preferences',id_service);
    };

    var addFavoriteStation = function(id_station){
        //Check if this stattion is already on favs
        lng.Data.Sql.select('favorites',{'id_station':id_station},function(resFavorites){
            if(resFavorites.length == 0){

                lng.Data.Sql.select('preferences', null, function(result) {
                 if(result.length > 0){
                    lng.Data.Sql.select('stationsStatus',{'id_station':id_station},function(result2){

                        var markers = [];
                        for(index in result2)
                        {
                            var newMarker = {
                                id_station:result2[index].id_station,
                                lat:result2[index].lat,
                                lng:result2[index].lng,
                                stationName:result2[index].stationName,
                                id_service:result[0].id_service
                            };

                            markers.push(newMarker);
                        }

                        lng.Data.Sql.insert('favorites',markers);

                    });
                }
               });  
            }      
        });    
    };


    return {
    	cacheProviders:cacheProviders,
    	cacheStationsStatus:cacheStationsStatus,
        saveDefaultProvider:saveDefaultProvider,
        addFavoriteStation: addFavoriteStation
    }

})(LUNGO, App);