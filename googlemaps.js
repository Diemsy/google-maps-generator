/**
 *  Google Map Generator
 *
 *  Author: Clint Brown
 *  Website: https://github.com/clintioo/google-maps-generator
 *  Version: v0.0.6
 *  Last modified: Tuesday 11 November 2014 14:42
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
 *  <script src="//maps.googleapis.com/maps/api/js"></script>
 *  <script>
 *  var map = new googleMapGenerator({
 *      container: '.selector',
 *      mapLat: -33.85, 
 *      mapLng: 151.24,
 *      mapZoom: 12,
 *      markerIconType: 'numeric',
 *      markerAnimation: google.maps.Animation.DROP,
 *      markerLoad: 'scroll',
 *      locations: [
 *          ['My location', 'My location address', My location description', -33.890542, 151.274856, 1, '/path/to/marker-icon.png']
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
 *  </script>
 *
 */

function googleMapGenerator (options) {

    "use strict";

    if (!(this instanceof googleMapGenerator)) {
        return new googleMapGenerator(options);
    }

    var settings = googleMapGenerator.options,
        container = document.querySelectorAll(settings.mapStatic)[0] || document.querySelectorAll(settings.container)[0],
        map,
        mapOptions;

    if (options) {
        settings = extend(googleMapGenerator.options, options);
    }

    /**
     *  Medium and above screens - dynamic map
     *  Small screens - static map
     */

    if (settings.docWidth < settings.breakpointDynamicMap && settings.hasStaticMap === true) {
        addGoogleMapStatic(settings.docWidth, settings.docWidth);
        generateGoogleMapDynamic();
    } else {
        addGoogleMapDynamic();
    }

    /**
     *  Add Google Map Dynamic
     */

    function addGoogleMapDynamic () {
        // Options
        mapOptions = {
            zoom: settings.mapZoom,
            center: new google.maps.LatLng(settings.mapLat, settings.mapLng),
            mapTypeControlOptions: {
                mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
            }
        };

        map = new google.maps.Map(container, mapOptions);

        // Legend
        if (settings.hasLegend) {
            addGoogleMapLegend();
        }

        // Style
        if (settings.styles) {
            addGoogleMapStyle();
        }

        // Markers
        if (settings.markerLoad === 'load') {
            addGoogleMapMarkers();
        }

        // Print
        if (settings.hasPrint) {
            addGoogleMapPrintBtn();
        }

        return map;
    }

    /**
     *  Add Google Map Legend
     */

    function addGoogleMapLegend () {
        var legend = document.createElement('div');

        legend.setAttribute('class', settings.legendClass);
        container.appendChild(legend);
        settings.legend = getChildByClass(container, settings.legendClass);

        map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(settings.legend);
    }

    /**
     *  Add Google Map Style
     */

    function addGoogleMapStyle () {
        // Styles
        var styledMap = new google.maps.StyledMapType(settings.styles, {name: 'Styled Map'});

        map.mapTypes.set('map_style', styledMap);
        map.setMapTypeId('map_style');
    }

    /**
     *  Add Google Map markers (medium and above screens only)
     *
     *  @returns  Adds markers, info window and legend to map (all are optional)
     */

    function addGoogleMapMarkers () {
        if (settings.hasStaticMap === false) {
            var latestKnownScrollY = window.scrollY || document.documentElement.scrollTop,
                markers = [];

            if (settings.markersAdded) {
                return false;
            }

            if (settings.markerLoad === 'scroll' && container.offsetTop > latestKnownScrollY) {
                return false;
            }

            if (settings.hasInfoWindow) {
                var infowindow = null;

                infowindow = new google.maps.InfoWindow({
                    content: '',
                    maxWidth: 240
                });
            }

            for (var i = 0, locationsLen = settings.locations.length; i < locationsLen; i++) {
                var location = settings.locations[i],
                    myLatLng = new google.maps.LatLng(location[3], location[4]),
                    marker;

                if (settings.hasMarkerIcon) {
                    // If image URL, use icon; else default to Google Chart API marker
                    if (location[6]) {
                        settings.markerIcon = {
                            url: location[6],
                            scaledSize: new google.maps.Size(50, 50)
                        };
                    } else {
                        getGoogleMapMarkerLabel(i);
                        settings.markerIcon = 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=' + settings.markerIconLabel + '|' + settings.markerIconHexBackground + '|' + settings.markerIconHexColor;
                    }
                }

                marker = new google.maps.Marker({
                    position: myLatLng,
                    map: map,
                    icon: settings.markerIcon,
                    animation: settings.markerAnimation,
                    title: location[0],
                    html: '<div><span class="map__title">' + location[0] + '</span><span class="map__address">' + location[1] + '</span><span class="map__description">' + location[2] + '</span></div>',
                    zIndex: location[5]
                });

                markers.push(marker);

                if (settings.hasLegend) {
                    var legendItem = document.createElement('div');

                    legendItem.setAttribute('class', 'map__legend__item');
                    legendItem.innerHTML = '<strong>' + settings.markerIconLabel + '</strong>&nbsp;&nbsp;<a href="#">' + location[0] + '</a>';
                    settings.legend.appendChild(legendItem);
                }

                if (settings.hasInfoWindow) {
                    google.maps.event.addListener(marker, 'click', function () {
                        infowindow.setContent(this.html);
                        infowindow.open(map, this);
                    });
                }
            }

            if (settings.hasLegend) {
                $('.' + settings.legendClass).on('click', 'a', function (e) {
                    e.preventDefault();

                    var index = $(e.target).parent().index();

                    google.maps.event.trigger(markers[index], 'click');
                });
            }

            settings.markersAdded = true;
        }
    }

    /**
     *  Add Google Map Print
     */

    function addGoogleMapPrintBtn () {
        var printBtn = document.createElement('a');

        printBtn.setAttribute('class', settings.printClass);
        printBtn.setAttribute('href', '#');
        printBtn.innerHTML = 'Print';
        container.appendChild(printBtn);

        settings.print = getChildByClass(container, settings.printClass);

        settings.print.onclick = function () {
            printGoogleMap();

            return false;
        }
    }

    /**
     *  Add static Google Map
     *
     *  @returns  {Object} update container with static Google Map image
     */

    function addGoogleMapStatic (width, height) {
        return container.innerHTML = generateGoogleMapStatic(width, height);
    }

    /**
     *  Generate static Google Map
     *
     *  @returns  {String} static Google Map image
     */

    function generateGoogleMapStatic (width, height) {
        var key = '',
            mapHue = '',
            mapLegend = '',
            mapSaturation = '',
            markersStr = '',
            markersLen = settings.locations.length,
            width = width || 640,
            height = height || 640;

        if (settings.key) {
            key = '&amp;key=' + settings.key;
        }

        if (settings.styles[0].stylers[0].hue) {
            mapHue = '%7Chue:0x' + settings.styles[0].stylers[0].hue.substring(1, settings.styles[0].stylers[0].hue.length);
        }

        if (settings.styles[0].stylers[1].saturation) {
            mapSaturation = '%7Csaturation:' + settings.styles[0].stylers[1].saturation;
        }

        mapLegend += '<div class="map__legend"><ul>';

        for (var i = 0; i < markersLen; i++) {
            markersStr += '&amp;markers=label:' + getGoogleMapMarkerLabel(i) + '%7C' + settings.locations[i][3] + ',' + settings.locations[i][4];
            mapLegend += '<li><span class="map__marker">' + getGoogleMapMarkerLabel(i) + '</span> <strong>' + settings.locations[i][0] + '</strong><br>' + settings.locations[i][1] + '</li>';
        }

        mapLegend += '</ul></div>';

        return '<div class="map__static"><img style="-webkit-user-select: none" src="http://maps.googleapis.com/maps/api/staticmap?center=' + settings.mapLat + ',' + settings.mapLng + '&amp;zoom=' + settings.mapZoom + key + '&amp;size=' + width + 'x' + height + '&amp;style=stylers' + mapHue + mapSaturation + markersStr + '"></div>' + mapLegend;
    }

    /**
     *  Generate dynamic Google Map
     *
     *  @returns  {String} dynamic Google Map
     */

    function generateGoogleMapDynamic () {
        var mapStatic = document.querySelectorAll(settings.mapStatic)[0];

        mapStatic.onclick = function (e) {
            if (!document.querySelectorAll(settings.mapDynamic)[0]) {
                mapStatic.style.height = mapStatic.offsetHeight * 2.5 + 'px';
                loadGoogleMapJs();
                return false;
            }
        };
    }

    /**
     *  Load Google Map JS API
     *
     *  @returns  {object} loads Google Maps JS API library
     */

    function loadGoogleMapJs () {
        var script = document.createElement('script');

        // Reset options to dynamic map
        googleMapGenerator.options.hasStaticMap = false;
        googleMapGenerator.options.markerLoad = 'load';

        script.type = 'text/javascript';
        script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp&' + 'callback=googleMapGenerator';
        
        return document.body.appendChild(script);
    }

    /**
     *  Get Google Map Marker Labels
     *
     *  @returns  {String, number} character (A, B, C) or number based on the number input (i starts at 0)
     */

    function getGoogleMapMarkerLabel (i) {
        switch (settings.markerIconType) {
            case 'alpha':
                settings.markerIconLabel = String.fromCharCode(97 + i).toUpperCase();
                break;
            case 'numeric':
                settings.markerIconLabel = i + 1;
                break;
        }

        return settings.markerIconLabel;
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
        var mapWin = window.open('', 'mapWin', 'width=640,height=640');

        mapWin.focus();
        mapWin.document.write('<style>body { margin:0 } img { width: 100%; height: auto; } .map__legend ul { padding: 0; margin: 1.5em 0 0; } ' + 
            '.map__legend ul li { float: left; width: 50%; list-style: none; margin: 0 0 1em; font: 12px sans-serif; }<\/style>' +
            generateGoogleMapStatic() + '<script>setTimeout(function () { window.focus(); window.print(); }, 1500);<\/script>');
        mapWin.document.close();

        return mapWin;
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
        if (typeof target === 'boolean') {
            deep = target;
            target = arguments[1] || {};
            // skip the boolean and the target
            i = 2;
        }

        // Handle case when target is a string or something (possible in deep copy)
        if (typeof target !== 'object' && !jQuery.isFunction(target)) {
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

    return {
        addGoogleMapDynamic: addGoogleMapDynamic,
        addGoogleMapLegend: addGoogleMapLegend,
        addGoogleMapStyle: addGoogleMapStyle,
        addGoogleMapMarkers: addGoogleMapMarkers,
        addGoogleMapPrintBtn: addGoogleMapPrintBtn,
        addGoogleMapStatic: addGoogleMapStatic,
        generateGoogleMapStatic: generateGoogleMapStatic,
        generateGoogleMapDynamic: generateGoogleMapDynamic,
        loadGoogleMapJs: loadGoogleMapJs,
        getGoogleMapMarkerLabel: getGoogleMapMarkerLabel,
        printGoogleMap: printGoogleMap,
        extend: extend,
        getChildByClass: getChildByClass
    }

};

googleMapGenerator.options = {
    container: '.map',
    mapStatic: '.map__static',
    mapDynamic: '.gm-style',
    printClass: 'map__print',
    legendClass: 'map__legend',
    apiKey: null,
    legend: null,
    print: null,
    mapLat: -33.85, 
    mapLng: 151.24,
    mapZoom: 12,
    hasStaticMap: false,
    hasInfoWindow: true,
    hasLegend: true,
    hasPrint: true,
    hasMarkerIcon: true,
    markerAnimation: null,
    markerLoad: 'load',
    markerIconType: 'alpha',
    markerIconLabel: '',
    markerIconHexColor: 'ffffff',
    markerIconHexBackground: '444444',
    markerIcon: null,
    markersAdded: false,
    locations: [],
    styles: [],
    docWidth: document.body.clientWidth,
    breakpointDynamicMap: 768
};