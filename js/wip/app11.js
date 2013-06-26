define([
    "dojo/dom", "dojo/dom-construct", "dojo/on", "dojo/router",
    "dojo/_base/array", "dojo/_base/lang", "dojo/query", 
    "dojo/store/JsonRest", "dojo/topic",
     "js/util11", "js/thumbnail11", "js/markup11",  "js/module"
],
    function (dom, domConstruct,  on, router,
        arrayUtil, lang, query, 
        JsonRest, topic,
        util, thumbnail, markup  ) 
    {
        "use strict";
        var thePicker = {}, thePhoto = {}, theMarkups = {}, theComments = {},  
            decide = function (e) {
            	console.log("decide:",e)
            	router.register("/photo/:id", function(event){
					console.log("Router matched hash : ", event.params.id);
					console.log('In router call back');
//					window.location.href ='showPhoto.html#/photo/'+ event.params.id;
					util.clearMain();
					thumbnail.putPhotoOnSurface(event.params.id);
					util.showMain();
				});

				router.startup();
				
				startup();
            },

            startup = function () {
                // create objects, stores, a couple buttons, then go to createPickPhotoPage
				var subscribeHandle = topic.subscribe("paintMarkupScreen", function (photoId) {
               		console.log("subscribe : paintMarkupScreen fired : app.js");
                //	subscribeHandle.remove(); 
                	markup.createMarkupPage(photoId);	
                });
                
                topic.subscribe("thumbnail", function (photoId) {
//					window.location.href ='showPhoto.html#/photo/'+ photoId;
					router.go("/photo/" + photoId );
                    // currentPhotoId = photoId;
//                     
                    // util.clearMain(); //.then(function(){
//                     
                    // setTimeout(function () {
                        // onEnd: {
                            // //				console.log("Just before putPhotoOnSurface (app)")
                            // thumbnail.putPhotoOnSurface(photoId);
                            // //				console.log("Just after putPhotoOnSurface  (app)" )
// 
                            // util.placeOnMain(backToStartButton);
                         // console.log("Going to publish paintMarkupScreen - initial, from app");
                            // topic.publish("paintMarkupScreen", photoId);
// 
                       // //     paintMarkupScreen(photoId);
                            // util.showMain();
                        // }
                    // }, 1000);
         // //			console.log("in doit subsctibe");
                });
                //	console.log("in bottom of doit");
                
                thumbnail.createPickPhotoPage();
   //             util.showMain();
            };
        return {
            init: function () {
                // proceed directly with startup
                //            parser.parse();
               // startup();
                decide();
                //           console.log("end of init");
                return 0;
            }
        };
    }
);