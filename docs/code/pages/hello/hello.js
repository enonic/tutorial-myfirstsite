var portal = require('/lib/xp/portal'); // Import the portal library

// Handle the GET request
exports.get = function(req) {

    // Get the content that is using the page
    var content = portal.getContent();

    // Return the response object
    return {
        body: `<html>
                <head>
                  <title>${content.displayName}</title>
                </head>
                <body>
                  <h1>${content.displayName} - we made it!</h1>
                </body>
              </html>`
    }
};
