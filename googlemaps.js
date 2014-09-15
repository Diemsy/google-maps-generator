/**
 *  Google Map Generator
 *
 *  Author: Clint Brown
 *  Version: v0.0.1
 *  Last modified: Monday, 15 September 2014 15:52
 *  Description: Javascript helper plugin for Google Maps Javscript API v3
 *
 *  Example usage -
 *
 *  HTML
 *
 *  <div class="selector"></div>
 *
 *  Javascript
 *
 *  var g = new googleMapGenerator({
 *      container: '.selector',
 *      mapLat: -33.85, 
 *      mapLng: 151.24,
 *      mapZoom: 12,
 *      locations: [
 *          ['My location', 'My location description', -33.890542, 151.274856, 1]
 *      ],
 *      styles: [
 *          {
 *              stylers: [
 *                  {
 *                      hue: '#000000'
 *                  },
 *                  {
 *                      saturation: -100
 *                  }
 *              ]
 *          }, {
 *              featureType: 'road',
 *              elementType: 'geometry',
 *              stylers: [
 *                  {
 *                      lightness: 100
 *                  },
 *                  {
 *                      visibility: 'simplified'
 *                  }
 *              ]
 *          }, {
 *              featureType: 'road',
 *              elementType: 'labels',
 *              stylers: [
 *                  {
 *                      visibility: 'off'
 *                  }
 *              ]
 *          }
 *      ]
 *  });
 *
 */

