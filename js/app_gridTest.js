define([
    "dojo/dom", "dojo/dom-construct", "dojo/dom-attr", "dojo/on", 
    "dojo/_base/array", "dojo/_base/lang", "dojo/query", 
    "dgrid/OnDemandGrid", "dgrid/Selection", "dojo/_base/declare",
    "dojo/store/JsonRest", "dojo/topic", "dojo/fx/Toggler", "dojo/_base/fx",
      "custom/gridWidget/gridWidget",       "custom/photoWidget/photoWidget"

],
    function (dom, domConstruct, domAttr, on, 
        arrayUtil, lang, query, 
        DataGrid, Selection, declare,
        JsonRest, topic, Toggler, baseFx,
         GridWidget, PhotoWidget  ) 
    {
        "use strict";
        var  thumbnailStore, photoHandle,
        
            startUp = function () {
           // 	console.log("Startup (app)");
            	           	
            var grid, d, photo, togGrid, togPhoto, togmainGrid, divGrid, divPhoto; //, onH, backButton = domConstruct.create("button", {id: "backButton", innerHTML:"To Main"});

       		thumbnailStore = new JsonRest({ target: "api/index.php/photos" });

        	d = domConstruct.create("div", { id: "mainGrid" });
        	domConstruct.place(d, "main");

        	divGrid  = domConstruct.create("div", { id: "gridContainer" });
        	divPhoto = domConstruct.create("div", { id: "photoContainer" });
        	domConstruct.place(divGrid, dom.byId("mainGrid"));
			
            photoHandle = topic.subscribe("havePhoto", function(data)  {
            	fade("Out","gridContainer")
            	setTimeout(function(){
	               	domConstruct.empty(dom.byId("mainGrid"));
	               	domConstruct.place(divPhoto, "mainGrid");
					photo = new PhotoWidget({
						 theData: data
					},"photoContainer"); 	
    	           	fade("In", "photoContainer" )
                	photoHandle.remove();
            		
            	}, 1000);
		//		console.log("from app_gridTest  data :", data);					
            });
            					
			grid = new GridWidget({
				aStore: thumbnailStore
			},"gridContainer"); 	
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