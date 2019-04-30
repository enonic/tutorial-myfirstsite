var portal = require('/lib/xp/portal'); // Import the portal library
var thymeleaf = require('/lib/thymeleaf'); // Import the Thymeleaf library

// Handle the GET request
exports.get = function(req) {

    // Get the content that is using the page
    var content = portal.getContent();

    // Prepare the model that will be passed to the view
    var model = {
      displayName: portal.getContent().displayName,
      mainRegion: content.page.regions.main
    }

    // Specify the view file to use
    var view = resolve('hello-region.html');

    // Return the merged view and model in the response object
    return {
        body: thymeleaf.render(view, model)
    }
};
