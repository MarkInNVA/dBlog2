define(["dojo/_base/declare","dijit/_WidgetBase", "dijit/_TemplatedMixin", "dojo/text!./templates/gridWidget.html", 
		"dgrid/OnDemandGrid", "dgrid/Selection", "dojo/_base/declare",
    	"dojo/topic"
		],
    function(declare, WidgetBase, TemplatedMixin, template, 
    		DataGrid, Selection, declare,
        	topic
    		) {
        return declare([WidgetBase, TemplatedMixin], {
        	name: "Pick a photo to discuss",

            templateString: template,
 
            baseClass: "gridWidget",
 
   			postCreate: function(){
   				var _grid; 

				this.inherited(arguments);   // Run any parent postCreate processes - can be done at any point

                _grid = new(declare([DataGrid, Selection]))({
                    store: this.aStore, // a Dojo object store - css stuff for column widths, etc
                    columns: [
                    	{ label: "Image",       field: 'tname',       sortable: false, formatter: myFormatter }, 
                    	{ label: "#",           field: "id",          sortable: false }, 
                    	{ label: "Name",        field: "Name",        sortable: false }, 
                    	{ label: "Description", field: "description", sortable: false }
                    ],
                    "class": "sage",
//                    selectionMode: "single" }, this.domNode);
                    selectionMode: "single" }, this.gridNode);

                _grid.on("dgrid-select", function (event) {
  					topic.publish("havePhoto", event.rows[0].data);
    //                console.log("event rows[0] :",event.rows[0].data);
//                    console.log("grid.on id:",event.rows[0].id);
                });
                        
   	         	function myFormatter(value) {
	            	return '<img class="dgimg" src = img/' + value + '>';
    	    	};
			}
        });
});

