define(["dojo/_base/declare","dijit/_WidgetBase", "dijit/_TemplatedMixin", "dojo/text!./templates/photoWidget.html", 
		"dojo/topic", "dojo/dom", "dojox/gfx", "dojo/store/JsonRest", "dojo/_base/array", 
		"dijit/form/Button","dijit/Dialog", "dijit/form/Form", "dijit/form/TextBox", 
		"dojo/dom-construct", "dojo/when", "dojo/query",
		"custom/titleWidget/titleWidget" , "custom/markupWidget/markupWidget", "dojo/dom-construct", "dojo/_base/lang",
		"dojo/on", "dojo/keys", "dojo/parser", "dojo/NodeList-dom" 
		],
    function(declare, WidgetBase, TemplatedMixin, template, 
    		 topic, dom, gfx, JsonRest, arrayUtil, 
    		 dButton, dDialog, dForm, dTextBox,
    		 donConstruct, when, query,
    		 TitleWidget , MarkupWidget, domConstruct, lang,
    		 on, keys, parser
    		) {
        return declare([WidgetBase, TemplatedMixin], {
        	Name: "No Name",
        	Description: "No Description",
            templateString: template,
            baseClass: "photoWidget",
 
   			postCreate: function(){
   				var _markups = []; //, muWidget, titleWidget; 
   				var desc, addButton, saveButton, image, photoId, theSurface, dialog, locData, localTheData,
   					surfaceHandle, addMUHandle, saveMUHandle, reallySaveHandle, haveMUHandle, markupClickedHandle, quitSaveHandle;
   				
   				if (this.theData.description == null){ desc = 'No Description' } else { desc = this.theData.description; }
   				
   				this.titleNode.innerHTML = "Name : " + this.theData.Name + "<hr>Description : " + desc ;
   				this.markupNode.innerHTML = "Current Markups<hr/> ";
				this.inherited(arguments);   // Run any parent postCreate processes - can be done at any point
				photoId = this.theData.id;
				localTheData = this.theData;
				
			//	fetchMarkups(this.theData.id, _markups);
				dialog = setUpDialog();
				
				quitSaveHandle = topic.subscribe("quitSaving", function() {
					theSurface.clear(false);
					image = theSurface.createImage({ x: 0, y: 0, width: ( localTheData.fx / 2), height: ( localTheData.fy / 2), src: "img/" + localTheData.fname });
					refreshSurface( _markups, theSurface, true);
				});
				
				markupClickedHandle = topic.subscribe("markupClicked", function( theMuId, thePath ) {
					var path;
					// console.log("markupClickedHandle,  id,path : ",theMuId, thePath);
            		refreshSurface( _markups, theSurface, false);
					path = gfx.shape.byId(thePath);
					path.setFill(null).setStroke({ color: "green", width: 4 });
				});
				
   				addMUHandle = topic.subscribe("addMarkup",function() { 
   		//			console.log("add markup!")
	   				addMarkUp(photoId, theSurface, image) ;
   				});
   					
   				haveMUHandle = topic.subscribe("haveMuLoc", function(arrayData) {
   					locData = arrayData;
   					dialog.show();
	   	//			console.log("haveMuLoc arratData :",arrayData);					
   				});
   				
   				topic.subscribe("markupIsSaved", function() {
	   				refreshSurface( _markups, theSurface, true)	   					   					
   				});
   				
   				reallySaveHandle = topic.subscribe("reallySave", function(){
	   				saveMarkUp(photoId, locData);   
   				});
   				
           		addButton = new dButton({
           			label:"Add markup",
           			onClick: function() { topic.publish("addMarkup");},
           		}, "mu_addButton");
           		
				surfaceHandle = topic.subscribe("haveSurface", function( data, surface )  {
					theSurface = surface;
                	image = surface.createImage({ x: 0, y: 0, width: ( data.fx / 2), height: ( data.fy / 2), src: "img/" + data.fname });
                	_markups = paintMarkUps( data, surface );
	            	surfaceHandle.remove();
	     //       	console.log("main, markups :",_markups)
              });
				
	            createSurface(this.theData, this.domNode);                  
			},
			runMe : function(){
    		alert("Hi");
				
			}
        });
        
		function createSurface(data, node) {
				var surface = gfx.createSurface(node, ( (data.fx /2) + 10 ) , ( (data.fy /2) + 25 ) );

	            surface.whenLoaded(function () {
	                topic.publish( "haveSurface", data, surface );
	            });
    	};   
    	function refreshSurface( markups, theSurface, addShape) {
    		var target, paths = markups[1];
    //		console.log("refreshSurface  markups :", markups);	
    		
    		arrayUtil.forEach(paths, function (path) { 
    			target = gfx.shape.byId(path[1]);
    			if (addShape === true) {
    				theSurface.add(target);
    			};
				target.setFill(null).setStroke({color :"red", width : 3});
			});
			query(".markupWidget").style("color", "red");
			// query(".markupWidget").forEach(function(node, index, nodelist){
            	// // for each node in the array returned by query,
            	// // execute the following code
            	// domClass.add(node, "red");
        	// });
    	};
    	
    	function paintMarkUps(data, surface) {
    		var thisSurface, path, a=[], aMarkups=[], widget, dPath, aAnswer=[],
    			markupStore = new JsonRest({ target: "api/index.php/markup" }),
				markupLocStore = new JsonRest({ target: "api/index.php/markuploc" });  
    			
            thisSurface = surface;    

            markupStore.query("/search/" + data.id).then(function (markups) {
// -------------
                arrayUtil.forEach(markups, function (oneMU) {
	        
	        //            console.log("have  markupLocs;");
//                        widget = new MarkupWidget(oneMU).placeAt("markupNodee");
                        dPath={};
						markupLocStore.query("/" + oneMU.fk_photos + "/" + oneMU.id).then(function (markupLocs) {
							if (markupLocs.length === 0) {
						//		console.log("no markupLocs"); 
	                		} else {          	
	                	//		console.log("have " + markupLocs.length + " markupLocs;");
			                	path = surface.createPath().setFill(null).setStroke({color :"red", width : 3});  
			               // 	dPath = path.getUID(); 
			                	aMarkups.push(path);             
								path.moveTo(markupLocs[0].x, markupLocs[0].y);
									
			                	arrayUtil.forEach(markupLocs, function (oneMULoc) { 
									path.lineTo(oneMULoc.x, oneMULoc.y);
									//	a.push([pid, mid + 1, oneMULoc.x, oneMULoc.y]);
			                	}, paintMarkUps);
			                    
			                	path.closePath();
	                	a.push([oneMU.label,path.getUID()]);
	                	oneMU.path = path.getUID();
                        widget = new MarkupWidget(oneMU).placeAt("markupNodee");
			            	}
			            });
			          		
                	 
            	});
// -------------
    		});
    		aAnswer.push(aMarkups,a)
    //		console.log("aAnswer :",aAnswer)
    //		return aMarkups;
    		return aAnswer;
    	}; 
    	
    	// a.push([pid, mid + 1, loc.x, loc.y]);
    	function setUpDialog() {
		    var dlg = new dDialog({
        		id: 'foobar',
        		"title": "New Markup",
        		"style": "width: 300px; "   //height:300px;
    		}).placeAt("mu_Dialog");


    		var actionBar = dojo.create("div", {
        		"class": "dijitDialogPaneContentArea",
        //		"style": "width: 250px; height:220px;",
        		"innerHTML": "<label for='description'>Label : </label> <input type='text' value='' id='mu_label' name='Description' dojoType='dijit.form.TextBox'>"
//        		"innerHTML": "<label for='description'>Description : </label> <textarea rows='5' cols='55' value='hi' id='description' name='Description' dojoType='dijit.form.TextBox'>"
    		}, dlg.containerNode);
    		var actionBar = dojo.create("div", {
        		"class": "dijitDialogPaneActionBar"
    		}, dlg.containerNode);

    		new dButton({
        		"label": "Ok",
        		onClick: function() {
        			var t = dom.byId("mu_label");
        			var tt = t.value;
        		//	console.log("NOT SAVED!!! button talk!", tt);
        			dlg.hide();
        			topic.publish("reallySave");   			// publish really save here?
        		}
    		}).placeAt(actionBar);
    		
    		new dButton({
        	"label": "Cancel",
        		onClick: function() { 
        			dlg.hide();
        			topic.publish("quitSaving");
        		}
    		}).placeAt(actionBar);

    		
    		dlg.startup();
    		return dlg;
//    		dlg.show();    		
    	};
    	
    	function test() {
			console.log("test, called from setUpDialog");
    	};
    	function saveMarkUp(photoId, aData) {
    		var markupStore, markupLocStore, muLabel, putID; 
    		
    		markupStore = new JsonRest({ target: "api/index.php/markup" }), test;
			muLabel = dom.byId("mu_label").value; // is this availabe yet?
    		
    		putID = {};
    		putID = markupStore.put({
            	fk_photos: photoId,
                // x: 55,
                // y: 55,
                // size: 55,
                label: muLabel,
                color: "red"
            });
            when(putID, function() {
		            var  t = parseInt(putID.results[0].id);
		            var fixedArray= [];
		            arrayUtil.forEach(aData, function(item,index){
		            	fixedArray.push(
		            		 [photoId, t, item[0], item[1]]
		            	);
		            });
					var markupLocStore = new JsonRest({ target: "api/index.php/markuploc" }); 
					var ttt = markupLocStore.put( fixedArray );
		//			console.log("saveMarkUp  ttt:", ttt);            	
            });
            topic.publish("markupIsSaved");
            // fix array, put it...
    		
  //  		console.log("saveMarkUp - aData, photoId :", aData, fixedArray, photoId);
    	}
    	
    	function addMarkUp(data, surface, image) {
    		var timer, doublClickHandler, clickHandler, arry = [], path , onHandle, photoId   ;

			photoId = data;
            path = surface.createPath().setFill([0, 248, 55, 0.4]).setStroke({ color: "green", width: 2 });
             
//			onHandle = on(document, "keypress", function(e) {   // doesn't seem to work on safari or chrome on Mac
			onHandle = on(document, "keydown", function(e) {
				switch(e.keyCode) {
			 		case keys.ESCAPE:
			 			surface.rawNode.removeChild(path.rawNode);
			 			clickHandler.remove();
			 			doublClickHandler.remove();
			 			onHandle.remove();
			 			break;
			 	//		console.log('Escaped out of marking up!');
			 	}
			 }) ;
			 
			 doublClickHandler = image.connect("ondblclick", function(e) {
			 	var x, y;	
				// if this gets too close to doubleClickHandler, doesn't work right. Can keep on adding red segments

				clearTimeout(timer)
				
				x = e.offsetX === undefined ? e.layerX : e.offsetX;
				y = e.offsetY === undefined ? e.layerY :e.offsetY;
				
				timer = setTimeout(function() { 
				 //	why?
					onEnd: doublClickHandler.remove()
					clickHandler.remove();
					onHandle.remove();
				 }, 150);				
									
				 
				path.lineTo(x, y);
				path.closePath();
				path.setFill(null).setStroke({color :"red", width : 3});
	
				arry.push([x,y]);
				topic.publish("haveMuLoc", arry);
				
			 });
			
			 clickHandler = image.connect("onclick", function(e) {
				 if (timer) {
					 clearTimeout(timer);
				 }
				 timer = setTimeout(function() { 
					 //	http://stackoverflow.com/questions/11334452/event-offsetx-in-firefox
					 var x = e.offsetX === undefined ? e.layerX : e.offsetX;
					 var y = e.offsetY === undefined ? e.layerY : e.offsetY;
	
					 if (arry.length === 0) {
						 path.moveTo(x, y);		
					 } else {
						 path.lineTo(x, y);		
					 }
					 arry.push([x,y]);
				 }, 350);
			 });
    	};

});
