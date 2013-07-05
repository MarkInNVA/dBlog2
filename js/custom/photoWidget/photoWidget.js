define(["dojo/_base/declare","dijit/_WidgetBase", "dijit/_TemplatedMixin", 
		"dojo/text!./templates/photoWidget.html", "dojo/topic"
		],
    function(declare, WidgetBase, TemplatedMixin, 
    		 template, topic
    		) {
        return declare([WidgetBase, TemplatedMixin], {
        	name: "No Name",

            templateString: template,
 
            baseClass: "photoWidget",
 
   			postCreate: function(){

				this.inherited(arguments);   // Run any parent postCreate processes - can be done at any point

                        
			}
        });
});

