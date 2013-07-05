define(["dojo/_base/declare","dijit/_WidgetBase", "dijit/_TemplatedMixin", 
		"dojo/text!./templates/photoWidget.html", "dojo/topic", "dojo/dom", "dojox/gfx",
		],
    function(declare, WidgetBase, TemplatedMixin, 
    		 template, topic, dom, gfx
    		) {
        return declare([WidgetBase, TemplatedMixin], {
        	name: "No Name",

            templateString: template,
 
            baseClass: "photoWidget",
 
   			postCreate: function(){
				var fw, fh,
                surfaceHandle = topic.subscribe("haveSurface", function(surface,theData)  {
                	image = surface.createImage({ x: 10, y: 10, width: (theData.fx / 2), height: (theData.fy / 2), src: "img/" + theData.fname });
                	surfaceHandle.remove();
                //	paintMarkUpDiv(photo);
                //	fade('In', "markupGridContainer");
                	// baseFx.fadeIn({ node: dom.byId("markupGridContainer"), duration: 500 }).play();
					
                });
				this.inherited(arguments);   // Run any parent postCreate processes - can be done at any point
				console.log("theData :", this.theData);
      	        fw = (this.theData.fx / 2) + 10;
	            fh = (this.theData.fy / 2) + 25;
	            
	            createSurface(this.theData);                  
			}
        });
		function createSurface(data) {
            var divSurfaceElement = dom.byId("photoNode");
			if (!divSurfaceElement) {
				debugger;
			} else {
	            surface = gfx.createSurface(divSurfaceElement, data.fx, data.fy);
	
	            surface.whenLoaded(function () {
//	                console.log("surface loaded (tn)");
	                topic.publish("haveSurface",surface, data);
	            });
				
			}
    	};        
});

