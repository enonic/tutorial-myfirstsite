import type { Response } from '/index.d';

// @ts-expect-error no-types
import { render } from '/lib/thymeleaf';
import { getContent } from '/lib/xp/portal';
import { getStaticAssetUrl } from '../../static';

// Specify the view file to use
const VIEW = resolve('./hello.html');

// Handle the GET request
export function get(): Response {

	// Get the content that is using the page
	const content = getContent();

	// Prepare the model that will be passed to the view
	const model = {
		displayName: content.displayName,
		mainRegion: content.page.regions.main,
		staticCssUrl: getStaticAssetUrl('styles.css'),
	}

	// Prepare the response object
	const response: Response = {
		body: render(VIEW, model)
	};

	return response;
}
