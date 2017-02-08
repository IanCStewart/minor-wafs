/* global window document locations localStorage goePositionJs locationMarker */
/*
Original Author: J.P. Sturkenboom <j.p.sturkenboom@hva.nl>
https://github.com/ju5tu5/cmdgeo/blob/master/src/cmdgeo-0.1.js
*/

(function() {
  // Object with all constant constiables.
  const constObject = {
      sandbox: 'SANDBOX',
      lineair: 'LINEAIR',
      gpsAvailable: 'GPS_AVAILABLE',
      gpsUnavailable: 'GPS_UNAVAILABLE',
      positionUpdated: 'POSITION_UPDATED',
      refreshRate: 1000,
      currentPosition: false,
      currentPositionMarker: false,
      customDebugging: false,
      debugId: false,
      map: false,
      interval: false,
      intervalCounter: false,
      updateMap: false,
      locationArray: [],
      markerArray: []
  };

    // Event functions - bron: http://www.nczonline.net/blog/2010/03/09/custom-events-in-javascript/ Copyright (c) 2010 Nicholas C. Zakas. All rights reserved. MIT License
    // Use: ET.addListener('foo', handleEvent); ET.fire('event_name'); ET.removeListener('foo', handleEvent);
    function EventTarget() {
        this._listeners = {};
    }
    EventTarget.prototype = {
        constructor: EventTarget,
        addListener(a, c) {
            'undefined' == typeof this._listeners[a] && (this._listeners[a] = []);
            this._listeners[a].push(c);
        },
        fire(a) {
            'string' == typeof a && (a = {
                type: a
            });
            a.target || (a.target = this);
            if (!a.type)
                throw Error('Event object missing "type" property.');
            if (this._listeners[a.type]instanceof Array)
                for (let c = this._listeners[a.type], b = 0, d = c.length; b < d; b++)
                    c[b].call(this, a);
                }
            ,
        removeListener(a, c) {
            if (this._listeners[a]instanceof Array)
                for (let b = this._listeners[a], d = 0, e = b.length; d < e; d++)
                    if (b[d] === c) {
                        b.splice(d, 1);
                        break;
                    }
                }
    };

    const ET = new EventTarget();

    const location = {
        // Test for GPS (in geo.js) and fire an event.
        init() {
            ET.addListener(constObject.gpsAvailable, this.startInterval);
            ET.addListener(constObject.gpsUnavailable, function() {
                debug.message('GPS is not available.');
            });
            (goePositionJs.init())
                ? ET.fire(constObject.gpsAvailable)
                : ET.fire(constObject.gpsUnavailable);
        },
        // Start interval based on the refreshRate, updates the position
        startInterval() {
            debug.message('GPS is available, asking for position.');
            this.update();
            constObject.interval = this.setInterval(this.update, constObject.refreshRate);
            ET.addListener(constObject.positionUpdated, this.check);
        },
        // Ask for the position in geo.js, initiates callback for the result
        update() {
            constObject.intervalCounter++;
            goePositionJs.getCurrentPosition(this.set, debug.geoErrorHandler, {enableHighAccuracy: true});
        },
        // Callback function for setting the position, fires a event.
        set(position) {
            constObject.currentPosition = position;
            ET.fire('constObject.positionUpdated');
            debug.message(constObject.intervalCounter + ' position lat: ' + position.coords.latitude + ' long: ' + position.coords.longitude);
        },
        // Checks the location, fires redirect to a different page on location
        check() {
            for (let i = 0; i < locations.length; i++) {
                const locatie = {
                    coords: {
                        latitude: locations[i][3],
                        longitude: locations[i][4]
                    }
                };
                if (this.calculate(locatie, constObject.currentPosition) < locations[i][2]) {
                    // Check if we are on location
                    if (window.location != locations[i][1] && localStorage[locations[i][0]] == 'false') {
                        // Try local storage, if it exists increment the location, else catch all errors
                        try {
                            (localStorage[locations[i][0]] == 'false')
                                ? localStorage[locations[i][0]] = 1
                                : localStorage[locations[i][0]]++;
                        } catch (error) {
                            debug.message('Localstorage cant be reached: ' + error);
                        }
                        // TODO: Animate the actual marker
                        window.location = locations[i][1];
                        debug.message('Player is within a range of ' + locations[i][2] + ' meter of ' + locations[i][0]);
                    }
                }
            }
        },
        // Calculate difference between two points in meters
        calculate(p1, p2) {
            const pos1 = new google.maps.LatLng(p1.coords.latitude, p1.coords.longitude);
            const pos2 = new google.maps.LatLng(p2.coords.latitude, p2.coords.longitude);
            return Math.round(google.maps.geometry.spherical.computeDistanceBetween(pos1, pos2), 0);
        }
    };

    /** GOOGLE MAPS FUNCTIONS
    ---------------------
     * generateMap(myOptions, canvasId)
     * calls based on given options the google maps API
     * to generate a map and places this in the HTML element
     * thats indicated by the given ID
     *
     * @param myOptions:object - a object with constObjecturable options
     *  for calling the google maps API
     * @param canvasID:string - the id of the HTML element where the
     *   map in pre-rendered moet worden, <div> of <canvas>
  **/
    const google = {
        generateMap(myOptions, canvasId, tourType, isNumber, positionMarker, markerArray) {
            // TODO: Can I call the maps API async? Less calls
            debug.message('Generate a Google Maps maps and show this in #' + canvasId);
            constObject.map = new google.maps.Map(document.getElementById(canvasId), myOptions);

            const routeList = [];
            // Add the markers to map dependending on the tourType
            debug.message('Locaties intekenen, tourtype is: ' + tourType);
            for (let i = 0; i < locations.length; i++) {
                try {
                    (localStorage.visited == undefined || isNumber(localStorage.visited))
                        ? localStorage[locations[i][0]] = false
                        : null;
                } catch (error) {
                    debug.message('Localstorage cant be reached: ' + error);
                }
                const markerLatLng = new google.maps.LatLng(locations[i][3], locations[i][4]);
                routeList.push(markerLatLng);

                constObject.markerArray[i] = {};
                for (const attr in locationMarker) {
                    constObject.markerArray[i][attr] = locationMarker[attr];
                }
                markerArray[i].scale = locations[i][2] / 3;

                new google.maps.Marker({position: markerLatLng, map: constObject.map, icon: constObject.markerArray[i], title: locations[i][0]});
            }

            if (tourType == constObject.lineair) {
                // Draw line between points
                debug.message('Drawing route');
                const route = new google.maps.Polyline({
                    clickable: false,
                    map: constObject.map,
                    path: routeList,
                    strokeColor: 'Black',
                    strokeOpacity: .6,
                    strokeWeight: 3
                });
            }
            // Add the location of the user
            constObject.currentPositionMarker = new google.maps.Marker({position: myOptions.center, map: constObject.map, icon: positionMarker, title: 'U are here'});
            ET.addListener(constObject.positionUpdated, this.updatePositie);
        },

        isNumber(n) {
            return !isNaN(parseFloat(n)) && isFinite(n);
        },

        // Update the users position on the map
        updatePositie() {
            // use currentPosition to center the map
            const newPos = new google.maps.LatLng(constObject.currentPosition.coords.latitude, constObject.currentPosition.coords.longitude);
            constObject.map.setCenter(newPos);
            constObject.currentPositionMarker.setPosition(newPos);
        }
    };

    const debug = {
        geoErrorHandler(code, message) {
            debug.message('geo.js error ' + code + ': ' + message);
        },

        message(message) {
            (constObject.customDebugging && constObject.debugId)
                ? document.getElementById(constObject.debugId).innerHTML
                : console.log(message);
        },

        setCustomDebugging(debugId) {
            constObject.debugId = debugId;
            constObject.customDebugging = true;
        }
    };
}());
