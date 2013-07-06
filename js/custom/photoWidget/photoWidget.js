define(["dojo/_base/declare","dijit/_WidgetBase", "dijit/_TemplatedMixin", "dojo/text!./templates/photoWidget.html", 
		"dojo/topic", "dojo/dom", "dojox/gfx", "dojo/store/JsonRest", "dojo/_base/array"
		],
    function(declare, WidgetBase, TemplatedMixin, 
    		 template, topic, dom, gfx, JsonRest, arrayUtil
    		) {
        return declare([WidgetBase, TemplatedMixin], {
        	name: "No Name",

            templateString: template,
 
            baseClass: "photoWidget",
 
   			postCreate: function(){
   				
				var surfaceHandle = topic.subscribe("haveSurface", function( data, surface )  {
                	var image = surface.createImage({ x: 0, y: 0, width: ( data.fx / 2), height: ( data.fy / 2), src: "img/" + data.fname });
                	paintMarkUps( data, surface );
                	surfaceHandle.remove();
                });

				this.inherited(arguments);   // Run any parent postCreate processes - can be done at any point
				
      	        // fw = (this.theData.fx / 2) + 10;
	            // fh = (this.theData.fy / 2) + 25;
	            
	            createSurface(this.theData, this.domNode);                  
	            
			}
        });
		function createSurface(data, node) {
				var surface = gfx.createSurface(node, ( (data.fx /2) + 10 ) , ( (data.fy /2) + 25 ) );

	            surface.whenLoaded(function () {
	                topic.publish( "haveSurface", data, surface );
	            });
    	};        
    	function paintMarkUps(data, surface) {
    		var thisSurface, markupStore = new JsonRest({ target: "api/index.php/markup" });
            thisSurface = surface;    
            markupStore.query("/search/" + data.id).then(function (markups) {
                if (markups.length === 0) {
             //       domConstruct.place('<li class="markupItem">None</li>', muList);
                    			console.log("no markups"); 
                } else {
                    			console.log("have " + markups.length + " markups;");
                    arrayUtil.forEach(markups, function (oneResult) { 
                        surface.createCircle({ cx: oneResult.x, cy: oneResult.y, r: oneResult.size }).setStroke({style: "Dash", width:3, cap:"butt", color:oneResult.color});
                 //       console.log(oneResult);
               //         myMuItem = '<li class="markupItem" id="' + oneResult.id + '" style= "color: ' + oneResult.color + ';"> ' + oneResult.label + '</li> ';
               //         domConstruct.place(myMuItem, muList);
                    }, paintMarkUps);
              //      query(".markupItem").on("click", markUpClick);
                }
            });    		
    		
    	};        

});

