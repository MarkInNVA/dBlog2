define(
	[
	"dojo/dom", "dojo/dom-construct", "dojo/dom-attr", 
	"dojo/on", 
	"dojo/_base/fx"
	],
	
	function(dom, domConstruct, domAttr, on, baseFx) {
		var divMainNode = dom.byId("main");
							
		return {
			hideMain : function () {
				domAttr.set("main","opacity",0.0);
			},			
			
			clearMain : function () {  // clear div Main (large center section)
		//		console.log("Clearing main");
				setTimeout(function(){
					onEnd: domConstruct.empty(divMainNode)
    			}, 1000);
					baseFx.fadeOut({ 
						node: dom.byId(divMainNode),
						duration:1000,
					}).play();
			} ,
			
			showMain : function() {
				baseFx.fadeIn({ 
					node: dom.byId(divMainNode),
					duration:1000
				}).play(); 				
			},
			clearFooter : function(){
				baseFx.fadeOut({ 
					node: dom.byId("footer"),
					onEnd: domConstruct.empty("footer")
				}).play();			
			},
			showFooter : function() {
				baseFx.fadeIn({ 
					node: dom.byId("footer")
				}).play(); 			
			},
	
		    placeOnMain : function (item) {  // add item to  div Main (large center section)
				domConstruct.place(item,divMainNode);
		    } ,
		    
		    placeOnMarkup : function (item) {  // add item to  
				var divMarkupArea = dom.byId("markupAreaDiv");
				domConstruct.place(item,divMarkupArea);
		    } ,
		
		    placeOnFooter : function (item) {  // add item to #footer (right below header???)
				var divArea = dom.byId("footer");
				domConstruct.place(item,divArea);
		    } ,
		    
		    placeOnSurface : function (item) {
		    	divSurfaceElement = dom.byId("surfaceElement");
		    	domConstruct.place(item,divSurfaceElement);
		    }
					
		};
	}
);