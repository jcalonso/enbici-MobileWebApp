var App = (function(lng, undefined) {

    //Define your LungoJS Application Instance
    
    lng.App.init({
        name: 'enbici',
        version: '1.0.1 (0510)',
        language : navigator.language
    });

    lng.Sugar.Language.create('es',es);
	lng.Sugar.Language.create('en',en);

	//var lang = lng.App.get('language').split("-");
	lng.Sugar.Language.get('es');

    //Android PhoneGap
    //Backbutton
    // document.addEventListener("backbutton", backKeyDown, true); 
    //     function backKeyDown() { 
    //          // Call my back key code here.
    //         if(lng.Router.History.current() === '#main')
    //         {
    //             navigator.app.exitApp();
    //         }
    //         else{
    //             lng.Router.back();
    //         }
    //     }

    // //MenuButton
    // document.addEventListener("menubutton", onMenuKeyDown, false);

    // function onMenuKeyDown() {
    //     // Handle the menu buton
    //     lng.Router.section('preferencesView');
    //     App.Services.obtProviders();
    // }
        

    return {

    };

})(LUNGO);