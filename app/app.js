var App = (function(lng, undefined) {

    //Define your LungoJS Application Instance
    
    lng.App.init({
        name: 'enbici',
        version: '1.0 (0315)',
        language : navigator.language
    });

    lng.Sugar.Language.create('es',es);
	lng.Sugar.Language.create('en',en);

	//var lang = lng.App.get('language').split("-");
	lng.Sugar.Language.get('es');
    

    return {

    };

})(LUNGO);