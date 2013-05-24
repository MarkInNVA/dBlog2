define([
	"dojo/dom",
	"dojo/dom-style",
	"dojo/dom-class",
	"dojo/dom-construct",
	"dojo/dom-geometry",
	"dojo/string",
	"dojo/on",
	"dojo/aspect",
	"dojo/keys",
	"dojo/_base/lang",
	"dojo/_base/fx",
	"dijit/registry",
	"dojo/parser",
	"dojo/store/JsonRest",
	"dojo/_base/window",
	"dojo/query",
	"dojox/gfx",
	"dijit/form/Form",
	"dijit/form/Button",
	"dijit/form/ValidationTextBox",
	"js/module"
	],
function(dom, domStyle, domClass, domConstruct, domGeometry, string, on, aspect, keys, lang, baseFx, registry, parser, JsonRest, win, query, gfx, Form, Button, TextBox) {
	
	"use strict"
    var store = null,
 		thumbnailStore,
 		markupStore,
 		commentStore,
 		myPhotoObject,
 		myMarkupObject,	      
		thumbnailTemplate = '<img class="thumbnail" id="{id}" src="img/{tname}"/>',
		mainPhotoTemplate = '<div id="test">Name : {Name}<br>Description : {description}<br><img class="mainPhoto"  id="photo" src="img/{fname}"/> </div>',
		markupListTemplate = '<ul id="markupList"> </ul>',
		markupItemTemplate = '<li class="markupItem"> {label} </li> '  ,
		markupFormTemplate = '<div id="markupForm" >  </div>',
		markupFormInfoTemplate = '<div id="markupForm" >  </div>',
		commentListTemplate = '<ul id="commentList"> </ul>',
		commentItemTemplate = '<li class="commentItem">Received : {recv_date}, From: {from}<br>{comment} </li> '  ,

		backToStartButton,
		markUpButton,
		divMainNode = dom.byId("main"),
		surface,

// var surfaceDiv = dojo.create("div", {id: "surfaceElement", style="width: " +  "px; height:{photo.fy}px;"});
// <div id="surfaceElement" style="border: 1px solid #ccc;width: 760px;height: 572px;"></div>


		
    startup = function() {
    	// create stores 

		myPhotoObject = {
			id: "myPhotoObject", 
    		photoId: 0,
   			onClick: function(e) {
				myPhotoObject.photoId=this.id;
				setPhoto(this.id);
			}
		};
 		myMarkupObject= {
			id: "myMarkupObject", 
			onClick: function(e) {
				clickMarkUpItem(this.id);
			}
		};		        

		thumbnailStore = new JsonRest({
			target: "api/photos"
		});
			
		markupStore = new JsonRest({
			target: "api/markup"	
		});
		commentStore = new JsonRest({
			target: "api/comment"	
		});
		
		
		backToStartButton = dojo.create("button", {id: "back2Start", innerHTML:"Select photo"})
		on(backToStartButton,"click",createPickPhotoPage);

		markUpButton = dojo.create("button", {id: "markUpButton", innerHTML:"Add markup"})
		on(markUpButton,"click",createNewMarkUp);	
			
		createPickPhotoPage();  /* show them the photos & let them pick one */
		
//        console.log("end of startup");
    },
    clearMain =function () {  // clear div Main (large center section)
    	domConstruct.empty(divMainNode);
    } ,
    placeOnMain =function (item) {  // add item to  div Main (large center section)
    	domConstruct.place(item,divMainNode);
    } ,
    
    createPickPhotoPage = function () {
  	
  		clearMain();
  		  	
    	var lbl = dojo.create("div", {id: "pl_label", innerHTML:"Select photo"});
    	placeOnMain(lbl);
    	
    	var phList	= dojo.create("ul", {id: "photoList"});
    	placeOnMain(phList);
    			
		thumbnailStore.query().then(function(resultPhotos){
		   	dojo.forEach(resultPhotos, function(oneResult) {
    			var myListItem = lang.replace(thumbnailTemplate, oneResult);
    			domConstruct.place(myListItem,phList);
    		})

			query(".thumbnail").on("click", myPhotoObject.onClick);	     // the thumbnail class is added via the template above (in forEach)   
		});
//        console.log("end of createPickPhotoPage");
    	
    },

    setPhoto = function(id) {
        // summary:
        //   fade photolist label, photolist
        // create dom stuff for surface (gfx)
        // query db for photo info (by id),  query db for markup info
        // show photo and markupList
        // markup photo from info

	//	var mainNode = dom.byId("main");   use divMainNode
        baseFx.fadeOut({ node: dom.byId("pl_label")	}).play();
        
        baseFx.fadeOut({ 
        	node: dom.byId("photoList"),
			onEnd: function(node){
// 			console.log("setPhoto id: " + id); 
		        thumbnailStore.query("/"+id).then(function(photo){
		    		clearMain();
		    		
		        	putPhotoOnSurface(photo);
		        	    				
					var f = dom.byId("footer");
		    		domConstruct.place(backToStartButton,f);
		    		setMarkUps(id);

				}) //.then(setMarkUps(id)); 
			 }
		}).play();
		
//		console.log("end setPhoto : " + id);
    },
    setMarkUps = function(photoID) {
		var lbl = dojo.create("div", {id: "markUpLabel", innerHTML:"Existing Labels"});
		placeOnMain(lbl);
		
		domConstruct.place(markUpButton,divMainNode);
		var muList	= dojo.create("ul", {id: "markupList", class: "mulc"});
    	domConstruct.place(muList,divMainNode);
    	
		markupStore.query("/search/" + photoID).then(function(markups){
			if (markups == 0) { 					    						
    			domConstruct.place('<li class="markupItem">None</li>',muList);								
				console.log("no markups") 
			} else  {
				console.log("have " + markups.length + " markups;");
			   	dojo.forEach(markups, function(oneResult) {

		   			surface.createCircle({ cx: oneResult.x, cy: oneResult.y, r: oneResult.size }).setStroke({style: "Dash", width:3, cap:"butt", color:oneResult.color});
		   			
	    			var myMuItem = '<li class="markupItem" id="' + oneResult.id + '" style= "color: ' + oneResult.color + ';"> ' + oneResult.label + '</li> ';					    						
	    			domConstruct.place(myMuItem,muList);
				})
				query(".markupItem").on("click", myMarkupObject.onClick);  
			}
		});
    	
    },
    createNewMarkUp = function() {
    	console.log("new markup Photo : " + myPhotoObject.photoId)
    },

    putPhotoOnSurface = function(photo) {
		var lw = (photo.fx /2) + 10;
		var lh = (photo.fy /2) + 10;
		var fw = photo.fx /2;
		var fh = photo.fy /2;
	
		var surfaceTemplate = '<div id="surfaceElement" style={width:"' + lw + '" height: "'  + lh + '}>  </div>';
	
	    domConstruct.place(surfaceTemplate, divMainNode);		    		
		
		surface = gfx.createSurface("surfaceElement", lw , lh);
		surface.createImage({ x: 5, y: 5, width: fw, height: fh, src: "img/" + photo.fname });
    	
    },
    clickMarkUpItem = function(id) {
    	
    	var muNode = dom.byId("markupForm");

    	if (muNode) {
    		console.log("have muNode, emptying it");
    		domConstruct.empty(muNode)
    	} else {
    		console.log("do not have muNode, creating one");    		
	    	domConstruct.place(markupFormTemplate, divMainNode);
	    	muNode = dom.byId("markupForm");
    	}
    	
		markupStore.query("/" + id).then(function(markup){
	 		// console.log(markup);  
	 		var fmx = '<div> X: <input type="text" id="mTBx" value="' + markup.x + '" /><br> </div>';
	 		var fmy = '<div> Y: <input type="text" id="mTBy" value="' + markup.y + '" /><br> </div>'; 	
	 		var fmr = '<div> Radius: <input type="text" id="mTBr" value="' + markup.size + '" /><br> </div>'; 	
	 		var fmlbl = '<div> Label: <input type="text" id="mTBlbl" value="' + markup.label + '" /><br> </div>'; 	
	 		var fmcolor = '<div> Color: <input type="text" id="mTBcolor" value="' + markup.color + '" /><br> </div>'; 	
	 		
   			domConstruct.place(fmx,muNode);
   			domConstruct.place(fmy,muNode);
   			domConstruct.place(fmr,muNode);   			
   			domConstruct.place(fmlbl,muNode);   			
   			domConstruct.place(fmcolor,muNode);

	    	var commNode = dom.byId("commentList");
	       	if (commNode) {
	    		console.log("have commNode, emptying it");
	    		domConstruct.empty(commNode)
	    	} else {
	    		console.log("do not have commNode, creating one");    		
		    	domConstruct.place(commentListTemplate, divMainNode);
		    	commNode = dom.byId("commentList");
	    	}
		 	    
			commentStore.query("/search/" + markup.fk_photos).then(function(comments){
				console.log("have " + comments.length + " total comments;");
			   	dojo.forEach(comments, function(Result) {
					if (Result.fk_markups == id) {
		    			var myCommentItem = lang.replace(commentItemTemplate, Result);
						domConstruct.place(myCommentItem,commNode);
					} 
				});
			});

   		 });
    },
  
    renderItem = function(item, refNode, posn) {
        // summary:
        //      Create HTML string to represent the given item
    };
    return {
        init: function() {
            // proceed directly with startup
            startup();
 //           console.log("end of init");
            return 0;
        }
    };
});