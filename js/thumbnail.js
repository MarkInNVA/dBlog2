define( [
	"dojo/dom", "dojo/dom-construct","dojo/dom-style", "dojo/on", "dojox/gfx", "js/util",
	"dgrid/OnDemandGrid", "dgrid/Selection", "dojo/_base/declare", 
	"dojo/_base/array", "dojo/store/JsonRest", "dojo/_base/lang",
	"dojo/query", "dojo/topic"
	],
	
	function(dom, domConstruct, domStyle, on, gfx, util, 
			 DataGrid, Selection, declare, 
			 arrayUtil, JsonRest, lang,
			 query, topic) {
		"use strict";
		
		var surface, divMainNode = dom.byId("main"); //, myPhotoObject = new Object();

		var thumbnailStore = new JsonRest({
			target: "api/index.php/photos"
		});
						
		return {
			createPickPhotoPage : function () {
		   		"use strict";
				var phList, myListItem, grid , thumbnailTemplate = '<div>Name : {Name}\n<img class="thumbnail" id="{id}" src="img/{tname}"/><hr></div>';
				var myPhotoObject = {
					id: "myPhotoObject", 
					photoId: 0,
					onClick: function() { 
						myPhotoObject.photoId=this.id;
						topic.publish("thumbnail",this.id);
					}
				};
	
				// util.clearMain();
				// util.clearFooter();
		
				util.placeOnMain(domConstruct.create("div", {id: "pl_label", innerHTML:"Select photo", opacity: 0.0}));				
				util.placeOnMain(domConstruct.create("div", {id: "pl_label2", innerHTML:"or row"}));
				util.placeOnMain(domConstruct.create("div", {id: "photoGrid"}));
				phList	= domConstruct.create("ul", {id: "photoList"});
				util.placeOnMain(phList);
		
				grid = new (declare([DataGrid, Selection]))({
					store: thumbnailStore, // a Dojo object store - css stuff for column widths, etc
					columns: [
						{label: "Image", field: 'tname', formatter : myFormatter},
						{label: "#", field: "id"},
						{label: "Name", field: "Name", sortable: false},
						{label: "Description", field: "description"}
					],
					selectionMode: "single"
				}, "photoGrid");
				
				grid.on("dgrid-select", function(event){
					myPhotoObject.photoId = event.rows[0].id;
					topic.publish("thumbnail",event.rows[0].id);
				});
				
				thumbnailStore.query().then(function(resultPhotos){
					arrayUtil.forEach(resultPhotos, function(oneResult) {
						myListItem = lang.replace(thumbnailTemplate, oneResult);
						domConstruct.place(myListItem,phList);
					});
		
					query(".thumbnail").on("click", myPhotoObject.onClick);   // the thumbnail class is added via the template above (in forEach)
				});
			},
			putPhotoOnSurface : function (photoId) {
			   	"use strict";
				var lw, lh, fw, fh, photoDescription  , divSurfaceElement, imageOnSurface,
				mainPhotoTemplate = '<textarea rows="5" cols="55" readonly id="photoDescription">Name : {Name}\nDescription : {description} </textarea>';
				
				
				thumbnailStore.query("/"+photoId).then(function(photo){
				
					lw = (photo.fx /2) + 20;
					lh = (photo.fy /2) + 60;
					fw = photo.fx /2;
					fh = photo.fy /2;

					photoDescription = lang.replace(mainPhotoTemplate, photo);
					
					util.placeOnMain('<div id="surfaceElement" >  </div>');

//					surface = util.createSurface( photo.fx + 10, photo.fy + 10);  // with imageOnSurface ... photo.fx, etc works with style overflow auto, not sure about markup though
					surface = util.createSurface( lw , lh);
					
					divSurfaceElement = dom.byId("surfaceElement");					
					
					domConstruct.place(photoDescription, divSurfaceElement);			
					
//					imageOnSurface = surface.createImage({ x: 5, y: 40, width: photo.fx, height: photo.fy, src: "img/" + photo.fname });  // see above ( surface = util... photo.fx...) 
					imageOnSurface = surface.createImage({ x: 5, y: 40, width: fw, height: fh, src: "img/" + photo.fname }); 
		//			util.showMain();
					return(imageOnSurface);
				 });
			
			},
			putShapeOnSurface : function (shape) {
				var i;
				i = surface.createCircle({ cx: shape.x, cy: shape.y, r: shape.size }).setStroke({style: "Dash", width:3, cap:"butt", color:shape.color});
				console.log("Put", i, "on surface");
			}
		}
		
		function myFormatter(value, index) {
			var s = '<img class="dgimg" src = img/' + value + '>'; 
			return s;
		};
	});
	
