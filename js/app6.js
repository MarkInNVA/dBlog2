define([
	"dojo/dom", "dojo/dom-construct", "dojo/on", "dojo/_base/fx",
    "dgrid/OnDemandGrid", "dgrid/Selection", "dojo/_base/declare", 
    "dojo/_base/array", "dojo/_base/lang", "dojo/query", "dojox/gfx",
  
	// "dojo/dom-style",
	// "dojo/dom-class",
	
	// "dojo/dom-geometry",
	// "dojo/string",
	

	// "dojo/aspect",
	// "dojo/keys",
	// 
	// 
	// "dijit/registry",
	
//	"dojo/parser",

	"dojo/store/JsonRest",
	"dojo/parser",
	// "dojo/_base/window",

	// 
	// 
	// 
	// 
	// "dojo/store/Memory",
	// "dojo/data/ObjectStore",
	// 

	"js/module"
	], 
function( dom, domConstruct, on, baseFx,
         DataGrid, Selection, declare,
         arrayUtil, lang, query, gfx,
         JsonRest, parser
	//domStyle, domClass,  domGeometry, string,  
//			aspect, keys,   registry, // parser, 
	//		JsonRest, win, 
    //      Memory, ObjectStore , 
	//		Form, Button, TextBox
	) {
	"use strict";
    var // store = null,
		thumbnailStore,
		markupStore,
		commentStore,

		myPhotoObject,
		myMarkupObject,

		thumbnailTemplate = '<div>Name : {Name}\n<img class="thumbnail" id="{id}" src="img/{tname}"/><hr></div>',
//		thumbnailTemplate = '<img class="thumbnail" id="{id}" src="img/{tname}"/>',		
		mainPhotoTemplate = '<textarea rows="5" cols="55" readonly id="photoDescription">Name : {Name}\nDescription : {description} </textarea>',
		
		markupAreaTemplate = '<div id="markupAreaDiv" >  </div>',

//		markupListTemplate = '<ul id="markupList" class=mulc""> </ul>',
//		markupItemTemplate = '<li class="markupItem"> {label} </li> '  ,
		markupFormTemplate = '<div id="markupForm" >  </div>',  // ???????
//		markupFormInfoTemplate = '<div id="markupForm" >  </div>',  // ???????????
		commentListTemplate = '<ul id="commentList"> </ul>',
		commentItemTemplate = '<li class="commentItem">Received : {recv_date}, From: {from}<br>{comment} </li> '  ,

		backToStartButton,
		markUpButton,
		commentButton,

		divMainNode = dom.byId("main"),
		
		surface,
		imageOnSurface,
		divSurfaceElement,
	
		
    startup = function() {
		// create objects, stores, and a couple buttons

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

		backToStartButton = domConstruct.create("button", {id: "back2Start", innerHTML:"Select Photo"});
		on(backToStartButton,"click",createPickPhotoPage);

		markUpButton = domConstruct.create("button", {id: "markUpButton", innerHTML:"Add markup"});
		on(markUpButton,"click",createNewMarkUp);	
		
		commentButton = domConstruct.create("button", {id: "commentButton", innerHTML:"Add comment"});
		on(commentButton,"click",createNewComment);				
		
		createPickPhotoPage();  /* show them the photos & let them pick one */

    },

    clearMain =function () {  // clear div Main (large center section)
		if (imageOnSurface) {
			imageOnSurface.destroy();
		//	console.log("Destroying imageOnSurface");
		}
		if (surface) {
			surface.destroy();
		//	console.log("Destroying surface");
			surface = '';
		}

		// if (dom.byId('markupAreaDiv') != null) {
			// baseFx.fadeOut({
				// node:dom.byId('markupAreaDiv')
			// }).play();
		// }
		baseFx.fadeOut({ 
			node: dom.byId(divMainNode),
			onEnd: domConstruct.empty(divMainNode)
		}).play();
		baseFx.fadeIn({ 
			node: dom.byId(divMainNode)
		}).play(); 
	} ,

    placeOnMain =function (item) {  // add item to  div Main (large center section)
		domConstruct.place(item,divMainNode);
    } ,
    
    placeOnMarkup =function (item) {  // add item to  div Main (large center section)
		var divMarkupArea = dom.byId("markupAreaDiv");
		domConstruct.place(item,divMarkupArea);
    } ,
        
    createPickPhotoPage = function () {
		var lbl, lbl2, phList, myListItem, grid,  myGridDiv;

		clearMain();

		lbl = domConstruct.create("div", {id: "pl_label", innerHTML:"Select photo"});
		placeOnMain(lbl);

		lbl2 = domConstruct.create("div", {id: "pl_label2", innerHTML:"or row"});
		placeOnMain(lbl2);

		myGridDiv = domConstruct.create("div", {id: "photoGrid"});
		placeOnMain(myGridDiv);

		phList	= domConstruct.create("ul", {id: "photoList"});
		placeOnMain(phList);

		grid = new (declare([DataGrid, Selection]))({
			store: thumbnailStore, // a Dojo object store - css stuff for column widths, etc
			columns: [
				{label: "#", field: "id"},
				{label: "Name", field: "Name", sortable: false},
				{label: "Description", field: "description"}
			],
			selectionMode: "single"
		}, "photoGrid");
		
		grid.on("dgrid-select", function(event){
			myPhotoObject.photoId = event.rows[0].id;
			putPhotoOnSurface(event.rows[0].id);
		});

		thumbnailStore.query().then(function(resultPhotos){
			arrayUtil.forEach(resultPhotos, function(oneResult) {
				myListItem = lang.replace(thumbnailTemplate, oneResult);
				domConstruct.place(myListItem,phList);
			});

			query(".thumbnail").on("click", myPhotoObject.onClick);   // the thumbnail class is added via the template above (in forEach)
		});
    },

    putPhotoOnSurface = function(photoID) {
		var lw, lh, fw, fh, surfaceTemplate, photoDescription, markupAreaDiv, lbl;
		clearMain();
		
		thumbnailStore.query("/"+photoID).then(function(photo){

			lw = (photo.fx /2) + 10;
			lh = (photo.fy /2) + 60;
			fw = photo.fx /2;
			fh = photo.fy /2;
		
			surfaceTemplate = '<div id="surfaceElement" style= {width:"' + lw + '"}>  </div>';

			placeOnMain(surfaceTemplate);

			divSurfaceElement = dom.byId("surfaceElement");
			
			photoDescription = lang.replace(mainPhotoTemplate, photo);
			domConstruct.place(photoDescription, divSurfaceElement);			
			
			surface = gfx.createSurface("surfaceElement", lw , lh);

			imageOnSurface = surface.createImage({ x: 5, y: 40, width: fw, height: fh, src: "img/" + photo.fname }); 

			placeOnMain(backToStartButton);
			
			domConstruct.place(markupAreaTemplate, divSurfaceElement);
	        markupAreaDiv = dom.byId("markupAreaDiv");
			lbl = '<div id="markupLabel">Existing Labels</div>';

			placeOnMarkup(lbl);
						
			baseFx.fadeIn({ node: dom.byId("surfaceElement") }).play();
		
			paintMarkupScreen(photoID);
		});
	},
	paintMarkupScreen = function(photoID) {
		var // divSurfaceElement = dom.byId("surfaceElement"),
			// lbl, 
			muList, myMuItem, markupAreaDiv;	
	
		placeOnMarkup(markUpButton);
//		domConstruct.place(markUpButton, markupAreaDiv);
//		muList = '<ul id="markupList" class="mulc"> </ul>';
		muList	= domConstruct.create("ul", {id: "markupList", class: "mulc"},"markupAreaDiv");
	//	placeOnMarkup(muList);
	   	
	//	var divMarkupList = dom.byId("markupList");
		
		markupStore.query("/search/" + photoID).then(function(markups){
			if (markups === 0) {
				domConstruct.place('<li class="markupItem">None</li>',muList);								
				console.log("no markups"); 
			} else  {
				console.log("have " + markups.length + " markups;");
				arrayUtil.forEach(markups, function(oneResult) {

					var i = surface.createCircle({ cx: oneResult.x, cy: oneResult.y, r: oneResult.size }).setStroke({style: "Dash", width:3, cap:"butt", color:oneResult.color});
					console.log(i.getUID());
					myMuItem = '<li class="markupItem" id="' + oneResult.id + '" style= "color: ' + oneResult.color + ';"> ' + oneResult.label + '</li> ';
			//		domConstruct.place(myMuItem,divMarkupArea);
					domConstruct.place(myMuItem,muList);
				});
				query(".markupItem").on("click", myMarkupObject.onClick);  
			}
		}).then(function(){
			baseFx.fadeIn({ node: dom.byId("markupAreaDiv") }).play();			
		});
	},
	


    createNewMarkUp = function() {

		var handle = imageOnSurface.connect("onclick",function(e) {
		//	console.log("X: ",e.layerX,"Y: ",e.layerY);
			markupStore.put({
				fk_photos: myPhotoObject.photoId,
				x: e.layerX -7,
				y: e.layerY -7,
				size: 15,
				label: 'from markupStore.post()',
				color: 'black'
			});
			console.log("handle: ", handle);
			imageOnSurface.disconnect(handle);
			console.log("handle: ", handle);
		});	
		console.log("handle: ", handle);
		console.log("new markup Photo : " + myPhotoObject.photoId);
   },

    createNewComment = function() {
		console.log("new comment,  Photo : " + myPhotoObject.photoId);
	},

	clickMarkUpItem = function(id) {
		var muNode, lbl, lbl2, fmx, fmy, fmr, fmlbl, fmcolor, commNode, myCommentItem;
		muNode = dom.byId("markupForm");

		if (muNode) {
			console.log("have muNode, emptying it");
			domConstruct.empty(muNode);
		} else {
			console.log("do not have muNode, creating one");
			domConstruct.place(markupFormTemplate, divMainNode);
			muNode = dom.byId("markupForm");
		}

		domConstruct.place(commentButton,dom.byId("surfaceElement"));

		markupStore.query("/" + id).then(function(markup){

			lbl = domConstruct.create("div", {id: "markupFormLabel", innerHTML:"Markup Info"});
			domConstruct.place(lbl, divMainNode);	

			lbl2 = domConstruct.create("div", {id: "commentLabel", innerHTML:"Comments"});
			domConstruct.place(lbl2, divMainNode);	

			// console.log(markup);  
			fmx = '<div> X: <input type="text" id="mTBx" value="' + markup.x + '" /><br> </div>';
			fmy = '<div> Y: <input type="text" id="mTBy" value="' + markup.y + '" /><br> </div>';
			fmr = '<div> Radius: <input type="text" id="mTBr" value="' + markup.size + '" /><br> </div>';
			fmlbl = '<div> Label: <input type="text" id="mTBlbl" value="' + markup.label + '" /><br> </div>';
			fmcolor = '<div> Color: <input type="text" id="mTBcolor" value="' + markup.color + '" /><br> </div>';

			domConstruct.place(fmx,muNode);
			domConstruct.place(fmy,muNode);
			domConstruct.place(fmr,muNode);
			domConstruct.place(fmlbl,muNode);
			domConstruct.place(fmcolor,muNode);

			commNode = dom.byId("commentList");
			if (commNode) {
				console.log("have commNode, emptying it");
				domConstruct.empty(commNode);
			} else {
				console.log("do not have commNode, creating one");
				domConstruct.place(commentListTemplate, divMainNode);
				commNode = dom.byId("commentList");
			}

			commentStore.query("/search/" + markup.fk_photos).then(function(comments){
				console.log("have " + comments.length + " total comments;");
				var c = 0;
				arrayUtil.forEach(comments, function(Result) {
					if (Result.fk_markups === id) {
						c += 1;
						myCommentItem = lang.replace(commentItemTemplate, Result);
						domConstruct.place(myCommentItem,commNode);
					} 
				});
				console.log("have ", c);				
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
            startup();
 //           console.log("end of init");
            return 0;
        }
    };
});