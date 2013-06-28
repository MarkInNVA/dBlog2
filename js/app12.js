define([
    "dojo/dom", "dojo/dom-construct", "dojo/dom-attr", "dojo/on", // "dojo/router",
    "dojo/_base/array", "dojo/_base/lang", "dojo/query", 
    "dgrid/OnDemandGrid", "dgrid/Selection", "dojo/_base/declare",
    "dojo/store/JsonRest", "dojo/topic", "dojo/_base/fx", "dojox/gfx",
     "js/util12",  "js/markup12", "js/module"
],
    function (dom, domConstruct, domAttr, on, // router,
        arrayUtil, lang, query, 
        DataGrid, Selection, declare,
        JsonRest, topic, baseFx, gfx,
        util,  markup  ) 
    {
        "use strict";
        var  thumbnailStore, markupStore, commentStore, surface, // currentPhotoId, myRouter = router,


			// setup JSONRest store, point grid at it, wait for row select, which returns the photoId for the next step (putPhotoOnPage)
			// html elements start : main, end 
            startup = function () {
           // 	console.log("Startup (app)");
            	
            	var grid; //, onH, backButton = domConstruct.create("button", {id: "backButton", innerHTML:"To Main"});
            	domConstruct.empty("main");
            	util.placeOnMain(domConstruct.create("div", { id: "mainGrid" }));
				util.placeOnMainGrid(domConstruct.create("div", { id: "photoGridContainer" }));
 
				util.placeOnPhotoGridContainer(domConstruct.create("div", { id: "pl_label", innerHTML: "Select row to discuss photo", opacity: 0.0 }));
            	util.placeOnPhotoGridContainer(domConstruct.create("div", { id: "photoGrid" }));

        		thumbnailStore = new JsonRest({
            		target: "api/index.php/photos"
        		});
        		
        		markupStore = new JsonRest({
           			 target: "api/index.php/markup"
        		});
        		
        		commentStore = new JsonRest({
					target: "api/index.php/comment"
        		});
        		
                grid = new(declare([DataGrid, Selection]))({
                    store: thumbnailStore, // a Dojo object store - css stuff for column widths, etc
                    columns: [
                    	{ label: "Image",       field: 'tname',       sortable: false, formatter: myFormatter }, 
                    	{ label: "#",           field: "id",          sortable: false }, 
                    	{ label: "Name",        field: "Name",        sortable: false }, 
                    	{ label: "Description", field: "description", sortable: false }
                    ],
                    "class": "sage",
                    selectionMode: "single"
                }, "photoGrid");
                grid.startup();

                grid.on("dgrid-select", function (event) {
	                baseFx.fadeOut({ 
						node: dom.byId("photoGridContainer"),
						duration: 500 
					}).play();
					
                    setTimeout(function () {
                   
                        onEnd: {
			            	domConstruct.empty(dom.byId("mainGrid"));
			            //	console.log("main :",dom.byId("main"));
			            	
		                    console.log("grid.on id:",event.rows[0].id);
		                    thumbnailStore.query("/" + event.rows[0].id).then(function(photo) {
			                    putPhotoOnPage(photo);	
		                    });
                        }
                    }, 500);

                });
                
                baseFx.fadeIn({ 
					node: dom.byId("photoGridContainer"),
					duration: 500 
				}).play();
            },                       	
          
   	         myFormatter = function (value) {
	            return '<img class="dgimg" src = img/' + value + '>';
    	    },
    	    putPhotoOnPage = function (photo) {
    	    	var image, fw, fh, markupButton, surfaceHandle;
    //            console.log("putPhotoOnPage, app, photoId :",photo.id);

                surfaceHandle = topic.subscribe("haveSurface", function(surface)  {
                	image = surface.createImage({ x: 10, y: 10, width: (photo.fx / 2), height: (photo.fy / 2), src: "img/" + photo.fname });
                	surfaceHandle.remove();
                	paintMarkUpDiv(photo);
                	baseFx.fadeIn({ 
						node: dom.byId("markupGridContainer"),
						duration: 500 
					}).play();
					
                });
                
                util.placeOnMainGrid('<div id="markupGridContainer" >  </div>');
                util.placeOnMarkupGrid('<div id="surfaceElement" >  </div>');
//
                markupButton = domConstruct.create("button", { id: "back2Start", innerHTML: "Pick Photo" });
      			
                on.once(markupButton, "click", function(e) {
                	startup();
				});
                
                util.placeOnSurface(markupButton);
//
	            fw = (photo.fx / 2) + 10;
	            fh = (photo.fy / 2) + 25;
	            createSurface(fw, fh);
            },
            createSurface = function(width, height) {
	            var divSurfaceElement = dom.byId("surfaceElement");
				if (!divSurfaceElement) {
					debugger;
				} else {
		            surface = gfx.createSurface(divSurfaceElement, width, height);
		
		            surface.whenLoaded(function () {
	//	                console.log("surface loaded (tn)");
		                topic.publish("haveSurface",surface);
		            });
					
				}
        	},
        	paintMarkUpDiv = function(photo) {
        		var muNode, muList, myMuItem;
	        	util.placeOnMarkupGrid('<div id="markupAreaDiv" >  </div>');
	        	util.placeOnMarkup(domConstruct.create("div", { id: "markupFormLabel", innerHTML: "Markup Info" }));
	        	util.placeOnMarkup(domConstruct.create("div", { id: "markupLabel", innerHTML: "Markups" }));

                util.placeOnMarkup('<div id="markupForm" >  </div>');
                muNode = dom.byId("markupForm");
                domConstruct.place('<div> X: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <input type="text" size="5" id="mTBx" value="' + markup.x + '" /><br> </div>', muNode);
                domConstruct.place('<div> Y: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <input type="text" size="5" id="mTBy" value="' + markup.y + '" /><br> </div>', muNode);
                domConstruct.place('<div> Radius:  <input type="text" size="5" id="mTBr" value="' + markup.size + '" /><br> </div>', muNode);
                domConstruct.place('<div> Label: &nbsp;&nbsp; <input type="text" size="17" id="mTBlbl" value="' + markup.label + '" /><br> </div>', muNode);
                domConstruct.place('<div> Color: &nbsp;&nbsp; <input type="text" size="5" id="mTBcolor" value="' + markup.color + '" /><br> </div>', muNode);
                
                muList = domConstruct.create("ul", { id: "markupList", className: "mulc" }, "markupAreaDiv");

                util.placeOnMarkup('<div id="photoDescription" >  </div>');
				util.placeOnMarkup(lang.replace('<textarea  readonly id="photoDescription">Name : {Name}\nDescription : {description} </textarea>', photo));
                
                topic.subscribe("haveMarkup", function(markup)  {
                	image = surface.createImage({ x: 10, y: 10, width: (photo.fx / 2), height: (photo.fy / 2), src: "img/" + photo.fname });
                	paintMarkUpDiv(photo);
                	baseFx.fadeIn({ 
						node: dom.byId("markupGridContainer"),
						duration: 500 
					}).play();					
                });
                
                
                markupStore.query("/search/" + photo.id).then(function (markups) {
                    if (markups === 0) {
                        domConstruct.place('<li class="markupItem">None</li>', muList);
                        //			console.log("no markups"); 
                    } else {
                        //			console.log("have " + markups.length + " markups;");
                        arrayUtil.forEach(markups, function (oneResult) { 
                            putShapeOnSurface(oneResult);
                            // //					var i = surface.createCircle({ cx: oneResult.x, cy: oneResult.y, r: oneResult.size }).setStroke({style: "Dash", width:3, cap:"butt", color:oneResult.color});
                            // //	console.log(i.getUID());
                            myMuItem = '<li class="markupItem" id="' + oneResult.id + '" style= "color: ' + oneResult.color + ';"> ' + oneResult.label + '</li> ';
                            domConstruct.place(myMuItem, muList);
                        });
                        query(".markupItem").on("click", markUpClick);
                        
                    }
                });        	
        	},
        	markUpClick = function (e) {
        		var commNode, myCommentItem,
        		commentFormTemplate = '<ul id="commentForm"> </ul>',
        		commentItemTemplate = '<li class="commentItem">Received : {recv_date}, From: {from}<br>{comment} </li> ';
        //		console.log(e);	
        		markupStore.query("/" + this.id).then(function (markup) {
        				domAttr.set("mTBx", "value", markup.x);
	                    domAttr.set("mTBy", "value", markup.y);
	                    domAttr.set("mTBr", "value", markup.size);
	                    domAttr.set("mTBlbl", "value", markup.label); // Temp
	                    domAttr.set("mTBcolor", "value", markup.color);
        		//	console.log(markup);
        	
                     commNode = dom.byId("commentForm");
                    if (commNode) {
                        				console.log("have commNode, emptying it");
                        domConstruct.empty(commNode);
                    } else {
                        				console.log("do not have commNode, creating one");
                        util.placeOnMarkup(commentFormTemplate);
                        //				domConstruct.place(commentFormTemplate, divMainNode);
                        commNode = dom.byId("commentForm");
                    }

                    commentStore.query("/search/" + markup.fk_photos).then(function (comments) {
                        				console.log("have " + comments.length + " total comments;");
                        var c = 0;
                        arrayUtil.forEach(comments, function (Result) {
                            if (Result.fk_markups == markup.id) { // does === work here?
                                c += 1;
                                myCommentItem = lang.replace(commentItemTemplate, Result);
                                domConstruct.place(myCommentItem, commNode);
                                console.log(Result);
                            }
                        });
                        //				console.log("have ", c);				
                    });       	
        		
        		});
        	},
        	putShapeOnSurface =  function (shape) {
                var i; //, x = shape.x * 2,
                   // y = shape.y * 2;

                //				i = surface.createCircle({ cx: shape.x, cy: shape.y, r: shape.size }).setStroke({style: "shape.style"Dash"", width : shape.width, cap: shape.cap, color:shape.color});
                //	test2			i = surface.createCircle({ cx: x , cy: y, r: shape.size }).setStroke({style: "Dash", width:3, cap:"butt", color:shape.color});
                i = surface.createCircle({ cx: shape.x, cy: shape.y, r: shape.size }).setStroke({ style: "Dash", width: 3, cap: "butt", color: shape.color });
  //              console.log("I Put old ", i, "on surface");
            };    	    	
           
        return {
            init: function () {
                startup();
                return 0;
            }
        };
    }
);