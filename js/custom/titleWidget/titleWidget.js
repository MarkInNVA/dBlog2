define(["dojo/_base/declare","dijit/_WidgetBase", "dijit/_TemplatedMixin", "dojo/text!./templates/titleWidget.html", 
		"dojo/topic", "dojo/dom", "dojo/dom-construct", "dojo/dom-attr", "dojox/gfx", "dojo/store/JsonRest", "dojo/_base/array"//, "custom/markupWidget/markupWidget"
		],
    function(declare, WidgetBase, TemplatedMixin, 
    		 template, topic, dom, domConstruct, domAttr, gfx, JsonRest, arrayUtil//, MarkupWidget
    		) {
        return declare([WidgetBase, TemplatedMixin], {
        	name: "Title",
            templateString: template,
            baseClass: "titleWidget",
 
   			postCreate: function(){
   				var muList, myMuItem ;
				this.inherited(arguments);   // Run any parent postCreate processes - can be done at any point
				this.markupNode.innerHTML = "Name : ";
				
				muList = domConstruct.create("ul", { id: "markupList", className: "mulc" });
				domConstruct.place(muList,"markupNode");
				 myMuItem = '<li class="markupItem"  style= "color: blue ;"> hi there </li> ';
		//		domConstruct.place(myMuItem, muList);
		    } 
        });

});

