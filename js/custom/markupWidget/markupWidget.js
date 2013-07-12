define(["dojo/_base/declare","dijit/_WidgetBase", "dijit/_TemplatedMixin", "dojo/text!./templates/markupWidget.html", 
		"dojo/topic", "dojo/dom", "dojox/gfx", "dojo/store/JsonRest", "dojo/_base/array", "dojo/on"
		],
    function(declare, WidgetBase, TemplatedMixin, 
    		 template, topic, dom, gfx, JsonRest, arrayUtil, on
    		) {
        return declare([WidgetBase, TemplatedMixin], {
        	color: "No Color",
        	label: "No Label",
            templateString: template,
            baseClass: "markupWidget",
 
   			postCreate: function(){
   				var domNode = this.domNode;
				this.inherited(arguments);   // Run any parent postCreate processes - can be done at any point
		//		console.log(this.theData);   				
                this.own(
			        on(domNode, 'click', function (e) {
						console.log(e.currentTarget.id);
					})
			    );  
			}
			
        });
		
});

