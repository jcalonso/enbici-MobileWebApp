App.Data = (function(lng, app, undefined) {

    lng.Data.Sql.init({
    	name: 'enbici-cache',
    	version:'1.0',
    	schema:[{
    		name:'providers',
    		drop:true,
    		fields:{
    			geoLocStations: "INT",
				id_service: "INT",
				lat: "STRING",
				lng: "STRING",
				location: "STRING",
				serviceName: "STRING"
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
				updated: "STRING"
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
                stationName: "STRING",
                stationStatus: "STRING",
                updated: "STRING",
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

    return {
    	cacheProviders:cacheProviders,
    	cacheStationsStatus:cacheStationsStatus,
        saveDefaultProvider:saveDefaultProvider
    }

})(LUNGO, App);