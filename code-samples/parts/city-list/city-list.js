var contentLib = require('/lib/xp/content');
var portal = require('/lib/xp/portal');
var thymeleaf = require('/lib/thymeleaf');

// Handle the GET request
exports.get = function (req) {

    // Get the part configuration for the map
    var config = portal.getComponent().config;
    var zoom = parseInt(config.zoom) || 10;
    var mapType = config.mapType || 'ROADMAP';

    // Get the key from configuration file $XP_HOME/config/<app.name>.cfg
    var googleApiKey = app.config['maps.apiKey'] || "";

    // Script that will be placed on the page
    var googleMaps = '<script src="http://maps.googleapis.com/maps/api/js?key=' + googleApiKey + '"></script>';
    var renderMaps = '';

    var countryPath = portal.getContent()._path;
    var componentPath = portal.getComponent().path;


    // Get all the country's cities
    var result = contentLib.query({
        start: 0,
        count: 100,
        contentTypes: [
            app.name + ':city'
        ],
        query: "_path LIKE '/content" + countryPath + "/*'",
        sort: "modifiedTime DESC"
    });

    var cities = [];
    var hits = result.hits;

    if (hits.length > 0) {
        renderMaps += '<script>function initialize() {';

        // Loop through the contents and extract the needed data
        for (var i = 0; i < hits.length; i++) {

            var city = {};
            city.name = hits[i].displayName;
            city.location = hits[i].data.location;
            city.population = hits[i].data.population ? 'Population: ' + hits[i].data.population : null;
            cities.push(city);

            if (city.location) {
                city.mapId = componentPath + '/googleMap' + i;
                renderMaps += `
var position${i} = new google.maps.LatLng(${city.location});
var map${i} = new google.maps.Map(document.getElementById("${componentPath}/googleMap${i}"), { center:position${i}, zoom:${zoom}, mapTypeId:google.maps.MapTypeId.${mapType}, scrollwheel: false });
var marker = new google.maps.Marker({ position:position${i} }); marker.setMap(map${i});`
            }
        }
        renderMaps += '} google.maps.event.addDomListener(window, "load", initialize);</script>';
    }

    // Specify the view file to use
    var view = resolve('city-list.html');

    // Prepare the model object that will be passed to the view file
    var model = {
        cities: cities,
        script: renderMaps
    };

    // Return the response object
    return {
        body: thymeleaf.render(view, model),
        // Places the map javascript into the head of the document
        pageContributions: {
            headEnd: googleMaps
        }
    }
};
