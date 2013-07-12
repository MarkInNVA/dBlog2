define([
    "dojo/dom", "dojo/dom-construct", "dojo/dom-attr", "dojo/on", // "dojo/router",
    "dojo/_base/array", "dojo/_base/lang", "dojo/query", 
    "dojo/store/JsonRest", "dojo/topic", "dojo/_base/fx", "dojox/gfx",
    "custom/photoWidget/photoWidget"
],
    function (dom, domConstruct, domAttr, on, // router,
        arrayUtil, lang, query, 
        JsonRest, topic, baseFx, gfx,
        PhotoWidget
    ){
        "use strict";
        var showDialog, hideDialog, startUp = function () {
           // 	console.log("Startup (app)");
;    	
            var d, photo,  divGrid, divPhoto, divText, id, 
                thumbnailStore = new JsonRest({ target: "api/index.php/photos" });

        	d = domConstruct.create("div", { id: "mainGrid" });
        	domConstruct.place(d, "main");

          	divGrid  = domConstruct.create("div", { id: "gridContainer" });
        	divPhoto = domConstruct.create("div", { id: "photoContainer" });         	
      //  	divText  = domConstruct.create("div", { id: "photoText" });
        	
        	domConstruct.place(divPhoto, dom.byId("mainGrid"));
        //	domConstruct.place(divText, dom.byId("mainGrid"));
			
            id = 4;
            
            thumbnailStore.query("/" + id).then(function (data) {					
				photo = new PhotoWidget({ theData: data},"photoContainer");
           		fade("In", "photoContainer" )
			}); 
		},
		fade = function(dir,node) {
			if (dir === 'Out') { baseFx.fadeOut({ node: dom.byId(node), duration : 800 }).play(); }
			if (dir === 'In')  { baseFx.fadeIn ({ node: dom.byId(node), duration : 800 }).play(); }
		};        
        		
		    	    	
           
        return {
            init: function () {
                startUp();
                return 0;
            }
        };
    }
);