function googleMapGenerator (options) {

    "use strict";

    var settings = {
        container: null,
        containerClass: 'map',
        printClass: 'map__print',
        legendClass: 'map__legend',
        legend: null,
        print: null,
        mapLat: -33.85, 
        mapLng: 151.24,
        mapZoom: 12,
        hasInfoWindow: true,
        hasLegend: true,
        hasPrint: true,
        locations: [],
        styles: []
    };

    if (options) {
        extend(settings, options);
    }

    var container = document.querySelectorAll(settings.container)[0];

    /**
     *  Add Google Map
     *
     *  @returns  {Object} Creates a dynamic map
     */

    function addGoogleMap () {
        // Options
        var mapOptions = {
            zoom: settings.mapZoom,
            center: new google.maps.LatLng(settings.mapLat, settings.mapLng),
            mapTypeControlOptions: {
                mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
            }
        };

        // Create map
        var map = new google.maps.Map(container, mapOptions);

        // Legend
        if (settings.hasLegend) {
            var legend = document.createElement('div');

            legend.setAttribute('class', settings.legendClass);
            container.appendChild(legend);
            settings.legend = getChildByClass(container, settings.legendClass);

            map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(settings.legend);
        }

        // Info window, markers, legend
        addGoogleMapMarkers(map, settings.locations);

        // Styles
        var styledMap = new google.maps.StyledMapType(settings.styles, {name: 'Styled Map'});

        map.mapTypes.set('map_style', styledMap);
        map.setMapTypeId('map_style');

        // Print
        if (settings.hasPrint) {
            var printBtn = document.createElement('a');

            printBtn.setAttribute('class', settings.printClass);
            printBtn.setAttribute('href', '#');
            printBtn.innerHTML = 'Print';
            container.appendChild(printBtn);

            settings.print = getChildByClass(container, settings.printClass);

            settings.print.onclick = function () {
                printGoogleMap();
            }
        }

        return map;
    }

    /**
     *  Add Google Map markers
     *
     *  @returns  Adds markers, info window and legend to map (all are optional)
     */

    function addGoogleMapMarkers (map, locations) {
        if (settings.hasInfoWindow) {
            var infowindow = null;

            infowindow = new google.maps.InfoWindow({
                content: '',
                maxWidth: 300
            });
        }

        for (var i = 0, locationsLen = locations.length; i < locationsLen; i++) {
            var location = locations[i],
                myLatLng = new google.maps.LatLng(location[2], location[3]),
                marker = new google.maps.Marker({
                    position: myLatLng,
                    map: map,
                    icon: 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=' + (i + 1) + '|444444|FFFFFF',
                    title: location[0],
                    html: '<div><h1>' + location[0] + '</h1>' + location[1] + '</div>',
                    zIndex: location[4]
                });

            if (settings.hasLegend) {
                var legendItem = document.createElement('div');
                legendItem.setAttribute('class', 'map__legend_item');
                legendItem.innerHTML = '<strong>' + (i + 1) + '</strong>&nbsp; ' + location[0];
                settings.legend.appendChild(legendItem);
            }

            if (settings.hasInfoWindow) {
                google.maps.event.addListener(marker, 'click', function () {
                    infowindow.setContent(this.html);
                    infowindow.open(map, this);
                });
            }
        }
    }

    /**
     *  Print Google Map
     *
     *  @returns   Creates a static map in a new popup window and opens the print dialog
     *             The static map resolves an issue with writing a dynamic map with markers
     *             in a new window (canvas renders the markers as 'tainted' and will not print)
     *
     *  http://maps.googleapis.com/maps/api/staticmap?center=-33.85,151.23&zoom=12&size=640x640&style=stylers%7Chue:0x000000%7Csaturation:-100&markers=label:A%7C-33.890542,151.274856&markers=label:B%7C-33.887050,151.211540&markers=label:C%7C-33.891284,151.198949&markers=label:D%7C-33.856680,151.215308&markers=label:E%7C-33.80010128657071,151.28747820854187&markers=label:F%7C-33.870851,151.199026&markers=label:G%7C-33.873188,151.203672
     */

    function printGoogleMap () {
        var mapWin = window.open('', 'mapWin', 'width=640,height=640'),
            mapHue = '',
            mapSaturation = '',
            markersStr = '',
            markersLen = settings.locations.length;

        if (settings.styles[0].stylers[0].hue) {
            mapHue = '%7Chue:0x' + settings.styles[0].stylers[0].hue.substring(1, settings.styles[0].stylers[0].hue.length);
        }

        if (settings.styles[0].stylers[1].saturation) {
            mapSaturation = '%7Csaturation:' + settings.styles[0].stylers[1].saturation;
        }

        for (var i = 0; i < markersLen; i++) {
            markersStr += '&amp;markers=label:' + (i + 1) + '%7C' + settings.locations[i][2] + ',' + settings.locations[i][3];
        }

        mapWin.focus();
        mapWin.document.write('<style>body { margin:0 } img { width: 100%; height: auto; }<\/style>');
        mapWin.document.write('<img style="-webkit-user-select: none" src="http://maps.googleapis.com/maps/api/staticmap?center=' + settings.mapLat + ',' + settings.mapLng + '&amp;zoom=' + settings.mapZoom + '&amp;size=640x640&amp;style=stylers' + mapHue + mapSaturation + markersStr + '">');
        mapWin.document.write('<script>setTimeout(function () { window.focus(); window.print(); }, 1500);<\/script>');
        mapWin.document.close();

        return;
    }


    /**
     *  Extend
     *
     *  See jQuery source
     */

    function extend (a, b) {
        var options, name, src, copy, copyIsArray, clone, target = arguments[0] || {},
            i = 1,
            length = arguments.length,
            deep = false;

        // Handle a deep copy situation
        if (typeof target === "boolean") {
            deep = target;
            target = arguments[1] || {};
            // skip the boolean and the target
            i = 2;
        }

        // Handle case when target is a string or something (possible in deep copy)
        if (typeof target !== "object" && !jQuery.isFunction(target)) {
            target = {};
        }

        // extend jQuery itself if only one argument is passed
        if (length === i) {
            target = this;
            --i;
        }

        for (; i < length; i++) {
            // Only deal with non-null/undefined values
            if ((options = arguments[i]) != null) {
                // Extend the base object
                for (name in options) {
                    src = target[name];
                    copy = options[name];

                    // Prevent never-ending loop
                    if (target === copy) {
                        continue;
                    }

                    // Recurse if we're merging plain objects or arrays
                    if (deep && copy && (jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)))) {
                        if (copyIsArray) {
                            copyIsArray = false;
                            clone = src && jQuery.isArray(src) ? src : [];

                        } else {
                            clone = src && jQuery.isPlainObject(src) ? src : {};
                        }

                        // Never move original objects, clone them
                        target[name] = jQuery.extend(deep, clone, copy);

                        // Don't bring in undefined values
                    } else if (copy !== undefined) {
                        target[name] = copy;
                    }
                }
            }
        }

        // Return the modified object
        return target;
    }

    /**
     *  Get child by class name
     *
     *  http://jsfiddle.net/franverona/8Tx27/1/
     *
     *  @returns  {Object} DOM child node(s) matching the specified class name
     */
    function getChildByClass (el, className) {
        var childNode;

        for (var i = 0, il = el.childNodes.length; i < il; i++) {
            var classes = (el.childNodes[i].className != undefined) ? el.childNodes[i].className.split(" ") : [];

            for (var j = 0, jl = classes.length; j < jl; j++) {
                if (classes[j] == className) {
                    childNode = el.childNodes[i];
                }
            }
        }

        return childNode;
    }

    addGoogleMap();

    return {
        addGoogleMap: addGoogleMap,
        addGoogleMapMarkers: addGoogleMapMarkers,
        printGoogleMap: printGoogleMap,
        extend: extend,
        getChildByClass: getChildByClass
    }

};