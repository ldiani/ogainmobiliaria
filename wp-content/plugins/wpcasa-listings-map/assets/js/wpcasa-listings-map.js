/*global google, wpsightMap, InfoBox */

google.maps.event.addDomListener( window, 'load', function() {

	// Pull-in options from the wp_localize_script object.
	// Use the 'wpsight_listings_map_options' filter to manipulate.
	var mapOptions = wpsightMap.map;
	mapOptions.mapTypeId = google.maps.MapTypeId[wpsightMap.map.mapTypeId];
	mapOptions.mapTypeControl = wpsightMap.map.mapTypeControl === "true";
	mapOptions.scrollwheel = wpsightMap.map.scrollwheel === "true";
	mapOptions.streetViewControl = wpsightMap.map.streetViewControl === "true";
	
	// the DOM element that will contain the map
	var mapElement = document.getElementById(wpsightMap.map.id),
	
	// setup bounds object
	bounds = new google.maps.LatLngBounds(), 
	
	// initialize the map
	map = new google.maps.Map(mapElement, mapOptions),
	
	// will hold all the generated markers
	markers = [],

	// the event handler for hovering a marker
	markerHoverHandler = function ( markers ) { 
		
		return function(){
			// before anything, close all other infoboxes
			for (var j = markers.length - 1; j >= 0; j--) {
				markers[j].infobox.close();
			}
			// open this infobox
			this.infobox.open(map, this);
		};
	};

	// iterate over all markers
	for ( var i = wpsightMap.map.markers.length - 1; i >= 0; i-- ) {

		// shortcut to the marker options
		var markerOptions = wpsightMap.map.markers[i];

		// set marker options. Again, pulled in from the wp_localize_script object
		// Reference: https://developers.google.com/maps/documentation/javascript/reference#Marker
		var newMarker = new google.maps.Marker({

			// Rollover text. Only applies to point geometries
			title: markerOptions.title,

			// Marker position. Required.
			position: new google.maps.LatLng(parseFloat(markerOptions.lat), parseFloat(markerOptions.lng)),

			// Map on which to display Marker
			map: map,

			// Icon for the foreground:
			// Reference: https://developers.google.com/maps/documentation/javascript/reference#Icon
			icon: {
				
				// The URL of the image or sprite sheet.
				url: markerOptions.icon.url,
				
				// The display size of the sprite or image. When using sprites, you must specify the sprite size. 
				// If the size is not provided, it will be set when the image loads.
				size: new google.maps.Size(parseInt(markerOptions.icon.size[0]), parseInt(markerOptions.icon.size[1])),
				
				// The position of the image within a sprite, if any. By default, the origin is located at the top left corner of the image (0, 0).
				origin: new google.maps.Point(parseInt(markerOptions.icon.origin[0]), parseInt(markerOptions.icon.origin[1])),
				
				// The position at which to anchor an image in correspondence to the location of the marker on the map. 
				// By default, the anchor is located along the center point of the bottom of the image.
				anchor: new google.maps.Point(parseInt(markerOptions.icon.anchor[0]), parseInt(markerOptions.icon.anchor[1])),
				
				// The size of the entire image after scaling, if any. Use this property to stretch/shrink an image or a sprite.
				scaledSize: new google.maps.Size(parseInt(markerOptions.icon.scaledSize[0]), parseInt(markerOptions.icon.scaledSize[1]))
			}
		});
		// InfoBox extends the Google Maps JavaScript API V3 OverlayView class.
		// An InfoBox behaves like a google.maps.InfoWindow, but it supports several additional properties for advanced styling. An InfoBox can also be used as a map label.
		// Reference: https://google-maps-utility-library-v3.googlecode.com/svn/trunk/infobox/docs/reference.html
		newMarker.infobox = new InfoBox({
			
			// The content of the InfoBox (plain text or an HTML DOM node).
			content: markerOptions.infobox.content,
			
			// The URL of the image representing the close box. 
			// Note: The default is the URL for Google's standard close box. Set this property to "" if no close box is required.
			closeBoxURL: markerOptions.infobox.closeBoxURL,
			
			// Minimum offset (in pixels) from the InfoBox to the map edge after an auto-pan.
			infoBoxClearance: new google.maps.Size(1, 1)
		});
		
		// attach event to mouseover ("hover") on the marker
		google.maps.event.addListener(newMarker, "mouseover", markerHoverHandler(markers));

		// set the map boundary to include this marker
		bounds.extend(newMarker.position);

		// push this new marker to the markers array so we can reference it later
		markers[i] = newMarker;
	}

	// Sets the viewport to contain the given bounds.
	map.fitBounds(bounds);

	// Pans the map by the minimum amount necessary to contain the given LatLngBounds. 
	map.panToBounds(bounds); 
});