define(["dojo/_base/declare","dijit/_WidgetBase", "dijit/_TemplatedMixin", "dojo/text!./templates/markupWidget.html", 
		"dojo/topic", "dojo/dom", "dojox/gfx", "dojo/store/JsonRest", "dojo/_base/array", "dojo/on", "dojo/dom-style"
		],
    function(declare, WidgetBase, TemplatedMixin, 
    		 template, topic, dom, gfx, JsonRest, arrayUtil, on, domStyle
    		) {
        return declare([WidgetBase, TemplatedMixin], {
        	color: "No Color",
        	label: "No Label",
            templateString: template,
            baseClass: "markupWidget",
 
   			postCreate: function(){
   				var domNode = this.domNode;
   				var thePath = this.path;
   				var theMuId;
				this.inherited(arguments);   // Run any parent postCreate processes - can be done at any point
		//		console.log(this.theData);   				
                this.own(
			        on(domNode, 'click', function (e) {
			        	theMuId = e.currentTarget.id;
			        	topic.publish("markupClicked", theMuId, thePath);
			        	domStyle.set(this.id, "color", "green");
				//		console.log("id,path",theMuId, thePath);
					})
			    );  
			}
			
        });
		
});

