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

    var g = new googleMapGenerator({
                container: '.selector',
                mapLat: -33.85, 
                mapLng: 151.24,
                mapZoom: 12,
                locations: [
                    ['Bondi Beach', 'Bondi Beach or Bondi Bay is a popular beach and the name of the surrounding suburb in Sydney, New South Wales, Australia.', -33.890542, 151.274856, 1],
                    ['Surry Hills', 'Surry Hills is an affluent, inner-city suburb of Sydney, in the state of New South Wales, Australia. Surry Hills is immediately south-east of the Sydney central business district in the local government area of the City of Sydney.', -33.887050, 151.211540, 2],
                    ['Redfern', 'Redfern is an inner-city suburb of Sydney located 3 kilometres south of the Sydney central business district and is part of the local government area of the City of Sydney. Strawberry Hills is a locality on the border with Surry Hills.', -33.891284, 151.198949, 3],
                    ['Sydney Opera House', 'The Sydney Opera House is a multi-venue performing arts centre in Sydney, New South Wales, Australia.', -33.856680, 151.215308, 4],
                    ['Manly Beach', 'Manly Beach is a beach situated among the Northern Beaches of Sydney, Australia in the city of Manly. From north to south, the three main sections are Queenscliff, North Steyne, and South Steyne.', -33.80010128657071, 151.28747820854187, 5],
                    ['Darling Harbour', 'Darling Harbour is a harbour adjacent to the city centre of Sydney, New South Wales, Australia. It is also a large recreational and pedestrian precinct that is situated on western outskirts of the Sydney central business district.', -33.870851, 151.199026, 6]
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

License
----

MIT