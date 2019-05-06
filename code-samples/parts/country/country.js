var portal = require('/lib/xp/portal');
var thymeleaf = require('/lib/thymeleaf');

// Handle the GET request
exports.get = function(req) {

    // Get the country content as a JSON object
    var content = portal.getContent();

    // Prepare the model object with the needed data from the content
    var model = {
        name: content.displayName,
        population: content.data.population || "Unknown",
        description: content.data.description || "Missing description",
    };

    // Specify the view file to use
    var view = resolve('country.html');

    // Return the merged view and model in the response object
    return {
        body: thymeleaf.render(view, model)
    }
};
