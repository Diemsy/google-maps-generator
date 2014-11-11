Google Maps Generator
=====================

Javascript helper plugin for Google Maps Javascript API v3

Demo
--------------

See index.html

Usage
--------------

HTML

    <div class="selector"></div>

Javscript

    <script src="googlemaps.min.js"></script>
    <script>
        var map = new googleMapGenerator({
            container: '.selector',
            mapLat: -33.85, 
            mapLng: 151.24,
            mapZoom: 12,
            markerIconType: 'numeric',
            markerAnimation: google.maps.Animation.DROP,
            locations: [
                ['My location 1', 'My location address 1', My location description 3', -33.890542, 151.274856, 1, '/path/to/marker-icon.png'],
                ['My location 2', 'My location address 2', My location description 4', -32.890542, 152.274856, 1, '/path/to/marker-icon.png']
            ],
            styles: [
                {
                    stylers: [
                        {
                            hue: '#000000'
                        },
                        {
                            saturation: -100
                        }
                    ]
                }, {
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
                    featureType: 'road',
                    elementType: 'labels',
                    stylers: [
                        {
                            visibility: 'off'
                        }
                    ]
                }
            ]
        });
    </script>

License
----

MIT