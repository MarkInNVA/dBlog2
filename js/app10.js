define([
    "dojo/dom", "dojo/dom-construct", "dojo/dom-attr", "dojo/on", // "dojo/_base/fx",
    "dojo/_base/array", "dojo/_base/lang", "dojo/query",
   // "dojox/gfx/Moveable",  
    "dojo/store/JsonRest",
     "js/util10", "js/thumbnail10", "js/markup10", "dojo/topic", "js/module"
],
    function (dom, domConstruct, domAttr, on, // baseFx,
        arrayUtil, lang, query, //gfx, 
        //     mover,
        JsonRest,
        util, thumbnail, markup, topic
    ) {
        "use strict";
        var commentStore, myMarkupObject, currentPhotoId,

            //        thumbnailTemplate = '<div>Name : {Name}\n<img class="thumbnail" id="{id}" src="img/{tname}"/><hr></div>',
            //      markupAreaTemplate = '<div id="markupAreaDiv" >  </div>',
            //     markupListTemplate = '<ul id="markupList" class="mulc"> </ul>',
            //      divMainNode = dom.byId("main"),
            //      surface,
            //        divSurfaceElement,
            
            markupFormTemplate = '<div id="markupForm" >  </div>', // ???????
            commentFormTemplate = '<ul id="commentForm"> </ul>',
            commentItemTemplate = '<li class="commentItem">Received : {recv_date}, From: {from}<br>{comment} </li> ',

            commentButton,  imageOnSurface,
            
            backToStartButton = domConstruct.create("button", { id: "back2Start", innerHTML: "Select Photo" }),

            handleBackToStart = on(backToStartButton, "click", function () {
                util.clearMain();
                setTimeout(function () {
                    onEnd: {
                        thumbnail.createPickPhotoPage();
                        util.showMain();
                    }
                    //	console.log("in back to start on timeout");
                }, 1000);
            }),

            startup = function () {
                // create objects, stores, a couple buttons, then go to createPickPhotoPage


                commentStore = new JsonRest({
                    target: "api/index.php/comment"
                });


                commentButton = domConstruct.create("button", { id: "commentButton", innerHTML: "Add comment" });
                on(commentButton, "click", createNewComment);

                topic.subscribe("thumbnail", function (photoId) {
                    currentPhotoId = photoId;
                    
                    util.clearMain(); //.then(function(){
                    
                    setTimeout(function () {
                        onEnd: {
                            //				console.log("Just before putPhotoOnSurface (app)")
                            thumbnail.putPhotoOnSurface(photoId);
                            //				console.log("Just after putPhotoOnSurface  (app)" )

                            util.placeOnMain(backToStartButton);

                            paintMarkupScreen(photoId);
                            util.showMain();
                        }
                    }, 1000);
         //			console.log("in doit subsctibe");
                });
                //	console.log("in bottom of doit");
                
                thumbnail.createPickPhotoPage();
                util.showMain();
            },

            paintMarkupScreen = function (photoID) {
            	markup.createMarkupPage(photoID)
            },


            createNewComment = function () {
                //		console.log("new comment,  Photo : " + myPhotoObject.photoId);
            };


        //  renderItem = function(item, refNode, posn) {
        // summary:
        //      Create HTML string to represent the given item
        //   };
        return {
            init: function () {
                // proceed directly with startup
                //            parser.parse();
                startup();
                //           console.log("end of init");
                return 0;
            }
        };
    });