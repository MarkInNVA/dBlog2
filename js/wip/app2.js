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
	"js/module"
	],
function(dom, domStyle, domClass, domConstruct, domGeometry, string, on, aspect, keys, lang, baseFx, registry, parser, JsonRest, win, query) {
	
	"use strict"
    var store = null,
 		thumbnailStore,
 		markupStore,
 		myObj,		        
		thumbnailTemplate = '<img class="thumbnail" id="{id}" src="img/{tname}"/>',
		mainPhotoTemplate = '<img class="mainPhoto"  id="{id}" src="img/{fname}"/>',
		left_holder,
		
    startup = function() {
    	// create stores and load thumbnails
		myObj = {
			id: "myObject", 
			onClick: function(e) {
				setPhoto(this.id);
			}
		};
		
		thumbnailStore = new JsonRest({
			target: "api/photos"
		});
			
		thumbnailStore.query().then(function(photos){
	        initUi(photos);
	//		console.log(thumbnailStore);
		});

		markupStore = new JsonRest({
			target: "api/markup"	
		});
		
        console.log("end of startup");
    },
 
    initUi = function(myPhotoList) {
        // summary:
        // add the thumbnails to the <ul> photoList 
        // add a .onClick to each class thumbnail (see thumbnailTemplate)
        
    	var listNode = dom.byId("photoList");

    	dojo.forEach(myPhotoList, function(oneResult) {
    		var myListItem = lang.replace(thumbnailTemplate, oneResult);
    		domConstruct.place(myListItem,listNode);
    //		alert(myListItem);
    	})

		query(".thumbnail").on("click", myObj.onClick);

        console.log("end of initUI");
 
    },
    setPhoto = function(id) {
        // summary:
        //      Show the selected photo
        left_holder = dom.byId("leftPane");
        baseFx.fadeOut({
			node: dom.byId("leftPane"),
			onEnd: function(node){
		//		domStyle.set(node, "display", "none");
			}
		}).play();
		
        thumbnailStore.query("/"+id).then(function(photo){
    		var listNode = dom.byId("main");
    		domConstruct.empty(listNode);
    		var myListItem = lang.replace(mainPhotoTemplate, photo);
    		domConstruct.place(myListItem,listNode);

		});
		
		markupStore.query({fk_photos: id}).then(function(markups){
			// var w = dom.byId("mainWindow");
			// var l = dom.byId("LeftPane");
			// w.removeChild(l);
		//	m.resize({l:10});
		//	debugger;
//			alert(markups);
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
            console.log("end of init");
        }
    };
});