define([
    "dojo/dom", "dojo/dom-construct", "dojo/dom-attr", "dojo/dom-style", "dojo/on", // "dojo/router",
    "dojo/_base/array", "dojo/_base/lang", "dojo/query", 
    "dojo/store/JsonRest", "dojo/topic", "dojo/_base/fx", "dojox/gfx",
     "custom/gridWidget/gridWidget", "custom/photoWidget/photoWidget", "js/util13", "js/module"
],
    function (dom, domConstruct, domAttr, domStyle, on, // router,
        arrayUtil, lang, query, 
        JsonRest, topic, baseFx, gfx,
        GridWidget, PhotoWidget, util  ) 
    {
        "use strict";
        var  thumbnailStore, markupStore, commentStore, surface, // currentPhotoId, myRouter = router,

			preStartUp = function() {
        		thumbnailStore = new JsonRest({ target: "api/index.php/photos" });       		
        		markupStore = new JsonRest({ target: "api/index.php/markup" });       		
        		commentStore = new JsonRest({ target: "api/index.php/comment" });      		
				startUp();
			},
			fade = function(dir,node) {
				if (dir === 'Out') { baseFx.fadeOut({ node: dom.byId(node), duration : 500 }).play(); }
				if (dir === 'In')  { baseFx.fadeIn ({ node: dom.byId(node), duration : 500 }).play(); }
			},
			// point grid at it, wait for row select, which returns the photoId for the next step (putPhotoOnPage)
			// html elements start : main, end 
            startUp = function () {
            	var grid, photo, photoHandle, divGrid, divPhoto, 
            	backButton = domConstruct.create("button", {id: "backButton", innerHTML:"Select New Photo"}),
            	gridButton = domConstruct.create("button", {id: "gridButton", innerHTML:"Grid"}),
            	photoButton = domConstruct.create("button", {id: "photoButton", innerHTML:"Photo"})  	;

            	domConstruct.empty("main");
            	
            	util.placeOnMain(domConstruct.create("div", { id: "mainGrid" }));
            	
	          	divGrid  = domConstruct.create("div", { id: "gridContainer" });
	        	divPhoto = domConstruct.create("div", { id: "photoContainer" });          	
	        	
        		domConstruct.place(divGrid, dom.byId("mainGrid"));
        		domConstruct.place(divPhoto, dom.byId("mainGrid"));
        		
 				domConstruct.place(gridButton, dom.byId("gridContainer"));
 				domConstruct.place(photoButton, dom.byId("photoContainer"));
 				
                on(gridButton, "click", function(e) {
                	console.log("gridButton pressed");
				    domStyle.set("photoContainer", {
				    	backgroundColor:"green",
				      color:"green",
				      zIndex:99});
				    domStyle.set("gridContainer", {
				    	backgroundColor:"blue",
				      color:"red",
				      zIndex:-99 });                	
                });
                on(photoButton, "click", function(e) {
                	console.log("photoButton pressed");
				    domStyle.set("photoContainer", {
				      color:"green",
				      zIndex:-99});
				    domStyle.set("gridContainer", {
				      color:"red",
				      zIndex:99 });                	
                });
 				
                // on(backButton, "click", function(e) {
                	// fade('Out', "photoContainer");
                	// topic.publish("refreshGrid");
                	// setTimeout(function () {
	                	// photo.destroy();
	                	// fade( 'In', "gridContainer");
					// }, 700);
				// });
                // photoHandle = topic.subscribe("havePhoto", function(data)  {
					           // // 	domConstruct.empty(dom.byId("mainGrid"));
					// fade( 'Out', "gridContainer" );
					// setTimeout(function () {
		     // //          	domConstruct.empty(dom.byId("mainGrid"));
		               	// domConstruct.place(divPhoto, "mainGrid");
						// photo = new PhotoWidget({
							 // theData: data
						// },"photoContainer"); 
						// domConstruct.place(backButton,dom.byId("photoContainer"))	
		                // //util.placeOnMain(backButton);
	    	           //	 fade("In", "photoContainer" )
	             // //   	photoHandle.remove();
            		// }, 700);
			// //		console.log("bottom of subscribe()  photo");					
                // });      		
// 
				// grid = new GridWidget({	},"gridContainer"); 	
             
             //   fade( 'In', "gridContainer");
            },                       	
   	         myFormatter = function (value) {
	            return '<img class="dgimg" src = img/' + value + '>';
    	    };
           
        return {
            init: function () {
                preStartUp();
                return 0;
            }
        };
    }
);