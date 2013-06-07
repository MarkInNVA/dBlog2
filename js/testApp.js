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
	"dijit/layout/ContentPane",
	"dojo/store/JsonRest",
	"dojo/_base/window",
	"js/module"
	],
	function(dom, domStyle, domClass, domConstruct, domGeometry, string, on, aspect, keys, lang, baseFx, registry, parser, ContentPane, JsonRest, win) {
		var store = null,
			preloadDelay = 500,
			thumbnailStore,
			itemTemplate = '<img src="${tname}"/>${Name}',
			itemClass = 'item',
			itemsById = {},
			largeImageProperty = "media.l", // path to the large image url in the store item
			thumbnailImageProperty = "media.t", // path to the thumb url in the store item
			
		startup = function() {
			// build up and initialize the UI
			initUi();
			// put up the loading overlay when the 'fetch' method of the store is called
			
			aspect.before(thumbnailStore, "query", function() {
			//	startLoading(registry.byId("tabs").domNode);
			});
		},
		myTest = function() {
			var handles = [];
				handles.push(domConstruct.create("button", {id: "adjustButton", innerHTML:"Adjust", disabled:true}));
				handles.push(domConstruct.create("button", {id: "saveMUButton", innerHTML:"Save", disabled:true}));
				handles.push(domConstruct.create("button", {id: "rotateButton", innerHTML:"Rotate", disabled:true}));
				console.dir(handles);  
		},
		endLoading = function() {
			// summary:
			// Indicate not-loading state in the UI
			baseFx.fadeOut({
				node: dom.byId("loadingOverlay"),
				onEnd: function(node){
				domStyle.set(node, "display", "none");
			}
			}).play();
		},
		startLoading = function(targetNode) {
			// summary:
			// Indicate a loading state in the UI
			 var overlayNode = dom.byId("loadingOverlay");
			 if("none" == domStyle.get(overlayNode, "display")) {
				 var coords = domGeometry.getMarginBox(targetNode || win.body());
				 domGeometry.setMarginBox(overlayNode, coords);
				// // N.B. this implementation doesn't account for complexities
				// // of positioning the overlay when the target node is inside a
				// // position:absolute container
				 domStyle.set(dom.byId("loadingOverlay"), {
					 display: "block",
					 opacity: 1
				 });
			 }
		},
		initUi = function() {
			// summary:
			// create and setup the UI with layout and widgets
			
			thumbnailStore = new JsonRest({
				target: "api/photos"
			});
			
			thumbnailStore.query().then(function(photo){
				console.log(photo);
				 
			});


			
			endLoading();
		},
		doSearch = function() {
			// summary:
			// inititate a search for the given keywords
			var terms = dom.byId("searchTerms").value;
			if(!terms.match(/\w+/)){
				return;
			}
			var listNode = createTab(terms);
			var results = store.fetch({
			query: lang.delegate(flickrQuery, {
				text: terms
			}),
			count: 10,
			onItem: function(item){
				// first assign and record an id
				// render the items into the <ul> node
				var node = renderItem(item, listNode);
			},
			onComplete: endLoading
			});
		},
		showImage = function (url, originNode){
			// summary:
			// Show the full-size image indicated by the given url
			lightbox.show({
				href: url, origin: originNode
			});
		},
		createTab = function (term, items) {
			// summary:
			// Handle fetch results
			var contr = registry.byId("tabs");
			var listNode = domConstruct.create("ul", {
				"class": "demoImageList",
				"id": "panel" + contr.getChildren().length
			});
			// create the new tab panel for this search
			var panel = new ContentPane({
				title: term,
				content: listNode,
				closable: true
			});
			contr.addChild(panel);
			// make this tab selected
			contr.selectChild(panel);
			// connect mouse click events to our event delegation method
			var hdl = on(listNode, "click", onListClick);
			return listNode;
		},
		showItemById = function (id, originNode) {
			var item = itemsById[id];
			if(item) {
				showImage(lang.getObject(largeImageProperty, false, item), originNode);
			}
		},
		onListClick = function (evt) {
			var node = evt.target,
			containerNode = registry.byId("tabs").containerNode;
			for(var node = evt.target; (node && node !==containerNode); node = node.parentNode){
				if(domClass.contains(node, itemClass)) {
					showItemById(node.id.substring(node.id.indexOf("_") +1), node);
					break;
				}
			}
		},
		renderItem = function(item, refNode, posn) {
			// summary:
			// Create HTML string to represent the given item
			itemsById[item.id] = item;
			var props = lang.delegate(item, {
				thumbnail: lang.getObject(thumbnailImageProperty, false, item)
			});
			return domConstruct.create("li", {
				"class": itemClass,
				id: refNode.id + "_" + item.id,
				innerHTML: string.substitute(itemTemplate, props)
			}, refNode, posn);
		};
		return {
			init: function() {
			//	startLoading();
				// register callback for when dependencies have loaded
			//	startup();
			myTest();
			}
		};
});
