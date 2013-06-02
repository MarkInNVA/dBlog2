define(["js/thumbnail", "js/util", "dojo/topic", "dojo/dom", "dojo/dom-construct", "dojo/on"], 
    function( thumbnail, util, topic, dom, domConstruct, on) {
		"use strict";
		var backToStartButton = domConstruct.create("button", {id: "back2Start", innerHTML:"Select Photo"});
		     
		  //  on(backToStartButton,"click",createPickPhotoPage);

		var handleBackToStart = on(backToStartButton, "click", function(evt){
			    // Remove this event using the handle
	//	    handleBackToStart.remove();
			util.clearFooter();
			util.clearMain();
			setTimeout(function(){
				onEnd: {
					thumbnail.createPickPhotoPage();	
					util.showMain();
					util.showFooter();
				}
    			console.log("putPhotoOnSurface");
			}, 1000);			    // Do other stuff here that you only want to happen one time
//		    createPickPhotoPage();
		});
		
		var doit = function() {
		 	util.hideMain();
//		 	util.clearMain();
		 	
			topic.subscribe("thumbnail", function(photoId){
			//	alert(text);
				util.clearFooter();
				util.clearMain();//.then(function(){
				setTimeout(function(){
					onEnd: {
						thumbnail.putPhotoOnSurface(photoId); 
						util.placeOnFooter(backToStartButton);
						util.showMain();
						util.showFooter();
					}
	    			console.log("putPhotoOnSurface");
    			}, 1000);	
									
			//	})
			//	util.showMain();
				console.log("hi");
			})
			
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
	 