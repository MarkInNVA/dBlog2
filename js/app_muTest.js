define([
    "dojo/dom", "dojo/dom-construct", "dojo/dom-attr", "dojo/on", // "dojo/router",
    "dojo/_base/array", "dojo/_base/lang", "dojo/query", 
    "dojo/store/JsonRest", "dojo/topic", "dojo/_base/fx", "dojox/gfx",
    "dgrid/OnDemandGrid", "dgrid/Selection", "dojo/_base/declare"
//    "custom/photoWidget/photoWidget"
],
    function (dom, domConstruct, domAttr, on, // router,
        arrayUtil, lang, query, 
        JsonRest, topic, baseFx, gfx,
        DataGrid, Selection, declare
   //     PhotoWidget
    ){
        "use strict";
        var showDialog, hideDialog, 
        
        startUp = function () {
    	
            var d, photo,  divGrid, divPhoto, divText, id,
            markupStore = new JsonRest({ target: "api/index.php/markup" }); 

        	d = domConstruct.create("div", { id: "mainGrid" });
        	domConstruct.place(d, "main");

          	divGrid  = domConstruct.create("div", { id: "gridContainer" });
        	divPhoto = domConstruct.create("div", { id: "gridNode" });       	
        	domConstruct.place(divPhoto, dom.byId("mainGrid"));
			
            id = 1;			
// ----------------
           markupStore.query("/search/" + id);

   				var _grid; 
// 
                _grid = new(declare([DataGrid, Selection]))({
                    store: markupStore, // a Dojo object store - css stuff for column widths, etc
                    columns: [
                    	{ label: "Label",       field: 'label',       sortable: false }, 
                    	{ label: "Color",       field: "color",       sortable: false } 
                    ],
                    "class": "sage",
                    selectionMode: "single" }, divPhoto);
// 
                _grid.on("dgrid-select", function (event) {
                	console.log(event)
                });
  					// topic.publish("havePhoto", event.rows[0].data);
  					
fade("In", "photoContainer" )
                			
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