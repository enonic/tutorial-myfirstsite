import type { Response } from '/index.d';

// @ts-expect-error no-types
import {render} from '/lib/thymeleaf';
import {getContent} from '/lib/xp/portal';

// Specify the view file to use
const VIEW = resolve('./country.html');

// Handle the GET request
export function get(): Response {

    // Get the country content as a JSON object
    const content = getContent();

    // Prepare the model object with the needed data from the content
    const model = {
        name: content.displayName,
        population: content.data.population || "Unknown",
        description: content.data.description || "Missing description",
    }

    // Prepare the response object
    const response: Response = {
		body: render(VIEW, model)
	};

    return response;
}