define([
	"dojo/dom", "dojo/dom-construct", "dojo/dom-attr", "dojo/on",  "dojo/_base/fx",
    "dojo/_base/array", "dojo/_base/lang", "dojo/query", 
    "dojox/gfx/Moveable",  
	"dojo/store/JsonRest",
	"js/util", "js/thumbnail2", "dojo/topic", "js/module"
	], 

function( dom, domConstruct, domAttr, on, baseFx,
         arrayUtil, lang, query,  //gfx, 
         mover,
         JsonRest, 
         util, thumbnail, topic

	) {
	"use strict";
    var markupStore,
		commentStore,

		myMarkupObject,
		currentPhotoId,

		thumbnailTemplate = '<div>Name : {Name}\n<img class="thumbnail" id="{id}" src="img/{tname}"/><hr></div>',
		
		markupAreaTemplate = '<div id="markupAreaDiv" >  </div>',
		markupFormTemplate = '<div id="markupForm" >  </div>',  // ???????

		commentFormTemplate = '<ul id="commentForm"> </ul>',
		commentItemTemplate = '<li class="commentItem">Received : {recv_date}, From: {from}<br>{comment} </li> '  ,

		markupListTemplate = '<ul id="markupList" class="mulc"> </ul>',
		markUpButton,
		commentButton,
		

		divMainNode = dom.byId("main"),
		
		surface,
		imageOnSurface,
		divSurfaceElement,
    	backToStartButton = domConstruct.create("button", {id: "back2Start", innerHTML:"Select Photo"}),


		handleBackToStart = on(backToStartButton, "click", function(evt){
			util.clearMain();
			setTimeout(function(){
				onEnd: {
					thumbnail.createPickPhotoPage();	
					util.showMain();
				}
    		//	console.log("in back to start on timeout");
			}, 1000);
		}),
		
    startup = function() {
		// create objects, stores, a couple buttons, then go to createPickPhotoPage

		myMarkupObject= {
			id: "myMarkupObject", 
			photoId: 0,
			mkarkupID: 0,
			onClick: function() {
				clickMarkUpItem(this.id);
			}
		};
			
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
		
		topic.subscribe("thumbnail", function(photoId){
			currentPhotoId = photoId;
			util.clearMain();//.then(function(){
			setTimeout(function(){
				onEnd: {
					console.log("Just before putPhotoOnSurface (app)")
					thumbnail.putPhotoOnSurface(photoId); 
					console.log("Just after putPhotoOnSurface  (app)" )
					util.placeOnFooter(backToStartButton);
    	//			console.log("in thumbnail subscribe timeout");
    		//		console.log(imageOnSurface);
					paintMarkupScreen(photoId);
					util.showMain();
				}
			}, 1000);	
								
//			console.log("in doit subsctibe");
		})
	//	console.log("in bottom of doit");
		thumbnail.createPickPhotoPage();	
		util.showMain();
    },
      
	paintMarkupScreen = function(photoID) {
		var muList, myMuItem, markupAreaDiv; //	, markupAreaTemplate = '<div id="markupAreaDiv" >  </div>'
	//	console.log("Start of paintMarkupScreen");
		
		util.placeOnMain('<div id="markupAreaDiv" >  </div>');				
//		util.placeOnSurface(markupAreaTemplate);
//		util.placeOnMarkup(markupListTemplate);
		muList	= domConstruct.create("ul", {id: "markupList", class: "mulc"},"markupAreaDiv");
		
		util.placeOnMarkup(markUpButton);
// 
		markupStore.query("/search/" + photoID).then(function(markups){
			if (markups === 0) {
				 domConstruct.place('<li class="markupItem">None</li>',muList);								
	//			console.log("no markups"); 
			} else  {
	//			console.log("have " + markups.length + " markups;");
				 arrayUtil.forEach(markups, function(oneResult) {
// 
					thumbnail.putShapeOnSurface(oneResult);
// //					var i = surface.createCircle({ cx: oneResult.x, cy: oneResult.y, r: oneResult.size }).setStroke({style: "Dash", width:3, cap:"butt", color:oneResult.color});
				// //	console.log(i.getUID());
// 
					 myMuItem = '<li class="markupItem" id="' + oneResult.id + '" style= "color: ' + oneResult.color + ';"> ' + oneResult.label + '</li> ';
					 domConstruct.place(myMuItem,muList);
				 });
				 query(".markupItem").on("click", myMarkupObject.onClick);  
			}
		}); //.then(function(){
		//	baseFx.fadeIn({ node: dom.byId("markupAreaDiv") }).play();			
	//	});
//		console.log("End of paintMarkupScreen");
	},
	


    createNewMarkUp = function() {
    	var muNode, i, oneResult = {}; // adjustButton,  
    	oneResult = {};
		util.placeOnMarkup(markupFormTemplate);
		muNode = dom.byId("markupForm");
		domConstruct.empty(muNode);
    	 
		muNode = dom.byId("markupForm");
		
		util.placeOnMarkup(domConstruct.create("div", {id: "markupFormLabel", innerHTML:"Markup Info"}));	

		domConstruct.place('<div> X &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: <input type="text" id="mTBx"  /><br> </div>',muNode);
		domConstruct.place('<div> Y &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: <input type="text" id="mTBy"  /><br> </div>',muNode);
		domConstruct.place('<div> Radius X: <input type="text" id="mTBrx"  /><br> </div>',muNode);   //Temp
		domConstruct.place('<div> Radius Y: <input type="text" id="mTBry"  /><br> </div>',muNode);   //Temp
// orig		domConstruct.place('<div> Radius : <input type="text" id="mTBr"  /><br> </div>',muNode);   
		domConstruct.place('<div> Label &nbsp;&nbsp;&nbsp;: <input type="text" id="mTBlbl"  /><br> </div>',muNode);
		domConstruct.place('<div> Color &nbsp;&nbsp;&nbsp;: <input type="text" id="mTBcolor"  /><br> </div>',muNode);
		
//		adjustButton = domConstruct.create("button", {id: "adjustButton", innerHTML:"Adjust markup"});
		util.placeOnMarkup(domConstruct.create("button", {id: "adjustButton", innerHTML:"Adjust", disabled:true}));
		util.placeOnMarkup(domConstruct.create("button", {id: "saveMUButton", innerHTML:"Save", disabled:true}));
		util.placeOnMarkup(domConstruct.create("button", {id: "rotateButton", innerHTML:"Rotate", disabled:true}));   // temp
		
		on(adjustButton,"click",function(e){
			console.log("Adjusting");
			oneResult.x = domAttr.get("mTBx", "value");
			oneResult.y = domAttr.get("mTBy", "value");
// orig			oneResult.size = domAttr.get("mTBr", "value");
			oneResult.sizex = domAttr.get("mTBrx", "value");   // Temp
			oneResult.sizey = domAttr.get("mTBry", "value");   // Temp
			oneResult.color = domAttr.get("mTBcolor", "value");
//			i.setShape({cx: oneResult.x, cy: oneResult.y, r: oneResult.size})
			i.setShape({cx: oneResult.x, cy: oneResult.y, rx: oneResult.sizex, ry: oneResult.sizey})
			domAttr.set("saveMUButton", "disabled", false);
			domAttr.set("rotateButton", "disabled", false);  // temp
			// if (typeof(i) === 'object') {
			// };
			// console.log(i);
//			alert(e);
		});	
		on(rotateButton,"click", function(e){
			thumbnail.rotate(i);
		});
		on(saveMUButton,"click",function(e){
			// markupStore.put({
				// fk_photos: 	currentPhotoId,
						// x: 	domAttr.get("mTBx", "value"),
						// y: domAttr.get("mTBy", "value"),
					 // size: domAttr.get("mTBr", "value"),
					// label: domAttr.get("mTBlbl", "value"),
					// color: domAttr.get("mTBcolor", "value")
			// });
		});	
		imageOnSurface = thumbnail.getSurface();
		var handle = imageOnSurface.connect("onclick",function(e) {
			  domAttr.set("mTBx", "value", e.layerX);
			  domAttr.set("mTBy", "value", e.layerY);
// orig			  domAttr.set("mTBr", "value", 15);
			  domAttr.set("mTBrx", "value", 15);  // Temp
			  domAttr.set("mTBry", "value", 15);  // Temp
			  domAttr.set("mTBcolor", "value", "blue");
			var o = {};
			o.x = e.layerX;
			o.y = e.layerY;
			o.sizex  = 15;
			o.sizey  = 15;
			o.color = "blue";
			o.style = "Dash";
			o.width = 3; 
			o.cap = "butt";

			i = thumbnail.putNewShapeOnSurfaceTemp(o);
// orig			i = thumbnail.putNewShapeOnSurface(o);
			domAttr.set("adjustButton", "disabled", false);
			domAttr.set("saveMUButton", "disabled", false);
//			i = thumbnail.putShapeOnSurface({ cx: e.layerX, cy: e.layerY, r: 15, style: "Dash", width:3, cap:"butt", color: "blue"});
//			console.log("X: ",e.layerX,"Y: ",e.layerY);
		
			
		
		// --------   below works for saving (put) clicked spot to db
			// console.log("handle: ", handle);
		 	imageOnSurface.disconnect(handle);
			// console.log("handle: ", handle);
		// --------   above works for saving (put) clicked spot to db
		
		});	
	//	console.log("handle: ", handle);
	//	console.log("new markup Photo : " + myPhotoObject.photoId);
   },

    createNewComment = function() {
//		console.log("new comment,  Photo : " + myPhotoObject.photoId);
	},

	clickMarkUpItem = function(id) {
		var muNode, commNode, myCommentItem;
		muNode = dom.byId("markupForm");

		if (muNode) {
//			console.log("have muNode, emptying it");
			domConstruct.empty(muNode);
		} else {
//			console.log("do not have muNode, creating one");
			util.placeOnMarkup(markupFormTemplate);
			muNode = dom.byId("markupForm");
		}

		util.placeOnMarkup(commentButton);
		console.log("Doing markupStore query /",id);
		markupStore.query("/" + id).then(function(markup){

			util.placeOnMarkup(domConstruct.create("div", {id: "markupFormLabel", innerHTML:"Markup Info"}));	

			util.placeOnMarkup(domConstruct.create("div", {id: "commentLabel", innerHTML:"Comments"}));	

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
				util.placeOnMarkup(commentFormTemplate);
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