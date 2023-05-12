var contentLib = require('/lib/xp/content');
var portal = require('/lib/xp/portal');
var thymeleaf = require('/lib/thymeleaf');

// Specify the view file to use
const view = resolve('city-list.html');

// Handle the GET request
exports.get = function (req) {

    // Get the part configuration for the map
    const config = portal.getComponent().config;
    const countryPath = portal.getContent()._path;
    const componentPath = portal.getComponent().path;

    // Get all child item cities's  
    const result = contentLib.query({
        start: 0,
        count: 100,
        contentTypes: [
            app.name + ':city'
        ],
        query: "_path LIKE '/content" + countryPath + "/*'",
        sort: "modifiedTime DESC"
    });

    const cities = [];

    // Create a crop based on configuration
    const crop = config.crop || 'ORIGINAL';
    let scale; 
    if (crop == 'SQUARE') { scale = 'square(1080)'}
    else if (crop == 'WIDESCREEN') { scale = 'block(1080,300)'}
    else { scale = 'width(1080)'}

    if (result.hits.length > 0) {

        // Loop through the contents and extract the needed data
        result.hits.forEach((item)=>{

            const city = {};
            city.name = item.displayName;
            city.photo = item.data.photo ? portal.imageUrl({
                id: item.data.photo,
                scale: scale,
            }) : null;
            const population = item.data.population ? 'population: ' + item.data.population : '';
            city.caption = [item.data.slogan, population].filter(Boolean).join(' - ');
            cities.push(city);

        })
    }

    // Specify the view file to use
    const model = {cities};
    log.info('Model object %s', JSON.stringify(model, null, 4));

    // Return the response object
    return {
        body: thymeleaf.render(view, model)
    };
};