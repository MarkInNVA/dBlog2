define( [
	"dojo/dom", "dojo/dom-construct","dojo/dom-style", "dojo/on", "dojox/gfx", "dojox/gfx/fx", "js/util",
	"dgrid/OnDemandGrid", "dgrid/Selection", "dojo/_base/declare", 
	"dojo/_base/array", "dojo/store/JsonRest", "dojo/_base/lang",
	"dojo/query", "dojo/topic", "dojo/Deferred"
	],
	
	function(dom, domConstruct, domStyle, on, gfx, gfxFx, util, 
			 DataGrid, Selection, declare, 
			 arrayUtil, JsonRest, lang,
			 query, topic, Deferred) {
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
		
				util.placeOnMain(domConstruct.create("div", {id: "pl_label", innerHTML:"Select photo to discuss", opacity: 0.0}));				
//				util.placeOnMain(domConstruct.create("div", {id: "pl_label2", innerHTML:"or row"}));
				util.placeOnMain(domConstruct.create("div", {id: "photoGrid"}));
//				phList	= domConstruct.create("ul", {id: "photoList"});
//				util.placeOnMain(phList);
		
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
// 				
				// thumbnailStore.query().then(function(resultPhotos){
					// arrayUtil.forEach(resultPhotos, function(oneResult) {
						// myListItem = lang.replace(thumbnailTemplate, oneResult);
						// domConstruct.place(myListItem,phList);
					// });
// 		
					// query(".thumbnail").on("click", myPhotoObject.onClick);   // the thumbnail class is added via the template above (in forEach)
				// });
			},
			putPhotoOnSurface : function (photoId) {
			   	"use strict";
				var lw, lh, fw, fh, photoDescription  , divSurfaceElement, imageOnSurface,
				mainPhotoTemplate = '<textarea rows="5" cols="55" readonly id="photoDescription">Name : {Name}\nDescription : {description} </textarea>',
				deferred = new Deferred(),
				
				waitForIt = function (){
					surface.whenLoaded(function(e){
						console.log("Surface loaded (tn ):",e);
						deferred.resolve();						
					})				
					return deferred.promise;	
				};
				
				console.log("At start of putPhotoOnSurface (tn ):");			
				
				thumbnailStore.query("/"+photoId).then(function(photo){
				
					lw = (photo.fx /2) + 20;
					lh = (photo.fy /2) + 60;
					fw = photo.fx /2;
					fh = photo.fy /2;

					photoDescription = lang.replace(mainPhotoTemplate, photo);
					
					util.placeOnMain('<div id="surfaceElement" >  </div>');

//	test2				surface = util.createSurface( photo.fx + 10, photo.fy + 10);  // with imageOnSurface ... photo.fx, etc works with style overflow auto, not sure about markup though
			
					console.log("Right before createSurface (tn ):");

					surface = util.createSurface( lw , lh);
					waitForIt().then (function() {
						console.log("start of waitforit (tn ):");
						divSurfaceElement = dom.byId("surfaceElement");					
						domConstruct.place(photoDescription, divSurfaceElement);			
						
						imageOnSurface = surface.createImage({ x: 5, y: 40, width: fw, height: fh, src: "img/" + photo.fname }); 
						return surface; 						
					});
				 });
				console.log("At end of putPhotoOnSurface (tn ):");			
			},
			getSurface : function() {
				return surface;
			},
			putShapeOnSurface : function (shape) {
				var i, x = shape.x * 2, y = shape.y * 2;
//				i = surface.createCircle({ cx: shape.x, cy: shape.y, r: shape.size }).setStroke({style: "shape.style"Dash"", width : shape.width, cap: shape.cap, color:shape.color});
//	test2			i = surface.createCircle({ cx: x , cy: y, r: shape.size }).setStroke({style: "Dash", width:3, cap:"butt", color:shape.color});
				i = surface.createCircle({ cx: shape.x , cy: shape.y, r: shape.size }).setStroke({style: "Dash", width:3, cap:"butt", color:shape.color});
		//		console.log("I Put old ", i, "on surface");
			},
			putNewShapeOnSurface : function (shape) {
				var i;
				i = surface.createCircle({ cx: shape.x, cy: shape.y, r: shape.size }).setStroke({style: shape.style, width : shape.width, cap: shape.cap, color:shape.color});
		//		console.log("I Put new ", i, "on surface");
				return i;
			}
			,
			putNewShapeOnSurfaceTemp : function (shape) {
				var i;
				i = surface.createEllipse({ 
						cx: shape.x, 
						cy: shape.y, 
						rx: shape.sizex, 
						ry: shape.sizey 
					}).setStroke({
						style: shape.style, 
						width : shape.width, 
						cap: shape.cap, 
						color:shape.color});
		//		console.log("I Put new ", i, "on surface");
				return i;
			},
			rotate : function(i) {
//				i.applyTransform(gfx.matrix.skewYAt(2, i.shape.cx, i.shape.cy));
				var animation = new gfxFx.animateTransform({
					duration:5000,
					shape: i,
					transform: [{
						name:  "rotateAt",
						start: [0, 240, 240],
						end:   [360, 240, 240]
					}]
				})
				animation.play();
			}
		}
		
		function myFormatter(value, index) {
			var s = '<img class="dgimg" src = img/' + value + '>'; 
			return s;
		};
	});
	
