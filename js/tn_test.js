define(["js/thumbnail", "js/util", "dojo/topic", "dojo/dom", "dojo/dom-construct", "dojo/on"], 
    function( thumbnail, util, topic, dom, domConstruct, on) {
		"use strict";

		var backToStartButton = domConstruct.create("button", {id: "back2Start", innerHTML:"Select Photo"});


		var handleBackToStart = on(backToStartButton, "click", function(evt){
//			util.clearFooter();
			util.clearMain();
			setTimeout(function(){
				onEnd: {
					thumbnail.createPickPhotoPage();	
					util.showMain();
					util.showFooter();
				}
    			console.log("in back to start on timeout");
			}, 1000);			    // Do other stuff here that you only want to happen one time
		});
		
		var doit = function() {
//		 	util.hideMain();
//		 	util.clearMain();
		 	
			topic.subscribe("thumbnail", function(photoId){
			//	alert(text);
//				util.clearFooter();
				util.clearMain();//.then(function(){
				setTimeout(function(){
					onEnd: {
						thumbnail.putPhotoOnSurface(photoId); 
						util.placeOnFooter(backToStartButton);
						util.showMain();
//						util.showFooter();
					}
	    			console.log("in thumbnail subscribe timeout");
    			}, 1000);	
									
			//	})
			//	util.showMain();
				console.log("in doit subsctibe");
			})
			console.log("in bottom of doit");
			thumbnail.createPickPhotoPage();	
			util.showMain();
		};
				
	    return {
        init: function() {
            	doit() ;
        	}
    	};
	}
	
	
);
	 