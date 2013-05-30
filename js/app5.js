define([
	"dojo/dom", "dojo/dom-style", "dojo/dom-class", "dojo/dom-construct", "dojo/dom-geometry",
	
	"dojo/string", "dojo/on", "dojo/aspect", "dojo/keys", "dojo/_base/lang", "dojo/_base/fx",

	"dojo/store/JsonRest", "dojo/_base/window", "dojo/query", "dojox/gfx",
	"dgrid/OnDemandGrid",
	"dgrid/Selection", 
	"dojo/store/Memory",
	"dojo/data/ObjectStore",
	"dojo/_base/declare", 


	"dijit/form/ValidationTextBox",
	"js/module"
	], 
function(dom, domStyle, domClass, domConstruct, domGeometry, 
		string, on, aspect, keys, lang, baseFx, 

		JsonRest, win, query, gfx, DataGrid, Selection, Memory, ObjectStore , declare,
		 TextBox) {
	
	"use strict"
    var store = null,
 		thumbnailStore,
 		markupStore,
 		commentStore,
 		myPhotoObject,
 		myMarkupObject,	      
		thumbnailTemplate = '<div>Name : {Name}\n<img class="thumbnail" id="{id}" src="img/{tname}"/><hr></div>',
//		thumbnailTemplate = '<img class="thumbnail" id="{id}" src="img/{tname}"/>',		
		mainPhotoTemplate = '<textarea rows="5" cols="55" readonly id="photoDescription">Name : {Name}\nDescription : {description} </textarea>',
		markupListTemplate = '<ul id="markupList"> </ul>',
		markupItemTemplate = '<li class="markupItem"> {label} </li> '  ,
		markupFormTemplate = '<div id="markupForm" >  </div>',
		markupFormInfoTemplate = '<div id="markupForm" >  </div>',
		commentListTemplate = '<ul id="commentList"> </ul>',
		commentItemTemplate = '<li class="commentItem">Received : {recv_date}, From: {from}<br>{comment} </li> '  ,

		backToStartButton,
		markUpButton,
		commentButton,
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
		
		
		backToStartButton = dojo.create("button", {id: "back2Start", innerHTML:"Select photo"});
		on(backToStartButton,"click",createPickPhotoPage);

		markUpButton = dojo.create("button", {id: "markUpButton", innerHTML:"Add markup"});
		on(markUpButton,"click",createNewMarkUp);	
		
		commentButton = dojo.create("button", {id: "commentButton", innerHTML:"Add comment"});
		on(commentButton,"click",createNewComment);				
		
		createPickPhotoPage();  /* show them the photos & let them pick one */
		
//        console.log("end of startup");
    },
    clearMain =function () {  // clear div Main (large center section)
        baseFx.fadeOut({ 
        	node: dom.byId(divMainNode),
			onEnd: domConstruct.empty(divMainNode)
		}).play();  	
        baseFx.fadeIn({ 
        	node: dom.byId(divMainNode)
		}).play(); 
   // 	domConstruct.empty(divMainNode);
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
        baseFx.fadeOut({ node: dom.byId("pl_label")	}).play();
        
        baseFx.fadeOut({ 
        	node: dom.byId("photoList"),
			onEnd: putPhotoOnSurface(id)
		}).play();
		
//		console.log("end setPhoto : " + id);
    },
    putPhotoOnSurface = function(photoID) {
	    clearMain();
		thumbnailStore.query("/"+photoID).then(function(photo){
    	
			var lw = (photo.fx /2) + 10;
			var lh = (photo.fy /2) + 10;
			var fw = photo.fx /2;
			var fh = photo.fy /2;
		
			var surfaceTemplate = '<div id="surfaceElement" style= {width:"' + lw + '", height: "'  + lh +  '"}>  </div>';
		    domConstruct.place(surfaceTemplate, divMainNode);		    		

			var surfaceElementDiv = dom.byId("surfaceElement");
			
			var photoDescription = lang.replace(mainPhotoTemplate, photo);
    		domConstruct.place(photoDescription, surfaceElementDiv);
			
			surface = gfx.createSurface("surfaceElement", lw , lh);

			surface.createImage({ x: 5, y: 5, width: fw, height: fh, src: "img/" + photo.fname });
			
			var lbl = dojo.create("div", {id: "markUpLabel", innerHTML:"Existing Labels"});
	    	domConstruct.place(lbl, surfaceElementDiv);	

			domConstruct.place(markUpButton,surfaceElementDiv);
			var muList	= dojo.create("ul", {id: "markupList", class: "mulc"});
	    	domConstruct.place(muList,surfaceElementDiv);

			markupStore.query("/search/" + photoID).then(function(markups){
				if (markups == 0) { 					    						
	    			domConstruct.place('<li class="markupItem">None</li>',muList);								
			//		console.log("no markups") 
				} else  {
			//		console.log("have " + markups.length + " markups;");
				   	dojo.forEach(markups, function(oneResult) {
	
			   			surface.createCircle({ cx: oneResult.x, cy: oneResult.y, r: oneResult.size }).setStroke({style: "Dash", width:3, cap:"butt", color:oneResult.color});
			   			
		    			var myMuItem = '<li class="markupItem" id="' + oneResult.id + '" style= "color: ' + oneResult.color + ';"> ' + oneResult.label + '</li> ';					    						
		    			domConstruct.place(myMuItem,muList);
					})
					query(".markupItem").on("click", myMarkupObject.onClick);  
				}
			});

			var f = dom.byId("footer");
			domConstruct.place(backToStartButton,f);
			
	      	baseFx.fadeIn({ node: dom.byId("surfaceElement")	}).play();	    	
		
		});    	

    },  
    createNewMarkUp = function() {
    	console.log("new markup Photo : " + myPhotoObject.photoId)
    },    
    createNewComment = function() {
    	console.log("new comment,  Photo : " + myPhotoObject.photoId)
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
    	
    	domConstruct.place(commentButton,dom.byId("surfaceElement"));
    	
		markupStore.query("/" + id).then(function(markup){

			var lbl = dojo.create("div", {id: "markupFormLabel", innerHTML:"Markup Info"});
	    	domConstruct.place(lbl, divMainNode);	

			var lbl2 = dojo.create("div", {id: "commentLabel", innerHTML:"Comments"});
	    	domConstruct.place(lbl2, divMainNode);	
	    		
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