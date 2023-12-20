import { Content, PartComponent } from '@enonic-types/core';
import type { Response } from '/index.d';

// @ts-expect-error no-types
import {render} from '/lib/thymeleaf';
import {query} from '/lib/xp/content';
import {getComponent, getContent, imageUrl, ImageUrlParams} from '/lib/xp/portal';

type PartDescriptor = "company.starter.myfirstsite:city-list"
type PartConfig = { crop: 'ORGINAL' | 'WIDESCREEN' | 'SQUARE' }
type ContentCity = { photo?: string, slogan?: string, population: string }

// Specify the view file to use
const VIEW = resolve('./city-list.html');

// Handle the GET request
export function get(): Response {

    // Get the part configuration for the map
    const config = getComponent<PartComponent<PartDescriptor, PartConfig>>().config;
    const countryPath = getContent()._path;

    // Get all child item cities's  
    const result = query<Content<ContentCity>>({
        start: 0,
        count: 100,
        contentTypes: [app.name + ':city'],
        query: "_path LIKE '/content" + countryPath + "/*'",
        sort: "modifiedTime DESC"
    });

    // Create a crop based on configuration
    const scale = getImageScale(config.crop)

    // Map results to cities
    const cities = (result.hits || []).map(item=> ({
        name: item.displayName,
        photo: item.data.photo && imageUrl({ id: item.data.photo, scale: scale }),
        caption: getCitySlogan(item.data.slogan,item.data.population)
    }));

    // Set the model object
    const model = {cities};

    // Server log to inspect the model object
    log.info('Model object %s', JSON.stringify(model, null, 4));

    // Prepare the response object
    const response: Response = {
		body: render(VIEW, model)
	};

    return response;
}

function getImageScale(crop: string = 'ORIGINAL'): ImageUrlParams['scale'] {
    if (crop == 'SQUARE') { 
        return 'square(1080)';
    }
    
    if (crop == 'WIDESCREEN') { 
        return 'block(1080,300)';
    }

    return 'width(1080)';
}

function getCitySlogan(slogan: string, population?: string): string {
    return [slogan, population ? 'population: ' + population : '']
        .filter(Boolean)
        .join(' - ');
}