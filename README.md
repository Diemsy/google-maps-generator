Google Maps Generator
=====================

Javascript helper plugin for Google Maps Javascript API v3

Demo
--------------

[CodePen demo](http://codepen.io/clintioo/pen/jEOmZK)

Usage
--------------

HTML

    <div class="map"></div>

Javscript

    <script src="googlemaps.min.js"></script>
    <script>
        /**
         *  Plugin config and init
         */

        // Config
        googleMapGenerator.options.mapLat = 40.77;
        googleMapGenerator.options.mapLng = -73.98;
        googleMapGenerator.options.mapZoom = 12;
        googleMapGenerator.options.markerIconType = 'numeric';
        googleMapGenerator.options.markerIconHexBackground = 'ff6600';
        googleMapGenerator.options.markerIconHexColor = '000000';
        googleMapGenerator.options.hasPrint = false;
        googleMapGenerator.options.locations = [
          ['Central Park', 'New York, NY', 'Central Park is an urban park in the central part of the borough of Manhattan, New York City . It was initially opened in 1857, on 778 acres of city-owned land.', 40.783121, -73.965366, 1],
          ['Times Square', 'Manhattan, NY 10036', 'Times Square is a major commercial intersection and a neighborhood in Midtown Manhattan, New York City, at the junction of Broadway and Seventh Avenue and stretching from West 42nd to West 47th Streets.', 40.759159, -73.985131, 2],
          ['Empire State Building', '350 5th Ave, New York, NY 10118', 'The Empire State Building is a 103-story skyscraper located in Midtown Manhattan, New York City, at the intersection of Fifth Avenue and West 34th Street.', 40.748704, -73.985707, 3],
          ['Metropolitan Museum of Art', '1000 5th Ave, New York, NY 10028', 'The Metropolitan Museum of Art, located in New York City, is the largest art museum in the United States and one of the ten largest in the world.', 40.779701, -73.963255, 4],
          ['Rockefeller Center', '45 Rockefeller Plaza, New York, NY 10111', 'Rockefeller Center is a complex of 19 commercial buildings covering 22 acres between 48th and 51st streets in New York City, United States.', 40.758980, -73.978685, 5],
          ['Museum of Modern Art', '11 W 53rd St, New York, NY 10019', 'The Museum of Modern Art is an art museum located in Midtown Manhattan in New York City between Fifth and Sixth Avenues.', 40.761656, -73.977601, 6]
        ];
        googleMapGenerator.options.styles = [
          {
            featureType: 'road',
            elementType: 'geometry',
            stylers: [
              {
                lightness: 100
              },
              {
                visibility: 'simplified'
              }
            ]
          }, {
            featureType: 'landscape.man_made',
            elementType: 'geometry.fill',
            stylers: [
              {
                color: '#eceaed'
              }
            ]
          }, {
            featureType: 'landscape.natural',
            elementType: 'geometry.fill',
            stylers: [
              {
                color: '#78aa37'
              }
            ]
          }, {
            featureType: 'poi.park',
            elementType: 'geometry.fill',
            stylers: [
              {
                color: '#78aa37'
              }
            ]
          }, {
            featureType: 'water',
            elementType: 'geometry.fill',
            stylers: [
              {
                color: '#73a4e6'
              }
            ]
          }, {
            featureType: 'road',
            elementType: 'labels',
            stylers: [
              {
                visibility: 'off'
              }
            ]
          }
        ];

        // Init
        var map = new googleMapGenerator();
    </script>

License
----

MIT