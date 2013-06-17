define([
    "dojo/dom", "dojo/dom-construct", "dojo/on", "dojo/router",
    "dojo/_base/array", "dojo/_base/lang", "dojo/query", 
    "dojo/store/JsonRest", "dojo/topic",
     "js/util10", "js/thumbnail10", "js/markup10",  "js/module"
],
    function (dom, domConstruct,  on, router,
        arrayUtil, lang, query, 
        JsonRest, topic,
        util, thumbnail, markup  ) 
    {
        "use strict";
        var  currentPhotoId, 

            //        thumbnailTemplate = '<div>Name : {Name}\n<img class="thumbnail" id="{id}" src="img/{tname}"/><hr></div>',
            //      markupAreaTemplate = '<div id="markupAreaDiv" >  </div>',
            //     markupListTemplate = '<ul id="markupList" class="mulc"> </ul>',
            //      divMainNode = dom.byId("main"),
            //      surface,
            //        divSurfaceElement,
            
            
            backToStartButton = domConstruct.create("button", { id: "back2Start", innerHTML: "Select Photo" }),

            handleBackToStart = on(backToStartButton, "click", function () {
                util.clearMain();
                setTimeout(function () {
                    onEnd: {
                        thumbnail.createPickPhotoPage();
                        util.showMain();
                    }
                    //	console.log("in back to start on timeout");
                }, 1000);
            }),

            startup_old = function () {
                // create objects, stores, a couple buttons, then go to createPickPhotoPage
				var subscribeHandle = topic.subscribe("paintMarkupScreen", function (photoId) {
               		console.log("subscribe : paintMarkupScreen fired : app.js");
                //	subscribeHandle.remove(); 
                	markup.createMarkupPage(photoId);	
                });
                
                topic.subscribe("thumbnail", function (photoId) {
                    currentPhotoId = photoId;
                    
                    util.clearMain(); //.then(function(){
                    
                    setTimeout(function () {
                        onEnd: {
                            //				console.log("Just before putPhotoOnSurface (app)")
                            thumbnail.putPhotoOnSurface(photoId);
                            //				console.log("Just after putPhotoOnSurface  (app)" )

                            util.placeOnMain(backToStartButton);
                         console.log("Going to publish paintMarkupScreen - initial, from app");
                            topic.publish("paintMarkupScreen", photoId);

                       //     paintMarkupScreen(photoId);
                            util.showMain();
                        }
                    }, 1000);
         //			console.log("in doit subsctibe");
                });
                //	console.log("in bottom of doit");
                
                thumbnail.createPickPhotoPage();
                util.showMain();
            },

            paintMarkupScreen = function (photoID) {
            	markup.createMarkupPage(photoID)
            },
            startup = function () {
            	console.log("Hi");
            	router.register("/photo/:id", function(event){
					
					console.log("Router matched hash :", event.params.id, "\nEvent :",event);
				});

            };



        //  renderItem = function(item, refNode, posn) {
        // summary:
        //      Create HTML string to represent the given item
        //   };
        return {
            init: function () {
                // proceed directly with startup
                //            parser.parse();
                startup();
                
                console.log("end of init");
                return 0;
            }
        };
    }
);