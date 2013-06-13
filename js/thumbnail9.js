define([
        "dojo/dom", "dojo/dom-construct", "dojo/dom-style", "dojo/on", "dojox/gfx", "dojox/gfx/fx", "js/util9",
        "dgrid/OnDemandGrid", "dgrid/Selection", "dojo/_base/declare",
        "dojo/_base/array", "dojo/store/JsonRest", "dojo/_base/lang",
        "dojo/query", "dojo/topic" 
    ],

    function (dom, domConstruct, domStyle, on, gfx, gfxFx, util,
        DataGrid, Selection, declare,
        arrayUtil, JsonRest, lang,
        query, topic 
             ) {
        "use strict";

        var surface; 

        var thumbnailStore = new JsonRest({
            target: "api/index.php/photos"
        });

        return {
            createPickPhotoPage: function () {
                var grid, 
                    myPhotoObject = {
                        id: "myPhotoObject",
                        photoId: 0,
                        onClick: function () {
                            myPhotoObject.photoId = this.id;
                            topic.publish("thumbnail", this.id);
                        }
                    };

                util.placeOnMain(domConstruct.create("div", { id: "pl_label", innerHTML: "Select photo to discuss", opacity: 0.0 }));
                util.placeOnMain(domConstruct.create("div", { id: "photoGrid" }));

                grid = new(declare([DataGrid, Selection]))({
                    store: thumbnailStore, // a Dojo object store - css stuff for column widths, etc
                    columns: [
                    	{ label: "Image",       field: 'tname',       sortable: false, formatter: myFormatter }, 
                    	{ label: "#",           field: "id",          sortable: false }, 
                    	{ label: "Name",        field: "Name",        sortable: false }, 
                    	{ label: "Description", field: "description", sortable: false }
                    ],
                    selectionMode: "single"
                }, "photoGrid");

                grid.on("dgrid-select", function (event) {
                    myPhotoObject.photoId = event.rows[0].id;
                    topic.publish("thumbnail", event.rows[0].id);
                });
            },

            getSurface: function () {
                return surface;
            },
            
            placePhoto: function (photo) {
                var photoDescription, divSurfaceElement, fw, fh, imageOnSurface, subscribeHandle,
                    mainPhotoTemplate = '<textarea rows="5" cols="55" readonly id="photoDescription">Name : {Name}\nDescription : {description} </textarea>';

                console.log("placePhoto :", photo);

                util.placeOnMain('<div id="surfaceElement" >  </div>');
                divSurfaceElement = dom.byId("surfaceElement");

                photoDescription = lang.replace(mainPhotoTemplate, photo);
                domConstruct.place(photoDescription, divSurfaceElement);

                subscribeHandle = topic.subscribe("haveSurface", function () {
                    console.log("subscribe - haveSurface (tn ):");

                    //	test2				surface = util.createSurface( photo.fx + 10, photo.fy + 10);  // with imageOnSurface ... photo.fx, etc works with style overflow auto, not sure about markup though
                    imageOnSurface = surface.createImage({ x: 0, y: 0, width: (photo.fx / 2), height: (photo.fy / 2), src: "img/" + photo.fname });
                    subscribeHandle.remove();
                });
                fw = (photo.fx / 2) + 25;
                fh = (photo.fy / 2) + 25;
                createSurface(fw, fh);
            },
            
            putPhotoOnSurface: function (photoId) {
                thumbnailStore.query("/" + photoId).then(this.placePhoto);
            },

            putShapeOnSurface: function (shape) {
                var i; //, x = shape.x * 2,
                   // y = shape.y * 2;

                //				i = surface.createCircle({ cx: shape.x, cy: shape.y, r: shape.size }).setStroke({style: "shape.style"Dash"", width : shape.width, cap: shape.cap, color:shape.color});
                //	test2			i = surface.createCircle({ cx: x , cy: y, r: shape.size }).setStroke({style: "Dash", width:3, cap:"butt", color:shape.color});
                i = surface.createCircle({
                    cx: shape.x,
                    cy: shape.y,
                    r: shape.size
                }).setStroke({
                    style: "Dash",
                    width: 3,
                    cap: "butt",
                    color: shape.color
                });
                console.log("I Put old ", i, "on surface");
            },
            putNewShapeOnSurface: function (shape) {
                var i;
                i = surface.createCircle({
                    cx: shape.x,
                    cy: shape.y,
                    r: shape.size
                }).setStroke({
                    style: shape.style,
                    width: shape.width,
                    cap: shape.cap,
                    color: shape.color
                });
                console.log("I Put new ", i, "on surface");
                return i;
            },
            putNewShapeOnSurfaceTemp: function (shape) {
                var i;
                i = surface.createEllipse({
                    cx: shape.x,
                    cy: shape.y,
                    rx: shape.sizex,
                    ry: shape.sizey
                }).setStroke({
                    style: shape.style,
                    width: shape.width,
                    cap: shape.cap,
                    color: shape.color
                });
                //		console.log("I Put new ", i, "on surface");
                return i;
            },
            rotate: function (i) {
                //				i.applyTransform(gfx.matrix.skewYAt(2, i.shape.cx, i.shape.cy));
                var animation = new gfxFx.animateTransform({
                    duration: 500,
                    shape: i,
                    transform: [{
                        name: "rotateAt",
                        start: [0, i.fx, i.fy],
                        end: [5, i.fy, i.fy]
                    }]
                });
                animation.play();
            },
        };

        function createSurface(width, height) {
            var divSurfaceElement;
            divSurfaceElement = dom.byId("surfaceElement");

            console.log("In createSurface, there is NOT an existing surface - create a Surface  (tn)");
            surface = gfx.createSurface(divSurfaceElement, width, height);

            surface.whenLoaded(function () {
                console.log("surface loaded (tn)");
                topic.publish("haveSurface");
            });
            return surface;
            // console.log("end of createSurface, should be before publish (tn)");					
        }

        function myFormatter(value) {
            // var s = '<img class="dgimg" src = img/' + value + '>';
            return '<img class="dgimg" src = img/' + value + '>';
        }
    }
);