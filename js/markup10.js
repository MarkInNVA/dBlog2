define([
        "dojo/dom", "dojo/dom-construct", "dojo/dom-style", "dojo/on", "dojox/gfx", 
        "dojox/gfx/fx", "dojo/dom-attr", "dojo/query", "dojo/topic", 
        "dojo/_base/array", "dojo/store/JsonRest", "dojo/_base/lang",
        "js/util10","js/thumbnail10",

    ],

    function ( dom, domConstruct, domStyle, on, gfx,   gfxFx, domAttr, query, topic,    arrayUtil, JsonRest, lang,    util, thumbnail ) 
    {
        "use strict";
        var markupStore = new JsonRest({
            target: "api/index.php/markup"
        }),

        myMarkupObject = {
            id: "myMarkupObject",
            photoId: 0,
            mkarkupID: 0,
            onClick: function () {
                clickMarkUpItem(this.id);
            }
        },
        


        commentStore = new JsonRest({
			target: "api/index.php/comment"
        }),

		buildMarkupFormNew,

        
        markupFormTemplate = '<div id="markupForm" >  </div>',
        
        commentFormTemplate = '<ul id="commentForm"> </ul>',
        commentItemTemplate = '<li class="commentItem">Received : {recv_date}, From: {from}<br>{comment} </li> ',  

        
        imageOnSurface, commentButton, markupButton, muList, muNode;
                

        return {
            buildMarkupFormNew : function() {
                  util.placeOnMarkup(markupFormTemplate);    //           markupFormTemplate = '<div id="markupForm" >  </div>',
                muNode = dom.byId("markupForm");
                domConstruct.empty(muNode);

                muNode = dom.byId("markupForm");

                util.placeOnMarkup(domConstruct.create("div", { id: "markupFormLabel", innerHTML: "Markup Info" }));

                domConstruct.place('<div> X &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: <input type="text" id="mTBx"  /><br> </div>', muNode);
                domConstruct.place('<div> Y &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: <input type="text" id="mTBy"  /><br> </div>', muNode);
                domConstruct.place('<div> Radius X: <input type="text" id="mTBrx"  /><br> </div>', muNode); //Temp
                domConstruct.place('<div> Radius Y: <input type="text" id="mTBry"  /><br> </div>', muNode); //Temp
                // orig		domConstruct.place('<div> Radius : <input type="text" id="mTBr"  /><br> </div>',muNode);   
                domConstruct.place('<div> Label &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: <input type="text" id="mTBlbl"  /><br> </div>', muNode);
                domConstruct.place('<div> Color &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: <input type="text" id="mTBcolor"  /><br> </div>', muNode);

                //		adjustButton = domConstruct.create("button", {id: "adjustButton", innerHTML:"Adjust markup"});
                util.placeOnMarkup(domConstruct.create("button", { id: "adjustButton", innerHTML: "Adjust", disabled: true }));
                util.placeOnMarkup(domConstruct.create("button", { id: "saveMUButton", innerHTML: "Save"  , disabled: true }));
  //              util.placeOnMarkup(domConstruct.create("button", { id: "rotateButton", innerHTML: "Rotate", disabled: true })); // temp
          	
            },
             buildMarkupFormSetup : function() {
                markupButton = domConstruct.create("button", { id: "markupButton", innerHTML: "Add markup" });
                var t = lang.hitch(buildMarkupFormNew,this);
                on(markupButton, "click", function(e) {
                	console.log("t:",t);
               // 	console.log("in markup button on, e:",e);
  //              	return 
                	t.buildMarkupFormNew();
                	t.createNewMarkUp();
				});
                util.placeOnMain('<div id="markupAreaDiv" >  </div>');
                
                util.placeOnMarkup(markupButton);
 
                muList = domConstruct.create("ul", { id: "markupList", className: "mulc" }, "markupAreaDiv");
           	
            },            
            buildMarkupFormOld : function() {
            	
            },       	
            createMarkupPage: function (photoId) {
                var  myMuItem;  //, markupAreaDiv; //	, markupAreaTemplate = '<div id="markupAreaDiv" >  </div>'
                
                console.log("Start of createMarkupPage");
                
				myMarkupObject.photoId = photoId;

				this.buildMarkupFormSetup();

                markupStore.query("/search/" + photoId).then(function (markups) {
                    if (markups === 0) {
                        domConstruct.place('<li class="markupItem">None</li>', muList);
                        //			console.log("no markups"); 
                    } else {
                        //			console.log("have " + markups.length + " markups;");
                        arrayUtil.forEach(markups, function (oneResult) { 
                            thumbnail.putShapeOnSurface(oneResult);
                            // //					var i = surface.createCircle({ cx: oneResult.x, cy: oneResult.y, r: oneResult.size }).setStroke({style: "Dash", width:3, cap:"butt", color:oneResult.color});
                            // //	console.log(i.getUID());
                            myMuItem = '<li class="markupItem" id="' + oneResult.id + '" style= "color: ' + oneResult.color + ';"> ' + oneResult.label + '</li> ';
                            domConstruct.place(myMuItem, muList);
                        });
                        query(".markupItem").on("click", myMarkupObject.onClick);
                    }
                });
            },

            createNewMarkUp : function () {
            	console.log("createNewMarkup!")
                var i, oneResult = {}; // adjustButton,  

                domAttr.set("markupButton", "disabled", true);

			//	this.buildMarkupFormNew();
				
                on(adjustButton, "click", function () {
                    console.log("Adjusting");
                    oneResult.x = domAttr.get("mTBx", "value");
                    oneResult.y = domAttr.get("mTBy", "value");
                    // orig			oneResult.size = domAttr.get("mTBr", "value");
                    oneResult.sizex = domAttr.get("mTBrx", "value"); // Temp
                    oneResult.sizey = domAttr.get("mTBry", "value"); // Temp
                    oneResult.color = domAttr.get("mTBcolor", "value");
                    //			i.setShape({cx: oneResult.x, cy: oneResult.y, r: oneResult.size})
                    i.setShape({ cx: oneResult.x, cy: oneResult.y, rx: oneResult.sizex, ry: oneResult.sizey });
                    
                    domAttr.set("saveMUButton", "disabled", false);
                });

                on(saveMUButton, "click", function () {
                    // markupStore.put({
                    // fk_photos: currentPhotoId,
                    // x: domAttr.get("mTBx", "value"),
                    // y: domAttr.get("mTBy", "value"),
                    // size: domAttr.get("mTBr", "value"),
                    // label: domAttr.get("mTBlbl", "value"),
                    // color: domAttr.get("mTBcolor", "value")
                    // });
              //      util.clearMarkup();
                    topic.publish("paintMarkupScreen",myMarkupObject.photoId);
                    console.log("publishing paintMarkupScreen, argument is photoId :", myMarkupObject.photoId);
//                    createMarkupPage(myMarkupObject.photoId);
                    // domAttr.set("adjustButton", "disabled", false);
                    // domAttr.set("saveMUButton", "disabled", false);
                });
                
                imageOnSurface = thumbnail.getSurface();
	                var handle = imageOnSurface.connect("onclick", function (e) {
	                    domAttr.set("mTBx", "value", e.layerX);
	                    domAttr.set("mTBy", "value", e.layerY);
	                    // orig domAttr.set("mTBr", "value", 15);
	                    domAttr.set("mTBrx", "value", 15); // Temp
	                    domAttr.set("mTBry", "value", 15); // Temp
	                    domAttr.set("mTBcolor", "value", "blue");
	                    var o = {};
	                    o.x = e.layerX;
	                    o.y = e.layerY;
	                    o.sizex = 15;
	                    o.sizey = 15;
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
            },    

         }
            function clickMarkUpItem(id) {
                var  commNode, myCommentItem;
                muNode = dom.byId("markupForm");

                if (muNode) {
                    //			console.log("have muNode, emptying it");
                    domConstruct.empty(muNode);
                } else {
                    //			console.log("do not have muNode, creating one");
                    util.placeOnMarkup(markupFormTemplate);    //           markupFormTemplate = '<div id="markupForm" >  </div>',
                    muNode = dom.byId("markupForm");
                }
                commentButton = domConstruct.create("button", { id: "commentButton", innerHTML: "Add comment" });
                on(commentButton, "click", createNewComment);
                util.placeOnMarkup(commentButton);
                
                
                console.log("Doing markupStore query /", id);
                markupStore.query("/" + id).then(function (markup) {

                    util.placeOnMarkup(domConstruct.create("div", { id: "markupFormLabel", innerHTML: "Markup Info" }));

                    util.placeOnMarkup(domConstruct.create("div", { id: "commentLabel"   , innerHTML: "Comments"    }));

                    domConstruct.place('<div> X: <input type="text" id="mTBx" value="' + markup.x + '" /><br> </div>', muNode);
                    domConstruct.place('<div> Y: <input type="text" id="mTBy" value="' + markup.y + '" /><br> </div>', muNode);
                    domConstruct.place('<div> Radius: <input type="text" id="mTBr" value="' + markup.size + '" /><br> </div>', muNode);
                    domConstruct.place('<div> Label: <input type="text" id="mTBlbl" value="' + markup.label + '" /><br> </div>', muNode);
                    domConstruct.place('<div> Color: <input type="text" id="mTBcolor" value="' + markup.color + '" /><br> </div>', muNode);

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

                    commentStore.query("/search/" + markup.fk_photos).then(function (comments) {
                        //				console.log("have " + comments.length + " total comments;");
                        var c = 0;
                        arrayUtil.forEach(comments, function (Result) {
                            if (Result.fk_markups == id) { // does === work here?
                                c += 1;
                                myCommentItem = lang.replace(commentItemTemplate, Result);
                                domConstruct.place(myCommentItem, commNode);
                            }
                        });
                        //				console.log("have ", c);				
                    });

                });
            }; //,
            


            function createNewComment() {
                //		console.log("new comment,  Photo : " + myPhotoObject.photoId);
            };
    }
);