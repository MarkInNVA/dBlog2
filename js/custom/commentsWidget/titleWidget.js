define(["dojo/_base/declare","dijit/_WidgetBase", "dijit/_TemplatedMixin", "dojo/text!./templates/titleWidget.html", 
		"dojo/topic", "dojo/dom", "dojox/gfx", "dojo/store/JsonRest", "dojo/_base/array"//, "custom/markupWidget/markupWidget"
		],
    function(declare, WidgetBase, TemplatedMixin, 
    		 template, topic, dom, gfx, JsonRest, arrayUtil//, MarkupWidget
    		) {
        return declare([WidgetBase, TemplatedMixin], {
        	name: "Title",
            templateString: template,
            baseClass: "titleWidget",
 
   			postCreate: function(){

				this.inherited(arguments);   // Run any parent postCreate processes - can be done at any point
			}
        });

});

