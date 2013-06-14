define([
	"dojo/dom", "dojo/dom-construct", "dojo/dom-attr", "dojo/on",  "dojo/_base/fx",
    "dgrid/OnDemandGrid", "dgrid/Selection", "dojo/_base/declare", 
    "dojo/_base/array", "dojo/_base/lang", "dojo/query", 
  //  "dojox/gfx", 
    "dojox/gfx/Moveable",
  
	"dojo/store/JsonRest",
	"dojo/parser",

	"js/util", "js/thumbnail", "js/module"
	], 

function( dom, domConstruct, domAttr, on, baseFx,
         DataGrid, Selection, declare,
         arrayUtil, lang, query,  //gfx, 
         mover,
         JsonRest, parser, util, thumbnail

	) {
	"use strict";
    var // store = null,
		thumbnailStore,
		markupStore,
		commentStore,

		myPhotoObject,
		myMarkupObject,

		thumbnailTemplate = '<div>Name : {Name}\n<img class="thumbnail" id="{id}" src="img/{tname}"/><hr></div>',
		mainPhotoTemplate = '<textarea rows="5" cols="55" readonly id="photoDescription">Name : {Name}\nDescription : {description} </textarea>',
		
		markupAreaTemplate = '<div id="markupAreaDiv" >  </div>',
		markupFormTemplate = '<div id="markupForm" >  </div>',  // ???????

//		markupListTemplate = '<ul id="markupList" class=mulc""> </ul>',
//		markupItemTemplate = '<li class="markupItem"> {label} </li> '  ,
//		markupFormInfoTemplate = '<div id="markupForm" >  </div>',  // ???????????

		commentFormTemplate = '<ul id="commentForm"> </ul>',
		commentItemTemplate = '<li class="commentItem">Received : {recv_date}, From: {from}<br>{comment} </li> '  ,

//		backToStartButton,
		markUpButton,
		commentButton,

		divMainNode = dom.byId("main"),
		
		surface,
		imageOnSurface,
		divSurfaceElement,
	
		
    startup = function() {
		// create objects, stores, a couple buttons, then go to createPickPhotoPage

		myPhotoObject = {
			id: "myPhotoObject", 
			photoId: 0,
			onClick: function() {
				myPhotoObject.photoId=this.id;
				putPhotoOnSurface(this.id);
			}
		};
		myMarkupObject= {
			id: "myMarkupObject", 
			photoId: 0,
			mkarkupID: 0,
			onClick: function() {
				clickMarkUpItem(this.id);
			}
		};

		thumbnailStore = new JsonRest({
			target: "api/index.php/photos"
		});
			
		markupStore = new JsonRest({
			target: "api/index.php/markup"	
		});
		commentStore = new JsonRest({
			target: "api/index.php/comment"	
		});


		markUpButton = domConstruct.create("button", {id: "markUpButton", innerHTML:"Add markup"});
		on(markUpButton,"click",createNewMarkUp);	
		
		commentButton = domConstruct.create("button", {id: "commentButton", innerHTML:"Add comment"});
		on(commentButton,"click",createNewComment);				
		
		createPickPhotoPage();  /* show them the photos & let them pick one */

    },


        
    createPickPhotoPage = function () {
    	var photo;
    	photo = thumbnail.createPickPhotoPage()
		// var phList, myListItem, grid  ;
// 
		// util.clearMain();
		// util.clearFooter();
// 
		// util.placeOnMain(domConstruct.create("div", {id: "pl_label", innerHTML:"Select photo"}));
// 		
		// util.placeOnMain(domConstruct.create("div", {id: "pl_label2", innerHTML:"or row"}));
// 
		// util.placeOnMain(domConstruct.create("div", {id: "photoGrid"}));
// 
		// phList	= domConstruct.create("ul", {id: "photoList"});
		// util.placeOnMain(phList);
// 
		// grid = new (declare([DataGrid, Selection]))({
			// store: thumbnailStore, // a Dojo object store - css stuff for column widths, etc
			// columns: [
				// {label: "#", field: "id"},
				// {label: "Name", field: "Name", sortable: false},
				// {label: "Description", field: "description"}
			// ],
			// selectionMode: "single"
		// }, "photoGrid");
// 		
		// grid.on("dgrid-select", function(event){
			// myPhotoObject.photoId = event.rows[0].id;
			// putPhotoOnSurface(event.rows[0].id);
		// });
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

    putPhotoOnSurface = function(photoID) {
		"use strict";
		var lw, lh, fw, fh, photoDescription, backToStartButton, handleBackToStart; //, markupAreaDiv;
		util.clearMain();
		
		thumbnailStore.query("/"+photoID).then(function(photo){

			lw = (photo.fx /2) + 10;
			lh = (photo.fy /2) + 60;
			fw = photo.fx /2;
			fh = photo.fy /2;
		
			util.placeOnMain('<div id="surfaceElement" style= {width:"' + lw + '"}>  </div>');

			divSurfaceElement = dom.byId("surfaceElement");
			
			photoDescription = lang.replace(mainPhotoTemplate, photo);
			domConstruct.place(photoDescription, divSurfaceElement);			
			
		//	surface = gfx.createSurface("surfaceElement", lw , lh);
			surface = util.createSurface("surfaceElement", lw , lh);
			
			imageOnSurface = surface.createImage({ x: 5, y: 40, width: fw, height: fh, src: "img/" + photo.fname }); 
			
			backToStartButton = domConstruct.create("button", {id: "back2Start", innerHTML:"Select Photo"});
		     
		  //  on(backToStartButton,"click",createPickPhotoPage);

			var handleBackToStart = on(backToStartButton, "click", function(evt){
			    // Remove this event using the handle
			    handleBackToStart.remove();
			 
			    // Do other stuff here that you only want to happen one time
			    createPickPhotoPage();
			});
			util.placeOnFooter(backToStartButton);
			
			domConstruct.place(markupAreaTemplate, divSurfaceElement);
//	        markupAreaDiv = dom.byId("markupAreaDiv");

			util.placeOnMarkup('<div id="markupLabel">Existing Labels</div>');
						
			baseFx.fadeIn({ node: dom.byId("surfaceElement") }).play();
		
			paintMarkupScreen(photoID);
		});
	},
	paintMarkupScreen = function(photoID) {
		var muList, myMuItem, markupAreaDiv;	
	
		placeOnMarkup(markUpButton);

		muList	= domConstruct.create("ul", {id: "markupList", class: "mulc"},"markupAreaDiv");
		
		markupStore.query("/search/" + photoID).then(function(markups){
			if (markups === 0) {
				domConstruct.place('<li class="markupItem">None</li>',muList);								
//				console.log("no markups"); 
			} else  {
//				console.log("have " + markups.length + " markups;");
				arrayUtil.forEach(markups, function(oneResult) {

					var i = surface.createCircle({ cx: oneResult.x, cy: oneResult.y, r: oneResult.size }).setStroke({style: "Dash", width:3, cap:"butt", color:oneResult.color});

				//	console.log(i.getUID());

					myMuItem = '<li class="markupItem" id="' + oneResult.id + '" style= "color: ' + oneResult.color + ';"> ' + oneResult.label + '</li> ';
					domConstruct.place(myMuItem,muList);
				});
				query(".markupItem").on("click", myMarkupObject.onClick);  
			}
		}).then(function(){
			baseFx.fadeIn({ node: dom.byId("markupAreaDiv") }).play();			
		});
	},
	


    createNewMarkUp = function() {
    	var muNode, adjustButton,i, oneResult = new Object(); ; 
    	
		placeOnMarkup(markupFormTemplate);
		muNode = dom.byId("markupForm");
		domConstruct.empty(muNode);
    	 
		muNode = dom.byId("markupForm");
		
		placeOnMarkup(domConstruct.create("div", {id: "markupFormLabel", innerHTML:"Markup Info"}));	

		domConstruct.place('<div> X &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: <input type="text" id="mTBx"  /><br> </div>',muNode);
		domConstruct.place('<div> Y &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: <input type="text" id="mTBy"  /><br> </div>',muNode);
		domConstruct.place('<div> Radius : <input type="text" id="mTBr"  /><br> </div>',muNode);
		domConstruct.place('<div> Label &nbsp;&nbsp;&nbsp;: <input type="text" id="mTBlbl"  /><br> </div>',muNode);
		domConstruct.place('<div> Color &nbsp;&nbsp;&nbsp;: <input type="text" id="mTBcolor"  /><br> </div>',muNode);
		
		adjustButton = domConstruct.create("button", {id: "adjustButton", innerHTML:"Adjust markup"});
		placeOnMarkup(adjustButton);
		
		on(adjustButton,"click",function(e){
			
			oneResult.x = domAttr.get("mTBx", "value");
			oneResult.y = domAttr.get("mTBy", "value");
			oneResult.size = domAttr.get("mTBr", "value");
			oneResult.color = domAttr.get("mTBcolor", "value");
			i.setShape({cx: oneResult.x, cy: oneResult.y, r: oneResult.size})
			if (typeof(i) === 'object') {

			};
			console.log(i);
//			alert(e);
		});	
		
		
		var handle = imageOnSurface.connect("onclick",function(e) {
			  domAttr.set("mTBx", "value", e.layerX);
			  domAttr.set("mTBy", "value", e.layerY);
			  domAttr.set("mTBr", "value", 15);
			  domAttr.set("mTBcolor", "value", "blue");

			i = surface.createCircle({ cx: e.layerX, cy: e.layerY, r: 15 }).setStroke({style: "Dash", width:3, cap:"butt", color: "blue"});
		//	console.log("X: ",e.layerX,"Y: ",e.layerY);
		
			
		
		// --------   below works for saving (put) clicked spot to db
			// markupStore.put({
				// fk_photos: myPhotoObject.photoId,
				// x: e.layerX,
				// y: e.layerY,
				// size: 15,
				// label: 'from markupStore.post()',
				// color: 'black'
			// });
			// console.log("handle: ", handle);
		 	imageOnSurface.disconnect(handle);
			// console.log("handle: ", handle);
		// --------   above works for saving (put) clicked spot to db
		
		});	
	//	console.log("handle: ", handle);
	//	console.log("new markup Photo : " + myPhotoObject.photoId);
   },

    createNewComment = function() {
		console.log("new comment,  Photo : " + myPhotoObject.photoId);
	},

	clickMarkUpItem = function(id) {
		var muNode, commNode, myCommentItem;
		muNode = dom.byId("markupForm");

		if (muNode) {
//			console.log("have muNode, emptying it");
			domConstruct.empty(muNode);
		} else {
//			console.log("do not have muNode, creating one");
			placeOnMarkup(markupFormTemplate);
			muNode = dom.byId("markupForm");
		}

		placeOnMarkup(commentButton);

		markupStore.query("/" + id).then(function(markup){

			placeOnMarkup(domConstruct.create("div", {id: "markupFormLabel", innerHTML:"Markup Info"}));	

			placeOnMarkup(domConstruct.create("div", {id: "commentLabel", innerHTML:"Comments"}));	

			domConstruct.place('<div> X: <input type="text" id="mTBx" value="' + markup.x + '" /><br> </div>',muNode);
			domConstruct.place('<div> Y: <input type="text" id="mTBy" value="' + markup.y + '" /><br> </div>',muNode);
			domConstruct.place('<div> Radius: <input type="text" id="mTBr" value="' + markup.size + '" /><br> </div>',muNode);
			domConstruct.place('<div> Label: <input type="text" id="mTBlbl" value="' + markup.label + '" /><br> </div>',muNode);
			domConstruct.place('<div> Color: <input type="text" id="mTBcolor" value="' + markup.color + '" /><br> </div>',muNode);

			commNode = dom.byId("commentForm");
			if (commNode) {
//				console.log("have commNode, emptying it");
				domConstruct.empty(commNode);
			} else {
//				console.log("do not have commNode, creating one");
				placeOnMarkup(commentFormTemplate);
//				domConstruct.place(commentFormTemplate, divMainNode);
				commNode = dom.byId("commentForm");
			}

			commentStore.query("/search/" + markup.fk_photos).then(function(comments){
//				console.log("have " + comments.length + " total comments;");
				var c = 0;
				arrayUtil.forEach(comments, function(Result) {
					if (Result.fk_markups == id) {
						c += 1;
						myCommentItem = lang.replace(commentItemTemplate, Result);
						domConstruct.place(myCommentItem,commNode);
					} 
				});
//				console.log("have ", c);				
			});

		});
    };//,
  
  //  renderItem = function(item, refNode, posn) {
        // summary:
        //      Create HTML string to represent the given item
 //   };
    return {
        init: function() {
            // proceed directly with startup
//            parser.parse();
            startup();
 //           console.log("end of init");
            return 0;
        }
    };
});