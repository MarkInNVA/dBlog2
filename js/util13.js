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
				console.log("Clearing main");
				domConstruct.empty(dom.byId(divMainNode));
				// setTimeout(function(){
					// onEnd: domConstruct.empty(divMainNode)
    			// }, 1000);
					// baseFx.fadeOut({ 
						// node: dom.byId(divMainNode),
						// duration:500,
					// }).play();
			} ,
			
			showMain : function() {
				// baseFx.fadeIn({ 
					// node: dom.byId(divMainNode),
					// duration:500
				// }).play(); 				
			},
			// clearFooter : function(){
				// baseFx.fadeOut({ 
					// node: dom.byId("footer"),
					// onEnd: domConstruct.empty("footer")
				// }).play();			
			// },
			// showFooter : function() {
				// baseFx.fadeIn({ 
					// node: dom.byId("footer")
				// }).play(); 			
			// },
			clearMarkup : function(){
				console.log("Clearing markup");
				domConstruct.empty(dom.byId("markupAreaDiv"));
				baseFx.fadeOut({ 
					node: dom.byId("markupAreaDiv"),
					duration: 500,
					onEnd: domConstruct.empty("markupAreaDiv")
				}).play();			
			},
	
		    placeOnMain : function (item) {  // add item to  div Main (large center section)
				domConstruct.place(item,divMainNode);
		    } ,
		    placeOnMainGrid : function (item) {  // add item to  div Main (large center section)
				domConstruct.place(item,dom.byId("mainGrid"));
		    } ,
		    
		    placeOnMarkupGrid : function (item) {  // add item to  
				domConstruct.place(item,dom.byId("markupGridContainer"));
		    } ,
		    
		    placeOnMarkup : function (item) {  // add item to  
				domConstruct.place(item,dom.byId("markupAreaDiv"));
		    } ,
		
		    placeOnFooter : function (item) {  // add item to #footer (right below header???)
				domConstruct.place(item,dom.byId("footer"));
		    } ,
		    
		    placeOnSurface : function (item) {
		    	domConstruct.place(item,dom.byId("surfaceElement"));
		    } ,
		    placeOnPhotoGridContainer: function (item) {
		    	domConstruct.place(item,dom.byId("photoGridContainer"));
		    }
					
		};
	}
);